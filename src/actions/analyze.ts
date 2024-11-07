'use server'

import { streamResponse } from '~/actions/iterateStream'
import { apiServer } from '~/trpc/server'
import { GithubDetails, GitHubUser, Repository } from '~/server/api/routers/github/types'
import {
  calculateActivityScore,
  calculateCommunityActivityScore,
  calculateCommunityImpactScore,
  calculateComprehensiveScore,
  calculateContributionIndex,
  calculateContributionsByContributionCalendar,
  calculateContributionScore,
  calculateMonthlyAverageCommits,
  calculateRepositoryWeight,
  calculateTechnicalDepth,
  calculateTechnicalScore,
  calculateTechnologyStackIndex,
  calculateTimeDecay,
  calculateUserWeightedStars,
} from '~/lib/githubAnalysis/algorithms'
import { Metrics } from '~/types/metrics'
import { uniqueCommitContributionsByRepository } from '~/lib/githubAnalysis/utils'
import { inferNationAndSkills } from '~/lib/openai/analyzeGithub'
import { insertAnalysis } from '~/server/mongodb/api'

export const publicAnalyzeAction = streamResponse(async function* (username?: string) {
  try {
    // 查询当前登陆用户信息
    const { data: viewerResult, error: viewerError } = await apiServer.github.getViewer()
    const login = username ? username : viewerResult?.viewer.login
    console.log(login)
    const id = viewerResult?.viewer.id
    if (!login || !id)
      return { index: null, message: null, error: '与Github建立连接失败，请重新登陆尝试。' }
    yield { index: 1, message: '确认GitHub连接正常。', error: viewerError?.toString() }

    // 查询Github Profile
    const { data: baseProfileResult, error: baseProfileError } =
      await apiServer.github.getBaseProfile({
        username: login,
      })
    yield {
      index: 2,
      message: '获取Github Profile成功。',
      error: baseProfileError?.toString(),
    }

    if (!baseProfileResult?.user?.createdAt)
      return {
        index: null,
        message: null,
        error: '解析用户创建时间失败，请重新登陆尝试。',
      }

    // 查询 GitHub Contributions
    const { data: contributionsResult, error: contributionsError } =
      await apiServer.github.getContributions({
        username: login,
        from: new Date(baseProfileResult?.user.createdAt),
      })
    yield {
      index: 3,
      message: '获取Github Contributions成功。',
      error: contributionsError?.toString(),
    }

    // 查询 GitHub Starred Repositories
    const { data: starredRepositoriesResult, error: starredRepositoriesError } =
      await apiServer.github.getStarredRepositories({ username: login })
    yield {
      index: 4,
      message: '获取Github Starred Repositories成功。',
      error: starredRepositoriesError?.toString(),
    }

    // 查询 GitHub Pull Requests
    const { data: pullRequestsResult, error: pullRequestsError } =
      await apiServer.github.getPullRequests({ username: login })
    yield {
      index: 5,
      message: '获取Github Pull Requests成功。',
      error: pullRequestsError?.toString(),
    }

    // 查询 GitHub Issues
    const { data: issuesResult, error: issuesError } = await apiServer.github.getIssues({
      username: login,
    })
    yield {
      index: 6,
      message: '获取Github Issues成功。',
      error: issuesError?.toString(),
    }

    // 查询 GitHub Followers
    const { data: followersResult, error: followersError } = await apiServer.github.getFollowers({
      username: login,
    })
    yield {
      index: 7,
      message: '获取Github Followers成功。',
      error: followersError?.toString(),
    }

    // 查询 GitHub Following
    const { data: followingResult, error: followingError } = await apiServer.github.getFollowing({
      username: login,
    })
    yield {
      index: 8,
      message: '获取Github Following成功。',
      error: followingError?.toString(),
    }

    // 查询 GitHub Repository Discussion Comments
    const { data: repositoryDiscussionCommentsResult, error: repositoryDiscussionCommentsError } =
      await apiServer.github.getRepositoryDiscussionComments({
        username: login,
      })
    yield {
      index: 10,
      message: '获取Github Repository Discussion Comments成功。',
      error: repositoryDiscussionCommentsError?.toString(),
    }

    const originData: GithubDetails = {
      viewer: {
        id: id,
        login: login,
      },
      user: {
        ...baseProfileResult.user,
        ...contributionsResult?.user,
        repositories: contributionsResult
          ? uniqueCommitContributionsByRepository(
              contributionsResult?.user.contributionsCollection.commitContributionsByRepository,
            ).map((item) => item.repository)
          : undefined,
        ...starredRepositoriesResult?.user,
        ...pullRequestsResult?.user,
        ...issuesResult?.user,
        ...followersResult?.user,
        ...followingResult?.user,
        ...repositoryDiscussionCommentsResult?.user,
      },
    }
    yield {
      index: 11,
      message: '获取所有Github Data完成。',
      error: null,
    }

    const analyzedUserResult = await handleOriginGithubData(originData.user)
    yield { index: 12, message: '数据初步分析成功。', error: null }

    const inferUserNationAndSkillsResult =
      await inferUserNationAndSkillsByOpenai(analyzedUserResult)
    yield { index: 13, message: '通过Openai gpt-4o分析推测成功。', error: null }
    const _id = await insertAnalysis({
      ...analyzedUserResult,
      infer: inferUserNationAndSkillsResult,
    })
    yield { index: 14, message: '所有分析活动均已完成。', error: null, slug: login }
  } catch (e) {
    console.error(e)
    return { index: undefined, message: undefined, error: '未知错误。' }
  }
})

const handleOriginGithubData = async (data: GitHubUser) => {
  const { login, repositories, contributionsCollection, createdAt } = data
  const metrics: Metrics = {
    repositories: {},
    contribution: {
      contributionIndex: 0,
      lastYearPeriodicContributionIndex: 0,
      monthlyAverageContributions: 0,
      monthlyActiveDaysAverage: 0,
      lastYearMonthlyActiveDaysAverage: 0,
      lastYearMonthlyAverageContributions: 0,
      lastYearTotalContributions: 0,
      totalContributions: 0,
    },
    activityScore: 0,
    contributionScore: 0,
    technicalScore: 0,
    communityImpactScore: 0,
    communityActivityScore: 0,
    comprehensiveScore: 0,
  }

  // 获取仓库详细数据并分析
  const repositoriesResult: Repository[] = await Promise.all(
    repositories?.map(async (repository) => {
      // 获取仓库提交总数
      const { data: repositoryCommitCountResult } = await apiServer.github.getRepositoryCommitCount(
        {
          owner: repository.owner.login,
          name: repository.name,
        },
      )
      // 获取仓库贡献者
      const { data: repositoryContributorsResult } =
        await apiServer.github.getRepositoryContributors({
          nameWithOwner: repository.nameWithOwner,
        })
      // 获取仓库过去一年每个月的提交总数
      const commitCountsByMonth = await getRepositoryCommitCountsByMonth(repository)

      const monthlyAverageCommits = calculateMonthlyAverageCommits(commitCountsByMonth)
      const issueCount = Number(repository.issues.totalCount)
      const closedIssueCount = repository.closedIssues.totalCount
      const issueCloseRate = issueCount > 0 ? closedIssueCount / issueCount : 0
      const resultMetricsResult = {
        monthlyAverageCommits: monthlyAverageCommits,
        issueCloseRate: issueCloseRate,
        contributorsCount: repository.repositoryContributors?.length,
        issuesCount: issueCount,
        starsCount: repository.stargazerCount,
        forksCount: repository.forkCount,
        pullRequestsCount: repository.pullRequests.totalCount,
        weight: undefined,
      }
      const weight = calculateRepositoryWeight(resultMetricsResult)

      metrics.repositories[repository.nameWithOwner] = {
        ...resultMetricsResult,
        weight,
      }

      return {
        ...repository,
        totalCommits: repositoryCommitCountResult?.totalCount,
        repositoryContributors: repositoryContributorsResult || [], // 返回空数组而不是 null
        commitCountsByMonth: commitCountsByMonth,
        metrics: {
          ...resultMetricsResult,
          weight,
        },
        weight,
      }
    }) || [], // 处理可能为 undefined 的情况
  )

  const contributionMetrics = calculateContributionsByContributionCalendar(
    contributionsCollection.contributionCalendar.weeks,
  )
  const { technologyStackIndex, technologyStack } = calculateTechnologyStackIndex(
    login,
    repositoriesResult,
  )
  const technicalDepth = calculateTechnicalDepth(technologyStack)
  const seniority = calculateTimeDecay(new Date(createdAt))

  metrics.contribution = {
    contributionIndex: repositoriesResult
      ? calculateContributionIndex(login, repositoriesResult)
      : 0,
    ...contributionMetrics,
  }

  metrics.activityScore = calculateActivityScore({
    totalIssues: data.issues.totalCount,
    totalDiscussions: data.repositoryDiscussionComments.totalCount,
    ...contributionMetrics,
  })

  metrics.contributionScore = calculateContributionScore({
    totalIssues: data.issues.totalCount,
    totalDiscussions: data.repositoryDiscussionComments.totalCount,
    totalContributions: contributionMetrics.totalContributions,
    totalPullRequests: data.pullRequests.totalCount,
    contributionIndex: metrics.contribution.contributionIndex,
  })

  metrics.technicalScore = calculateTechnicalScore({
    contributionIndex: metrics.contribution.contributionIndex,
    technologyStackIndex: technologyStackIndex,
    technologyStack: technologyStack,
    technicalDepth: technicalDepth,
    seniority: seniority,
  })

  metrics.communityImpactScore = calculateCommunityImpactScore({
    stars: calculateUserWeightedStars(login, repositoriesResult),
    followers: data.followers.totalCount ?? 0,
  })

  metrics.communityActivityScore = calculateCommunityActivityScore({
    stared: data.starredRepositories.totalCount,
    issues: data.issues.totalCount,
    discussions: data.repositoryDiscussionComments.totalCount,
    following: data.following.totalCount,
  })

  metrics.comprehensiveScore = calculateComprehensiveScore({ ...metrics })

  return {
    ...data,
    repositories: repositoriesResult,
    metrics: metrics,
    languages: technologyStack,
  } as GitHubUser
}

const getRepositoryCommitCountsByMonth = async (repository: Repository) => {
  const { owner, name, createdAt } = repository
  const createdAtDate = new Date(createdAt)
  const nowDate = new Date()
  const oneYearAgo = new Date(nowDate)
  oneYearAgo.setFullYear(nowDate.getFullYear() - 1)

  let since = new Date(createdAtDate > oneYearAgo ? createdAtDate : oneYearAgo)
  let until = new Date(since)
  until.setMonth(since.getMonth() + 1)

  const promiseArray = []

  // 创建一个包含每个月查询请求的数组
  while (until <= nowDate) {
    const start = new Date(since) // 避免传引用
    const end = new Date(until)

    promiseArray.push(
      apiServer.github
        .getRepositoryCommitCountByDateRange({
          owner: owner.login,
          name: name,
          since: start,
          until: end,
        })
        .then((response) => ({
          totalCount: response.data?.totalCount,
          since: start,
          until: end,
        }))
        .catch(() => ({
          totalCount: null,
          since: start,
          until: end,
        })),
    )

    // 更新 `since` 和 `until` 到下一个月
    since.setMonth(since.getMonth() + 1)
    until.setMonth(until.getMonth() + 1)
  }

  // 添加最后的时间段（如果不满月）
  if (since < nowDate) {
    const start = new Date(since)
    const end = new Date(nowDate)

    promiseArray.push(
      apiServer.github
        .getRepositoryCommitCountByDateRange({
          owner: owner.login,
          name: name,
          since: start,
          until: end,
        })
        .then((response) => ({
          totalCount: response.data?.totalCount,
          since: start,
          until: end,
        }))
        .catch(() => ({
          totalCount: null,
          since: start,
          until: end,
        })),
    )
  }

  // 并行执行所有请求
  const settledResults = await Promise.allSettled(promiseArray)

  // 处理并筛选成功的请求结果
  return settledResults.map((result) =>
    result.status === 'fulfilled' ? result.value : { totalCount: null, since: null, until: null },
  )
}

export const inferUserNationAndSkillsByOpenai = async (data: GitHubUser) => {
  let activityTime: Date[] = []
  let readme: string = ''

  if (data.repositories) {
    for (const repository of data.repositories) {
      const { data } = await apiServer.github.getRepositoryReadme({
        owner: repository.owner.login,
        name: repository.name,
      })
      readme += data?.text
    }
  }
  if (data.pullRequests) {
    console.log('pullRequests')
    for (const pullRequest of data.pullRequests.nodes) {
      console.log(pullRequest.author.login, data.login)
      if (pullRequest.author.login !== data.login) continue
      activityTime.push(new Date(pullRequest.createdAt))
    }
  }
  if (data.issues) {
    console.log('issues')
    for (const issue of data.issues.nodes) {
      console.log(issue.author.login, data.login)
      if (issue.author.login !== data.login) continue
      activityTime.push(new Date(issue.createdAt))
    }
  }
  if (data.repositoryDiscussionComments) {
    console.log('repositoryDiscussionComments')
    for (const discussionComment of data.repositoryDiscussionComments.nodes) {
      console.log(discussionComment.author.login, data.login)
      if (discussionComment.author.login !== data.login) continue
      activityTime.push(new Date(discussionComment.createdAt))
    }
  }

  return await inferNationAndSkills(
    `Date: ''>>>''${activityTime.toString()}''<<<''. Readme: ''>>>''${readme}''<<<''`,
  )
}

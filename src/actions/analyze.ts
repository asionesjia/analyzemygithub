'use server'

import { streamResponse } from '~/actions/iterateStream'
import { apiServer } from '~/trpc/server'
import { GithubDetails, GitHubUser, Repository } from '~/server/api/routers/github/types'
import { Metrics } from '~/types/metrics'
import { analyzeContributionData, calculateRepositoryWeight } from '~/lib/githubAnalysis/algorithms'

export const publicAnalyzeAction = streamResponse(async function* () {
  try {
    const { data: viewerResult, error: viewerError } = await apiServer.github.getViewer()
    // const login = viewerResult?.viewer.login
    const login = 'dillionverma'
    if (!login)
      return { index: null, message: null, error: '与Github建立连接失败，请重新登陆尝试。' }
    yield { index: 1, message: '确认GitHub连接正常。', data: viewerResult, error: viewerError }

    const { data: baseProfileResult, error: baseProfileError } =
      await apiServer.github.getBaseProfile({
        username: login,
      })
    yield {
      index: 2,
      message: '获取Github Profile成功。',
      data: baseProfileResult,
      error: baseProfileError,
    }

    if (!baseProfileResult?.user.createdAt)
      return {
        index: null,
        message: null,
        error: '解析用户创建时间失败，请重新登陆尝试。',
      }
    const { data: contributionsResult, error: contributionsError } =
      await apiServer.github.getContributions({
        username: login,
        from: new Date(baseProfileResult?.user.createdAt),
      })
    const contributionData =
      contributionsResult &&
      analyzeContributionData(
        contributionsResult.user.contributionsCollection.contributionCalendar.weeks,
      )
    yield {
      index: 3,
      message: '获取Github Contributions成功。',
      data: contributionsResult,
      contributionData: contributionData,
      error: contributionsError,
    }

    const { data: repositoriesResult, error: repositoriesError } =
      await apiServer.github.getRepositories({ username: login })
    yield {
      index: 4,
      message: '获取Github Repositories成功。',
      data: repositoriesResult,
      error: repositoriesError,
    }

    const { data: topRepositoriesResult, error: topRepositoriesError } =
      await apiServer.github.getTopRepositories({ username: login })
    if (topRepositoriesResult) {
      topRepositoriesResult.user.topRepositories.nodes = await Promise.all(
        topRepositoriesResult?.user.topRepositories.nodes.map(async (node) => {
          const { data: repositoryContributionsResult } =
            await apiServer.github.getRepositoryContributions({ nameWithOwner: node.nameWithOwner })
          const commitCountsByMonth = await getRepositoryCommitCountsByMonth(node)

          return {
            ...node,
            repositoryContributions: repositoryContributionsResult || [], // 返回空数组而不是 null
            commitCountsByMonth: commitCountsByMonth,
          }
        }) || [], // 处理可能为 undefined 的情况
      )
    }
    yield {
      index: 4,
      message: '获取Github Top Repositories成功。',
      data: topRepositoriesResult,
      error: topRepositoriesError,
    }

    const { data: starredRepositoriesResult, error: starredRepositoriesError } =
      await apiServer.github.getStarredRepositories({ username: login })
    yield {
      index: 5,
      message: '获取Github Starred Repositories成功。',
      data: starredRepositoriesResult,
      error: starredRepositoriesError,
    }

    const { data: pullRequestsResult, error: pullRequestsError } =
      await apiServer.github.getPullRequests({ username: login })
    yield {
      index: 6,
      message: '获取Github Pull Requests成功。',
      data: pullRequestsResult,
      error: pullRequestsError,
    }

    const { data: issuesResult, error: issuesError } = await apiServer.github.getIssues({
      username: login,
    })
    yield {
      index: 7,
      message: '获取Github Issues成功。',
      data: issuesResult,
      error: issuesError,
    }

    const { data: followersResult, error: followersError } = await apiServer.github.getFollowers({
      username: login,
    })
    yield {
      index: 8,
      message: '获取Github Followers成功。',
      data: followersResult,
      error: followersError,
    }

    const { data: followingResult, error: followingError } = await apiServer.github.getFollowing({
      username: login,
    })
    yield {
      index: 9,
      message: '获取Github Following成功。',
      data: followingResult,
      error: followingError,
    }

    const { data: organizationsResult, error: organizationsError } =
      await apiServer.github.getOrganizations({
        username: login,
      })
    yield {
      index: 10,
      message: '获取Github Organizations成功。',
      data: organizationsResult,
      error: organizationsError,
    }

    const { data: repositoryDiscussionCommentsResult, error: repositoryDiscussionCommentsError } =
      await apiServer.github.getRepositoryDiscussionComments({
        username: login,
      })
    yield {
      index: 11,
      message: '获取Github Repository Discussion Comments成功。',
      data: repositoryDiscussionCommentsResult,
      error: repositoryDiscussionCommentsError,
    }

    const originData: GithubDetails = {
      viewer: {
        login: login,
      },
      user: {
        ...baseProfileResult.user,
        ...contributionsResult?.user,
        ...topRepositoriesResult?.user,
        ...repositoriesResult?.user,
        ...starredRepositoriesResult?.user,
        ...pullRequestsResult?.user,
        ...issuesResult?.user,
        ...followersResult?.user,
        ...followingResult?.user,
        ...organizationsResult?.user,
        ...repositoryDiscussionCommentsResult?.user,
      },
    }
    yield {
      index: 12,
      message: '获取所有Github Data完成。',
      data: originData,
      error: null,
    }

    const metrics = handleOriginGithubData(originData.user)
    yield { index: 12, message: '数据分析成功。', metrics }
  } catch (e) {
    console.error(e)
    return { index: undefined, message: undefined, error: '未知错误。' }
  }
})

const handleOriginGithubData = (data: GitHubUser) => {
  const { topRepositories } = data
  const metrics: Metrics = {
    repositories: {},
  }
  for (const node of topRepositories.nodes) {
    const nameWithOwner = node.nameWithOwner
    const monthlyAverageCommits = calculateMonthlyAverageCommits(node.commitCountsByMonth)
    const issueCount = Number(node.issues.totalCount)
    const closedIssueCount = node.closedIssues.totalCount
    const issueCloseRate = issueCount > 0 ? closedIssueCount / issueCount : 0
    const metricsResult = {
      monthlyAverageCommits: monthlyAverageCommits,
      issueCloseRate: issueCloseRate,
      contributorsCount: node.repositoryContributions?.length,
      issuesCount: issueCount,
      starsCount: node.stargazerCount,
      forksCount: node.forkCount,
      pullRequestsCount: node.pullRequests.totalCount,
      weight: undefined,
    }
    const weight = calculateRepositoryWeight(metricsResult)
    metrics.repositories[nameWithOwner] = {
      ...metricsResult,
      weight: node.isFork ? 0 : weight,
    }
  }
  return metrics
}

export const getRepositoryCommitCountsByMonth = async (repository: Repository) => {
  const { owner, name, createdAt } = repository
  const startDate = new Date(createdAt)
  const nowDate = new Date()

  let since = new Date(startDate)
  let until = new Date(since)
  until.setMonth(until.getMonth() + 1)

  const promiseArray = []

  // 创建一个包含每个月查询请求的数组
  while (until <= nowDate) {
    promiseArray.push(
      apiServer.github
        .getRepositoryCommitCount({
          owner: owner.login,
          name: name,
          since: new Date(since),
          until: new Date(until),
        })
        .then((response) => ({
          totalCount: response.data?.totalCount,
          since: new Date(since),
          until: new Date(until),
        })),
    )

    // 更新 `since` 和 `until` 到下一个月
    since.setMonth(since.getMonth() + 1)
    until.setMonth(until.getMonth() + 1)
  }

  // 添加最后的时间段（如果不满月）
  if (since < nowDate) {
    promiseArray.push(
      apiServer.github
        .getRepositoryCommitCount({
          owner: owner.login,
          name: name,
          since: new Date(since),
          until: new Date(nowDate),
        })
        .then((response) => ({
          totalCount: response.data?.totalCount,
          since: new Date(since),
          until: new Date(nowDate),
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
const calculateMonthlyAverageCommits = (
  commitCountsByMonth?: {
    totalCount: number | null | undefined
    since: Date | null | undefined
    until: Date | null | undefined
  }[],
): number | undefined => {
  if (!commitCountsByMonth || commitCountsByMonth.length === 0) {
    return undefined
  }

  let totalCommits = 0
  let monthsWithData = 0

  for (const entry of commitCountsByMonth) {
    if (entry.totalCount != null) {
      totalCommits += entry.totalCount
      monthsWithData += 1
    }
  }

  if (monthsWithData === 0) {
    return undefined // 没有有效的提交数据
  }

  return totalCommits / monthsWithData
}

'use server'

import { streamResponse } from '~/actions/iterateStream'
import { apiServer } from '~/trpc/server'

export const publicAnalyzeAction = streamResponse(async function* () {
  try {
    const { data: viewerResult, error: viewerError } = await apiServer.github.getViewer()
    // const login = viewerResult?.viewer.login
    const login = 'VikParuchuri'
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
    yield {
      index: 3,
      message: '获取Github Contributions成功。',
      data: contributionsResult,
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

    const { data: projectsV2Result, error: projectsV2Error } = await apiServer.github.getProjectsV2(
      {
        username: login,
      },
    )
    yield {
      index: 11,
      message: '获取Github ProjectsV2成功。',
      data: projectsV2Result,
      error: projectsV2Error,
    }
  } catch (e) {
    console.error(e)
    return { index: undefined, message: undefined, error: '未知错误。' }
  }
})

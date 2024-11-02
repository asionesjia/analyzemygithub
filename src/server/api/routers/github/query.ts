import {
  QUERY_BASE_PROFILE,
  QUERY_CONTRIBUTIONS,
  QUERY_FOLLOWERS,
  QUERY_FOLLOWING,
  QUERY_ISSUES,
  QUERY_ORGANIZATIONS,
  QUERY_PROJECTS_V2,
  QUERY_PULL_REQUESTS,
  QUERY_REPOSITORIES,
  QUERY_STARRED_REPOSITORIES,
  QUERY_VIEWER,
} from '~/server/api/routers/github/data'
import {
  BaseProfile,
  Contributions,
  Followers,
  Following,
  GithubError,
  Issues,
  Organizations,
  ProjectsV2,
  PullRequests,
  Repositories,
  StarredRepositories,
  Viewer,
} from '~/server/api/routers/github/types'
import { Octokit } from '@octokit/core'
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql'

const MyOctokit = Octokit.plugin(paginateGraphQL)

export const queryViewer = async (access_token: string) => {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${access_token}`, // 如果需要授权
    },
    body: JSON.stringify({
      query: QUERY_VIEWER,
    }),
  })
  const { data, errors } = await response.json()
  return {
    data: data as Viewer,
    error: errors as GithubError[],
  }
}

export const queryBaseProfile = async (access_token: string, username: string) => {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${access_token}`, // 如果需要授权
    },
    body: JSON.stringify({
      query: QUERY_BASE_PROFILE,
      variables: { username }, // 如果有变量的话可以在这里传递
    }),
  })

  const { data, errors } = await response.json()
  return {
    data: data as BaseProfile,
    error: errors as GithubError[],
  }
}

export const queryContributions = async (
  access_token: string,
  username: string,
  from?: string,
  to?: string,
) => {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${access_token}`, // 如果需要授权
      },
      body: JSON.stringify({
        query: QUERY_CONTRIBUTIONS(from, to),
        variables: { username, from, to }, // 如果有变量的话可以在这里传递
      }),
    })

    const { data, errors } = await response.json()
    if (errors?.[0].type === 'INTERNAL') {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${access_token}`, // 如果需要授权
        },
        body: JSON.stringify({
          query: QUERY_CONTRIBUTIONS(from, to),
          variables: { username, from, to }, // 如果有变量的话可以在这里传递
        }),
      })
      const { data, errors } = await response.json()
      console.log('######### 重新请求 ##########')
      console.log('result: ', data, errors)
      return { data: data as Contributions, error: errors as GithubError[] }
    }
    return { data: data as Contributions, error: errors as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误。' }
  }
}

export const queryRepositories = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let repositoriesResult: Repositories = {
      user: {
        repositories: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let repositoriesError: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_REPOSITORIES, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.repositories.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        repositoriesResult.user.repositories.nodes.push(...nodes)
        repositoriesResult.user.repositories.totalCount = response.user.repositories.totalCount
      }
    }
    return { data: repositoriesResult, error: repositoriesError as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

export const queryStarredRepositories = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let starredRepositoriesResult: StarredRepositories = {
      user: {
        starredRepositories: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let starredRepositoriesError: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_STARRED_REPOSITORIES, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.starredRepositories.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        starredRepositoriesResult.user.starredRepositories.nodes.push(...nodes)
        starredRepositoriesResult.user.starredRepositories.totalCount =
          response.user.starredRepositories.totalCount
      }
    }
    return { data: starredRepositoriesResult, error: starredRepositoriesError as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

export const queryPullRequests = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let pullRequestsResult: PullRequests = {
      user: {
        pullRequests: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let pullRequestsError: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_PULL_REQUESTS, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.pullRequests.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        pullRequestsResult.user.pullRequests.nodes.push(...nodes)
        pullRequestsResult.user.pullRequests.totalCount = response.user.pullRequests.totalCount
      }
    }
    return { data: pullRequestsResult, error: pullRequestsError as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

export const queryIssues = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let issuesResult: Issues = {
      user: {
        issues: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let issuesError: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_ISSUES, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.issues.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        issuesResult.user.issues.nodes.push(...nodes)
        issuesResult.user.issues.totalCount = response.user.issues.totalCount
      }
    }
    return { data: issuesResult, error: issuesError as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

export const queryFollowers = async (access_token: string, username: string) => {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${access_token}`, // 如果需要授权
      },
      body: JSON.stringify({
        query: QUERY_FOLLOWERS,
        variables: { username }, // 如果有变量的话可以在这里传递
      }),
    })

    const { data, errors } = await response.json()
    return {
      data: data as Followers,
      error: errors as GithubError[],
    }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

export const queryFollowing = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let followingResult: Following = {
      user: {
        following: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let followingError: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_FOLLOWING, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.following.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        followingResult.user.following.nodes.push(...nodes)
        followingResult.user.following.totalCount = response.user.following.totalCount
      }
    }
    return { data: followingResult, error: followingError as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}
export const queryOrganizations = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let organizationsResult: Organizations = {
      user: {
        organizations: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let organizationsError: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_ORGANIZATIONS, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.organizations.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        organizationsResult.user.organizations.nodes.push(...nodes)
        organizationsResult.user.organizations.totalCount = response.user.organizations.totalCount
      }
    }
    return { data: organizationsResult, error: organizationsError as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

export const queryProjectsV2 = async (access_token: string, username: string) => {
  try {
    const octokit = new MyOctokit({ auth: access_token })
    let projectsV2Result: ProjectsV2 = {
      user: {
        projectsV2: {
          nodes: [],
          totalCount: 0,
        },
      },
    }
    let projectsV2Error: GithubError[] = []
    const pageIterator = octokit.graphql.paginate.iterator(QUERY_PROJECTS_V2, { username })
    for await (const response of pageIterator) {
      const nodes = response.user.projectsV2.nodes
      if (nodes && typeof nodes === 'object' && nodes.length > 0) {
        projectsV2Result.user.projectsV2.nodes.push(...nodes)
        projectsV2Result.user.projectsV2.totalCount = response.user.projectsV2.totalCount
      }
    }
    return { data: projectsV2Result, error: projectsV2Error as GithubError[] }
  } catch (e) {
    console.log(e)
    return { data: null, error: '未知错误' }
  }
}

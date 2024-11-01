import {
  QUERY_BASE_PROFILE,
  QUERY_CONTRIBUTIONS,
  QUERY_VIEWER,
} from '~/server/api/routers/github/data'
import { BaseProfile, Contributions, GithubError, Viewer } from '~/server/api/routers/github/types'

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

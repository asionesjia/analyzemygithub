import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import {
  Contributions,
  GithubError,
  RepositoryContributorConnection,
} from '~/server/api/routers/github/types'
import {
  queryBaseProfile,
  queryContributions,
  queryFollowers,
  queryFollowing,
  queryIssues,
  queryOrganizations,
  queryProjectsV2,
  queryPullRequests,
  queryRepositories,
  queryRepositoryCommitCount,
  queryRepositoryCommitCountByDateRange,
  queryRepositoryContributors,
  queryRepositoryDiscussionComments,
  queryRepositoryReadme,
  queryStarredRepositories,
  queryTopRepositories,
  queryUserCommitCountInRepositoryById,
  queryViewer,
} from '~/server/api/routers/github/query'
import { mergeContributions } from '~/server/api/routers/github/utils'

export const githubRouter = createTRPCRouter({
  getViewer: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.githubAccessToken) {
      return {
        data: null,
        error: '用户未登陆。',
      }
    }
    try {
      const { data, error } = await queryViewer(ctx.session.user.githubAccessToken!)
      return {
        data: data,
        error: error,
      }
    } catch (e) {
      console.log(e)
      return {
        data: null,
        error: '查询失败',
      }
    }
  }),

  getBaseProfile: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryBaseProfile(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return { data, error }
      } catch (e) {
        console.log(e)
        return { data: null, error: '查询失败' }
      }
    }),

  getContributions: protectedProcedure
    .input(z.object({ username: z.string(), from: z.date(), to: z.date().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const username: string = input.username
        let resultData: Contributions = {
          viewer: {
            id: '',
            login: '',
          },
          user: {
            contributionsCollection: {
              totalCommitContributions: 0,
              totalIssueContributions: 0,
              totalPullRequestContributions: 0,
              totalRepositoryContributions: 0,
              commitContributionsByRepository: [],
              contributionCalendar: {
                totalContributions: 0,
                weeks: [],
              },
            },
          },
        }
        const resultError: GithubError[] = []
        if (input.from && !input.to) {
          let from: Date = input.from
          let to: Date = new Date(input.from)
          for (const now = new Date(); from <= now; from.setFullYear(from.getFullYear() + 1)) {
            to.setFullYear(to.getFullYear() + 1)
            const fromString = from.toISOString()
            const toString = to <= now ? to.toISOString() : now.toISOString()
            const { data, error } = await queryContributions(
              ctx.session.user.githubAccessToken!,
              username,
              fromString,
              toString,
            )
            if (data && data?.viewer && data?.user) {
              resultData = mergeContributions(resultData, data)
            }
            if (typeof error === 'string') {
              resultError.push({ type: 'Server', message: error })
            } else {
              error && resultError.push(...error)
            }
          }
          return { data: resultData, error: resultError }
        } else if (input.from && input.to) {
          // 如果 from 和 to 同时存在，按需求进行循环
          let fromTo = new Date(input.from)

          while (fromTo < input.to) {
            const fromLeft = fromTo
            fromTo.setFullYear(fromTo.getFullYear() + 1)
            const { data, error } = await queryContributions(
              ctx.session.user.githubAccessToken!,
              username,
              fromLeft.toISOString(),
              fromTo > input.to ? input.to.toISOString() : fromTo.toISOString(),
            )
            if (data && data?.viewer && data?.user) {
              resultData = mergeContributions(resultData, data)
            }
            if (typeof error === 'string') {
              resultError.push({ type: 'Server', message: error })
            } else {
              error && resultError.push(...error)
            }
          }
        }
        return { data: resultData, error: resultError }
      } catch (e) {
        console.log(e)
        return { data: null, error: '查询失败' }
      }
    }),
  getRepositories: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryRepositories(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getTopRepositories: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryTopRepositories(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getStarredRepositories: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryStarredRepositories(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getPullRequests: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryPullRequests(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getIssues: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryIssues(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getFollowers: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryFollowers(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getFollowing: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryFollowing(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getOrganizations: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryOrganizations(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getProjectsV2: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryProjectsV2(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getRepositoryDiscussionComments: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryRepositoryDiscussionComments(
          ctx.session.user.githubAccessToken!,
          input.username,
        )
        return {
          data: data,
          error: error,
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getRepositoryContributors: protectedProcedure
    .input(z.object({ nameWithOwner: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryRepositoryContributors(
          ctx.session.user.githubAccessToken!,
          input.nameWithOwner,
        )
        return {
          data: data ? (data as RepositoryContributorConnection[]) : null,
          error: '',
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getRepositoryCommitCount: protectedProcedure
    .input(z.object({ owner: z.string(), name: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryRepositoryCommitCount(
          ctx.session.user.githubAccessToken!,
          input.owner,
          input.name,
        )
        return {
          data: data ? (data as { totalCount: number }) : null,
          error: '',
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getRepositoryCommitCountByDateRange: protectedProcedure
    .input(z.object({ owner: z.string(), name: z.string(), since: z.date(), until: z.date() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryRepositoryCommitCountByDateRange(
          ctx.session.user.githubAccessToken!,
          input.owner,
          input.name,
          input.since,
          input.until,
        )
        return {
          data: data ? (data as { totalCount: number }) : null,
          error: '',
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getUserCommitCountInRepositoryById: protectedProcedure
    .input(z.object({ id: z.string(), owner: z.string(), name: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryUserCommitCountInRepositoryById(
          ctx.session.user.githubAccessToken!,
          input.id,
          input.owner,
          input.name,
        )
        return {
          data: data ? (data as { totalCount: number }) : null,
          error: '',
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
  getRepositoryReadme: protectedProcedure
    .input(z.object({ owner: z.string(), name: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.githubAccessToken) {
        return {
          data: null,
          error: '用户未登陆。',
        }
      }
      try {
        const { data, error } = await queryRepositoryReadme(
          ctx.session.user.githubAccessToken!,
          input.owner,
          input.name,
        )
        return {
          data: data ? (data as { text: string }) : null,
          error: '',
        }
      } catch (e) {
        console.log(e)
        return {
          data: null,
          error: '查询失败',
        }
      }
    }),
})

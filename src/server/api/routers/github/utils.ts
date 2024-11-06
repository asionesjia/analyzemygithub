import { Contributions } from '~/server/api/routers/github/types'

export function mergeContributions(oldData: Contributions, newData: Contributions): Contributions {
  // 合并 ContributionsCollection 各字段的值
  const oldCollection = oldData.user.contributionsCollection
  const newCollection = newData.user.contributionsCollection

  // 返回合并后的对象
  return {
    viewer: {
      id: oldData.viewer.id === newData.viewer.id ? oldData.viewer.id : newData.viewer.id,
      login:
        oldData.viewer.login === newData.viewer.login ? oldData.viewer.login : newData.viewer.login,
    },
    user: {
      contributionsCollection: {
        // 合并数值字段
        totalCommitContributions:
          oldCollection.totalCommitContributions + newCollection.totalCommitContributions,
        totalPullRequestContributions:
          oldCollection.totalPullRequestContributions + newCollection.totalPullRequestContributions,
        totalIssueContributions:
          oldCollection.totalIssueContributions + newCollection.totalIssueContributions,
        totalRepositoryContributions:
          oldCollection.totalRepositoryContributions + newCollection.totalRepositoryContributions,

        // 合并数组字段
        commitContributionsByRepository: [
          ...oldCollection.commitContributionsByRepository,
          ...newCollection.commitContributionsByRepository,
        ],

        contributionCalendar: {
          totalContributions:
            oldCollection.contributionCalendar.totalContributions +
            newCollection.contributionCalendar.totalContributions,
          weeks: [
            ...oldCollection.contributionCalendar.weeks,
            ...newCollection.contributionCalendar.weeks,
          ],
        },
      },
    },
  }
}

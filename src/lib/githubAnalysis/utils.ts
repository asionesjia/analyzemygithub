// Helper function: Calculate ISO week number (1-53)
import { Repository } from '~/server/api/routers/github/types'

export function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const jan4 = new Date(target.getFullYear(), 0, 4)
  const dayDiff = (target.getTime() - jan4.getTime()) / 86400000
  return 1 + Math.floor(dayDiff / 7)
}

// 计算两个日期之间的月份差
export function differenceInMonths(dateA: Date, dateB: Date): number {
  return (dateA.getFullYear() - dateB.getFullYear()) * 12 + (dateA.getMonth() - dateB.getMonth())
}

/**
 * 对仓库列表进行去重
 * @param repositories
 */
export const uniqueCommitContributionsByRepository = (
  repositories: { repository: Repository }[],
) => {
  const uniqueMap = new Map()
  repositories.forEach(({ repository }) => {
    uniqueMap.set(repository.nameWithOwner, repository)
  })
  return Array.from(uniqueMap.values()).map((repo) => ({ repository: repo }))
}

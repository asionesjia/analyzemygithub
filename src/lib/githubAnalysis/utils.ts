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

/**
 * 对language technical stack去重
 * @param array
 */
export function mergeAndDeduplicateByName(array: { name: string; size: number }[]) {
  const result = array.reduce<Record<string, { name: string; size: number }>>((acc, current) => {
    // 如果 `acc` 中已经存在同名项，则累加其 `size`
    if (acc[current.name]) {
      acc[current.name]!.size += current.size
    } else {
      // 如果 `acc` 中没有此 `name`，则添加新项
      acc[current.name] = { ...current }
    }
    return acc
  }, {})

  // 将去重后的对象值转换为数组返回
  return Object.values(result)
}

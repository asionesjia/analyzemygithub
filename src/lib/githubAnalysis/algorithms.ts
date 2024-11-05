import {RepositoryMetricsConnection} from '~/types/metrics'
import {Factors} from '~/config/analysis-factors'
import {ContributionWeek} from '~/server/api/routers/github/types'
import {differenceInMonths, getISOWeek} from '~/lib/githubAnalysis/utils'

/**
 * 计算仓库权重分
 * @param metrics
 */
export const calculateRepositoryWeight = (metrics: RepositoryMetricsConnection): number => {
  // 定义每个指标的权重
  const weightFactor = Factors.repositoryMetrics.weightFactor
  const smoothingFactor = Factors.repositoryMetrics.smoothingFactor

  // 计算权重分
  let totalWeight = 0

  totalWeight +=
    metrics.issuesCount && metrics.issueCloseRate && metrics.issuesCount >= 10
      ? (metrics.issueCloseRate / (metrics.issueCloseRate + smoothingFactor.issueCloseRate)) *
        weightFactor.issueCloseRate
      : 0
  totalWeight += metrics.monthlyAverageCommits
    ? (metrics.monthlyAverageCommits /
        (metrics.monthlyAverageCommits + smoothingFactor.monthlyAverageCommits)) *
      weightFactor.monthlyAverageCommits
    : 0
  totalWeight += metrics.contributorsCount
    ? (metrics.contributorsCount /
        (metrics.contributorsCount + smoothingFactor.contributorsCount)) *
      weightFactor.contributorsCount
    : 0
  totalWeight += metrics.starsCount
    ? (metrics.starsCount / (metrics.starsCount + smoothingFactor.starsCount)) *
      weightFactor.starsCount
    : 0
  totalWeight += metrics.forksCount
    ? (metrics.forksCount / (metrics.forksCount + smoothingFactor.forksCount)) *
      weightFactor.forksCount
    : 0
  totalWeight += metrics.issuesCount
    ? (metrics.issuesCount / (metrics.issuesCount + smoothingFactor.issuesCount)) *
      weightFactor.issuesCount
    : 0
  totalWeight += metrics.pullRequestsCount
    ? (metrics.pullRequestsCount /
        (metrics.pullRequestsCount + smoothingFactor.pullRequestsCount)) *
      weightFactor.pullRequestsCount
    : 0

  return totalWeight
}

type ContributionAnalysis = {
  totalContributions: number // 总贡献数
  lastYearTotalContributions: number // 近一年总贡献数
  monthlyAverageContributions: number
  lastYearMonthlyAverageContributions: number
  monthlyActiveDaysAverage: number
  lastYearMonthlyActiveDaysAverage: number
  lastYearPeriodicContributionIndex: number
}

/**
 * 依据ContributionsDays计算用户的“总贡献数”、“近一年总贡献数”、“月均贡献数”、“近一年的月均贡献数”，“月均活跃天数”，“近一年的月均活跃天数”、“近一年周期贡献指数”
 * @param contributionWeeks
 */
export function analyzeContributionData(
  contributionWeeks: ContributionWeek[],
): ContributionAnalysis {
  let totalContributions = 0 // 总贡献数
  let lastYearTotalContributions = 0 // 近一年总贡献数
  let totalActiveDays = 0 // 总活跃天数
  let lastYearActiveDays = 0 // 近一年活跃天数

  const contributionsByWeek: Record<string, number[]> = {} // 每周的贡献数据
  const currentDate = new Date()
  const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth())

  // 用于记录日期范围的最小和最大日期
  let firstDate: Date | null = null
  let lastDate: Date | null = null

  for (const week of contributionWeeks) {
    for (const { date, contributionCount } of week.contributionDays) {
      const contributionDate = new Date(date)
      totalContributions += contributionCount // 累计总贡献数

      if (contributionCount > 0) {
        totalActiveDays += 1 // 统计活跃天数
      }

      if (contributionDate > oneYearAgo) {
        lastYearTotalContributions += contributionCount // 累计近一年贡献数
        if (contributionCount > 0) {
          lastYearActiveDays += 1 // 统计近一年活跃天数
        }
      }

      // 记录日期范围
      if (!firstDate || contributionDate < firstDate) {
        firstDate = contributionDate
      }
      if (!lastDate || contributionDate > lastDate) {
        lastDate = contributionDate
      }

      // 计算 ISO 周并追踪每周贡献
      const weekKey = `${contributionDate.getFullYear()}-${getISOWeek(contributionDate)}`

      // 初始化 contributionsByWeek[weekKey] 确保其为数组
      if (!contributionsByWeek[weekKey]) {
        contributionsByWeek[weekKey] = Array(7).fill(0)
      }

      // 使用非空断言 `!` 以避免 TS2532 错误
      contributionsByWeek[weekKey]![contributionDate.getDay()]! += contributionCount // 增加对应周的贡献
    }
  }

  // 计算近一年的周期贡献指数
  let consistentContributions = 0
  let weekCount = 0 // 周数

  for (const week in contributionsByWeek) {
    const weeklyContributions = contributionsByWeek[week]!
    const weekDate = new Date(Number(week.split('-')[0]), 0, 1) // 提取周的年份（假设1月1日为周的开始）
    weekDate.setDate(weekDate.getDate() + (parseInt(week.split('-')[1]!) - 1) * 7) // 计算出这一周的实际日期

    if (weekDate > oneYearAgo) {
      // 只计算近一年的周
      weekCount++

      // 计算活跃天数
      const activeDaysInWeek = weeklyContributions.filter((count) => count > 0).length

      // 计算周期贡献指标
      const contributionFactor = weeklyContributions.reduce((sum, count) => sum + count, 0) / 10

      // 使用贡献天数和每周贡献总和来计算指数
      const contributionIndex =
        activeDaysInWeek > 0 ? Math.min((contributionFactor * activeDaysInWeek) / 5, 1) : 0
      consistentContributions += contributionIndex
    }
  }

  const lastYearPeriodicContributionIndex = weekCount > 0 ? consistentContributions / weekCount : 0 // 周期贡献指数

  // 计算实际的月数
  const totalMonths = firstDate && lastDate ? differenceInMonths(lastDate, firstDate) + 1 : 0
  const lastYearMonths =
    oneYearAgo < (lastDate || new Date())
      ? differenceInMonths(lastDate || new Date(), oneYearAgo) + 1
      : 0

  return {
    totalContributions, // 返回总贡献数
    lastYearTotalContributions, // 返回近一年总贡献数
    monthlyAverageContributions: totalMonths > 0 ? totalContributions / totalMonths : 0, // 计算月均贡献数
    lastYearMonthlyAverageContributions:
      lastYearMonths > 0 ? lastYearTotalContributions / lastYearMonths : 0, // 计算近一年月均贡献数
    monthlyActiveDaysAverage: totalMonths > 0 ? totalActiveDays / totalMonths : 0, // 计算月均活跃天数
    lastYearMonthlyActiveDaysAverage: lastYearMonths > 0 ? lastYearActiveDays / lastYearMonths : 0, // 计算近一年月均活跃天数
    lastYearPeriodicContributionIndex, // 返回过去一年周期贡献指数
  }
}

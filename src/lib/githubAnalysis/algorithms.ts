import { RepositoryMetricsConnection } from '~/types/metrics'
import { Factors } from '~/config/analysis-metric-factors'
import { ContributionWeek, Repository } from '~/server/api/routers/github/types'
import {
  differenceInMonths,
  getISOWeek,
  mergeAndDeduplicateByName,
} from '~/lib/githubAnalysis/utils'

type calculateComprehensiveScore = {
  activityScore: number
  contributionScore: number
  technicalScore: number
  communityImpactScore: number
  communityActivityScore: number
}

export const calculateComprehensiveScore = ({
  activityScore,
  contributionScore,
  technicalScore,
  communityImpactScore,
  communityActivityScore,
}: calculateComprehensiveScore) => {
  const weightFactor = Factors.comprehensiveScoreScore.weightFactor

  let comprehensiveScore = 0

  comprehensiveScore += activityScore * weightFactor.activityScore
  comprehensiveScore += contributionScore * weightFactor.contributionScore
  comprehensiveScore += technicalScore * weightFactor.technicalScore
  comprehensiveScore += communityImpactScore * weightFactor.communityImpactScore
  comprehensiveScore += communityActivityScore * weightFactor.communityActivityScore

  return comprehensiveScore
}

type calculateActivityScoreProps = {
  totalIssues: number
  totalDiscussions: number
  monthlyAverageContributions: number
  lastYearMonthlyAverageContributions: number
  monthlyActiveDaysAverage: number
  lastYearMonthlyActiveDaysAverage: number
  lastYearPeriodicContributionIndex: number
}
/**
 * 计算活跃分
 * @param totalIssues
 * @param totalDiscussions
 * @param monthlyAverageContributions
 * @param lastYearMonthlyAverageContributions
 * @param monthlyActiveDaysAverage
 * @param lastYearMonthlyActiveDaysAverage
 * @param lastYearPeriodicContributionIndex
 */
export const calculateActivityScore = ({
  totalIssues,
  totalDiscussions,
  monthlyAverageContributions,
  lastYearMonthlyAverageContributions,
  monthlyActiveDaysAverage,
  lastYearMonthlyActiveDaysAverage,
  lastYearPeriodicContributionIndex,
}: calculateActivityScoreProps) => {
  const weightFactor = Factors.activityScore.weightFactor
  const smoothingFactor = Factors.activityScore.smoothingFactor

  let activityScore = 0

  activityScore +=
    (totalIssues / (totalIssues + smoothingFactor.totalIssues)) * weightFactor.totalIssues
  activityScore +=
    (totalDiscussions / (totalDiscussions + smoothingFactor.totalDiscussions)) *
    weightFactor.totalDiscussions
  activityScore +=
    (monthlyAverageContributions /
      (monthlyAverageContributions + smoothingFactor.monthlyAverageContributions)) *
    weightFactor.monthlyAverageContributions
  activityScore +=
    (lastYearMonthlyAverageContributions /
      (lastYearMonthlyAverageContributions + smoothingFactor.lastYearMonthlyAverageContributions)) *
    weightFactor.lastYearMonthlyAverageContributions
  activityScore +=
    (monthlyActiveDaysAverage /
      (monthlyActiveDaysAverage + smoothingFactor.monthlyActiveDaysAverage)) *
    weightFactor.monthlyActiveDaysAverage
  activityScore +=
    (lastYearMonthlyActiveDaysAverage /
      (lastYearMonthlyActiveDaysAverage + smoothingFactor.lastYearMonthlyActiveDaysAverage)) *
    weightFactor.lastYearMonthlyActiveDaysAverage
  activityScore +=
    lastYearPeriodicContributionIndex * weightFactor.lastYearPeriodicContributionIndex

  return activityScore
}

type calculateContributionScoreProps = {
  totalContributions: number
  totalIssues: number
  totalDiscussions: number
  totalPullRequests: number
  contributionIndex: number
}
/**
 * 计算贡献分
 * @param totalContributions
 * @param totalIssues
 * @param totalDiscussions
 * @param totalPullRequests
 * @param contributionIndex
 */
export const calculateContributionScore = ({
  totalContributions,
  totalIssues,
  totalDiscussions,
  totalPullRequests,
  contributionIndex,
}: calculateContributionScoreProps) => {
  const weightFactor = Factors.contributionScore.weightFactor
  const smoothingFactor = Factors.contributionScore.smoothingFactor

  let contributionScore = 0

  contributionScore +=
    (totalContributions / (totalContributions + smoothingFactor.totalContributions)) *
    weightFactor.totalContributions
  contributionScore +=
    (totalIssues / (totalIssues + smoothingFactor.totalIssues)) * weightFactor.totalIssues
  contributionScore +=
    (totalDiscussions / (totalDiscussions + smoothingFactor.totalDiscussions)) *
    weightFactor.totalDiscussions
  contributionScore +=
    (totalPullRequests / (totalPullRequests + smoothingFactor.totalPullRequests)) *
    weightFactor.totalPullRequests
  contributionScore +=
    (contributionIndex / (contributionIndex + smoothingFactor.contributionIndex)) *
    weightFactor.contributionIndex

  return contributionScore
}

type calculateTechnicalScoreProps = {
  contributionIndex: number
  technologyStackIndex: number
  technologyStack: { name: string; size: number }[]
  technicalDepth: number
  seniority: number
}
/**
 * 计算技术分
 * @param data
 */
export const calculateTechnicalScore = ({
  contributionIndex,
  technologyStackIndex,
  technologyStack,
  technicalDepth,
  seniority,
}: calculateTechnicalScoreProps) => {
  const technicalBreadth = technologyStack.length

  const weightFactor = Factors.technicalScore.weightFactor
  const smoothingFactor = Factors.technicalScore.smoothingFactor

  let technicalScore = 0

  technicalScore +=
    (contributionIndex / (contributionIndex + smoothingFactor.contributionIndex)) *
    weightFactor.contributionIndex
  technicalScore +=
    (technologyStackIndex / (technologyStackIndex + smoothingFactor.technologyStackIndex)) *
    weightFactor.technologyStackIndex
  technicalScore +=
    (technicalBreadth / (technicalBreadth + smoothingFactor.technicalBreadth)) *
    weightFactor.technicalBreadth
  technicalScore += technicalDepth * weightFactor.technicalDepth
  technicalScore += seniority * weightFactor.seniority

  return technicalScore
}

type communityImpactScoreProps = {
  stars: number
  followers: number
}
/**
 * 计算社区影响力分数
 * @param stars
 * @param followers
 */
export const calculateCommunityImpactScore = ({ stars, followers }: communityImpactScoreProps) => {
  const weightFactor = Factors.communityImpactScore.weightFactor
  const smoothingFactor = Factors.communityImpactScore.smoothingFactor

  let communityImpactScore = 0

  communityImpactScore += (stars / (stars + smoothingFactor.stars)) * weightFactor.stars
  communityImpactScore +=
    (followers / (followers + smoothingFactor.followers)) * weightFactor.followers

  return communityImpactScore
}

type communityActivityScoreProps = {
  issues: number
  discussions: number
  stared: number
  following: number
}
/**
 * 计算社区活跃度分数
 * @param issues
 * @param discussions
 * @param stared
 * @param following
 */
export const calculateCommunityActivityScore = ({
  issues,
  discussions,
  stared,
  following,
}: communityActivityScoreProps) => {
  const weightFactor = Factors.communityActivityScore.weightFactor
  const smoothingFactor = Factors.communityActivityScore.smoothingFactor

  let communityActivityScore = 0

  communityActivityScore += (issues / (issues + smoothingFactor.issues)) * weightFactor.issues
  communityActivityScore +=
    (discussions / (discussions + smoothingFactor.discussions)) * weightFactor.discussions
  communityActivityScore += (stared / (stared + smoothingFactor.stared)) * weightFactor.stared
  communityActivityScore +=
    (following / (following + smoothingFactor.following)) * weightFactor.following

  return communityActivityScore
}

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
export function calculateContributionsByContributionCalendar(
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

/**
 * 计算月均提交数
 * @param commitCountsByMonth
 */
export const calculateMonthlyAverageCommits = (
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

/**
 * 依据仓库权重计算用户所有贡献仓库的贡献度
 * @param login
 * @param repositories
 */
export const calculateContributionIndex = (login: string, repositories: Repository[]) => {
  let contributionIndex = 0
  for (const repository of repositories) {
    const contributions =
      repository.repositoryContributors?.find((item) => item.login === login)?.contributions ?? 0
    const totalCommits =
      repository?.totalCommits && repository.totalCommits !== 0 ? repository.totalCommits : 1
    const weight = repository?.weight ?? 0
    contributionIndex += (contributions / totalCommits) * weight
  }
  return contributionIndex
}

export const calculateTechnologyStackIndex = (login: string, repositories: Repository[]) => {
  let technologyStackIndex = 0
  const technologyStack: { name: string; size: number }[] = []
  for (const repository of repositories) {
    const contributions =
      repository.repositoryContributors?.find((item) => item.login === login)?.contributions ?? 0
    const totalCommits =
      repository?.totalCommits && repository.totalCommits !== 0 ? repository.totalCommits : 1
    const weight = repository?.weight ?? 0
    const contributionIndex = (contributions / totalCommits) * weight

    repository.languages.edges.map((item) => {
      const name = item.node.name
      const size = item.size

      technologyStackIndex += size * contributionIndex
      technologyStack.push({ name: name, size: size * contributionIndex })
    })
  }
  const uniqueTechnologyStack = mergeAndDeduplicateByName(technologyStack)

  return { technologyStackIndex, technologyStack: uniqueTechnologyStack }
}

/**
 * 计算技术垂度
 * @param skills
 */
export function calculateTechnicalDepth(skills: { name: string; size: number }[]): number {
  // 计算 size 总和
  const totalSize = skills.reduce((sum, skill) => sum + skill.size, 0)

  // 防止 totalSize 为 0 导致的错误
  if (totalSize === 0) return 0

  // 将每个 size 标准化并平方求和，突出高权重语言
  return skills.reduce((sum, skill) => {
    const normalizedSize = skill.size / totalSize
    return sum + normalizedSize ** 2
  }, 0)
}

/**
 * 计算时间衰减，时间差趋近于10年，结果趋近于1，最大为1，最小为0
 * @param date
 */
export function calculateTimeDecay(date: Date): number {
  const now = new Date()
  const tenYearsInDays = 3650

  // 计算时间差（以天为单位）
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

  // 归一化处理，最大值为1
  return Math.min(diffInDays / tenYearsInDays, 1)
}

export const calculateUserWeightedStars = (login: string, repositories: Repository[]) => {
  let stars = 0
  for (const repository of repositories) {
    if (repository.stargazerCount === 0) continue

    const contributions =
      repository.repositoryContributors?.find((item) => item.login === login)?.contributions ?? 0
    const totalCommits =
      repository?.totalCommits && repository.totalCommits !== 0 ? repository.totalCommits : 1

    stars += repository.stargazerCount * (contributions / totalCommits)
  }
  return stars
}

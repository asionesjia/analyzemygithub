export type Metrics = {
  repositories: {
    [key: string]: RepositoryMetricsConnection
  }
  contribution: {
    contributionIndex: number
    totalContributions: number
    lastYearTotalContributions: number
    monthlyAverageContributions: number
    lastYearMonthlyAverageContributions: number
    monthlyActiveDaysAverage: number
    lastYearMonthlyActiveDaysAverage: number
    lastYearPeriodicContributionIndex: number
  }
  activityScore: number
  contributionScore: number
  technicalScore: number
  communityImpactScore: number
  communityActivityScore: number
  comprehensiveScore: number
}

export type RepositoryMetricsConnection = {
  issueCloseRate: number | null | undefined // issues关闭率 (closed issues / total issues)
  monthlyAverageCommits: number | null | undefined // 月均提交数
  contributorsCount: number | null | undefined // 贡献者数量
  starsCount: number | null | undefined // stars数量
  forksCount: number | null | undefined // forks数量
  issuesCount: number | null | undefined // issues数量
  pullRequestsCount: number | null | undefined // PR数量
  weight: number | null | undefined
}

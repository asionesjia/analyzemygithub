export type Metrics = {
  repositories: {
    [key: string]: RepositoryMetricsConnection
  }
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

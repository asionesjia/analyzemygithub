export const Factors = {
  repositoryMetrics: {
    weightFactor: {
      issueCloseRate: 0.1, // 关闭率占比
      monthlyAverageCommits: 0.1, // 月均提交数占比
      contributorsCount: 0.1, // 贡献者数量占比
      starsCount: 0.15, // stars数量占比
      forksCount: 0.15, // forks数量占比
      issuesCount: 0.2, // issues数量占比
      pullRequestsCount: 0.2, // PR数量占比
    },
    smoothingFactor: {
      issueCloseRate: 0.5, // 关闭率
      monthlyAverageCommits: 10, // 月均提交数占比
      contributorsCount: 5, // 贡献者数量占比
      starsCount: 100, // stars数量占比
      forksCount: 50, // forks数量占比
      issuesCount: 50, // issues数量占比
      pullRequestsCount: 75, // PR数量占比
    },
  },
}

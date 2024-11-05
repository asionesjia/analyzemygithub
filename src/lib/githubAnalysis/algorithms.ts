import {RepositoryMetricsConnection} from '~/types/metrics'
import {Factors} from '~/config/analysis-factors'

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

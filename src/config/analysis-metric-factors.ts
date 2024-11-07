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
  activityScore: {
    weightFactor: {
      totalIssues: 0.1,
      totalDiscussions: 0.1,
      monthlyAverageContributions: 0.1,
      lastYearMonthlyAverageContributions: 0.2,
      monthlyActiveDaysAverage: 0.1,
      lastYearMonthlyActiveDaysAverage: 0.2,
      lastYearPeriodicContributionIndex: 0.2,
    },
    smoothingFactor: {
      totalIssues: 50,
      totalDiscussions: 50,
      monthlyAverageContributions: 20,
      lastYearMonthlyAverageContributions: 40,
      monthlyActiveDaysAverage: 10,
      lastYearMonthlyActiveDaysAverage: 20,
      lastYearPeriodicContributionIndex: 0,
    },
  },
  contributionScore: {
    weightFactor: {
      totalContributions: 0.1,
      totalIssues: 0.1,
      totalDiscussions: 0.1,
      totalPullRequests: 0.3,
      contributionIndex: 0.4,
    },
    smoothingFactor: {
      totalContributions: 1000,
      totalIssues: 50,
      totalDiscussions: 50,
      totalPullRequests: 100,
      contributionIndex: 2,
    },
  },
  technicalScore: {
    weightFactor: {
      contributionIndex: 0.2,
      technologyStackIndex: 0.2,
      technicalBreadth: 0.2,
      technicalDepth: 0.2,
      seniority: 0.2,
    },
    smoothingFactor: {
      contributionIndex: 2,
      technologyStackIndex: 100000,
      technicalBreadth: 5,
      technicalDepth: undefined,
      seniority: undefined,
    },
  },
  communityImpactScore: {
    weightFactor: {
      stars: 0.5,
      followers: 0.5,
    },
    smoothingFactor: {
      stars: 500,
      followers: 100,
    },
  },
  communityActivityScore: {
    weightFactor: {
      issues: 0.25,
      discussions: 0.25,
      stared: 0.25,
      following: 0.25,
    },
    smoothingFactor: {
      issues: 100,
      discussions: 100,
      stared: 500,
      following: 100,
    },
  },
  comprehensiveScoreScore: {
    weightFactor: {
      activityScore: 2,
      contributionScore: 2,
      technicalScore: 2,
      communityImpactScore: 2,
      communityActivityScore: 2,
    },
  },
}

export const QUERY_VIEWER = `
query {
  viewer {
    login
  }
}
`

export const QUERY_BASE_PROFILE = `
query($username: String!) {
  viewer {
    login  # 当前登录的用户的 GitHub 用户名
  }
  user(login: $username) {
    login  # 指定用户的 GitHub 用户名
    name  # 指定用户的显示名称
    bio  # 指定用户的个人简介
    company  # 用户当前就职公司信息
    location  # 用户的位置信息
    email  # 用户的公开电子邮件地址
    twitterUsername  # 用户的 Twitter 用户名
    avatarUrl  # 用户的头像 URL
    createdAt  # 用户的账户创建时间
  }
}`

export const QUERY_CONTRIBUTIONS = (from: any, to: any) => `
  query($username: String!${from ? ', $from: DateTime!' : ''}${to ? ', $to: DateTime!' : ''}) {
  viewer {
    login  # 当前登录的用户的 GitHub 用户名
  }
  user(login: $username) {
        # 贡献统计信息
    contributionsCollection${from || to ? '(' : ''}${from ? 'from: $from' : ''}${from && to ? ', ' : ''}${to ? 'to: $to' : ''}${from || to ? ')' : ''} {
      totalCommitContributions  # 用户的总提交次数
      totalPullRequestContributions  # 用户的总 Pull Request 次数
      totalIssueContributions  # 用户的总 Issue 提交次数
      totalRepositoryContributions  # 用户的总仓库贡献次数
      commitContributionsByRepository(maxRepositories: 5) {
        repository {
          name  # 用户提交的最近 5 个仓库名称
        }
      }
      # 拓展贡献趋势数据
      contributionCalendar {
        totalContributions  # 用户的总贡献次数
        weeks {
          contributionDays {
            date  # 每日贡献日期
            contributionCount  # 每日贡献次数
            color  # 贡献的颜色代码（表示热度）
          }
        }
      }
    }
  }
}
`
export const QUERY_CONTRIBUTION_CALENDAR = `
  query($username: String!, $from: DateTime!) {
  viewer {
    login  # 当前登录的用户的 GitHub 用户名
  }
  user(login: $username) {
        # 贡献统计信息
    contributionsCollection(from: $from) {
      totalCommitContributions  # 用户的总提交次数
      totalPullRequestContributions  # 用户的总 Pull Request 次数
      totalIssueContributions  # 用户的总 Issue 提交次数
      totalRepositoryContributions  # 用户的总仓库贡献次数
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name  # 用户提交的最近 5 个仓库名称
        }
      }
      # 拓展贡献趋势数据
      contributionCalendar {
        totalContributions  # 用户的总贡献次数
        weeks {
          contributionDays {
            date  # 每日贡献日期
            contributionCount  # 每日贡献次数
            color  # 贡献的颜色代码（表示热度）
          }
        }
      }
    }
  }
}
`

const page = `
    # 贡献统计信息
    contributionsCollection {
      totalCommitContributions  # 用户的总提交次数
      totalPullRequestContributions  # 用户的总 Pull Request 次数
      totalIssueContributions  # 用户的总 Issue 提交次数
      totalRepositoryContributions  # 用户的总仓库贡献次数
      commitContributionsByRepository(maxRepositories: 5) {
        repository {
          name  # 用户提交的最近 5 个仓库名称
        }
      }
      # 拓展贡献趋势数据
      contributionCalendar {
        totalContributions  # 用户的总贡献次数
        weeks {
          contributionDays {
            date  # 每日贡献日期
            contributionCount  # 每日贡献次数
            color  # 贡献的颜色代码（表示热度）
          }
        }
      }
    }
    # 用户的公开仓库
    repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        name  # 仓库名称
        description  # 仓库描述
        isPrivate  # 仓库是否为私有
        stargazerCount  # 仓库的 star 数量
        forkCount  # 仓库的 fork 数量
        primaryLanguage {
          name  # 仓库的主要编程语言
        }
        createdAt  # 仓库创建日期
        updatedAt  # 仓库的最后更新时间
        pullRequests(states: [OPEN, CLOSED, MERGED]) {
          totalCount  # 仓库中的 Pull Request 总数
        }
        issues(states: [OPEN, CLOSED]) {
          totalCount  # 仓库中的 Issue 总数
        }
        # 添加仓库的项目板信息
        projectsV2(first: 2) {
          nodes {
            title  # 项目板标题
            closed  # 项目板是否已关闭
            items {
              totalCount  # 项目板中的项目项总数
            }
          }
        }
      }
      totalCount  # 用户的公开仓库总数
    }
    
    # 用户 Star 的仓库
    starredRepositories(first: 10) {
      nodes {
        name  # Star 的仓库名称
        description  # Star 的仓库描述
        owner {
          login  # Star 仓库的所有者
        }
        primaryLanguage {
          name  # Star 仓库的主要语言
        }
      }
      totalCount  # 用户 Star 的总仓库数
    }
    
    # 用户提交的 PR 信息
    pullRequests(first: 10, states: [OPEN, CLOSED, MERGED]) {
      nodes {
        title  # PR 标题
        state  # PR 状态（OPEN、CLOSED、MERGED）
        repository {
          name  # PR 所属的仓库名称
        }
      }
      totalCount  # 用户的总 PR 数
    }

    # 用户提交的 Issues 信息
    issues(first: 10) {
      nodes {
        title  # Issue 标题
        state  # Issue 状态（OPEN 或 CLOSED）
        repository {
          name  # Issue 所属的仓库名称
        }
      }
      totalCount  # 用户的总 Issue 数
    }
    
    # 粉丝信息
    followers(first: 10) {
      nodes {
        login  # 粉丝的 GitHub 用户名
        name  # 粉丝的显示名称
        avatarUrl  # 粉丝的头像 URL
      }
      totalCount  # 用户的总粉丝数
    }

    # 关注的用户信息
    following(first: 10) {
      nodes {
        login  # 用户关注的用户的 GitHub 用户名
        name  # 用户关注的用户的显示名称
        avatarUrl  # 用户关注的用户的头像 URL
      }
      totalCount  # 用户关注的用户总数
    }
    
    # 用户的组织信息
    organizations(first: 5) {
      nodes {
        name  # 用户所属组织的名称
        description  # 用户所属组织的描述
        membersWithRole {
          totalCount  # 组织成员总数
        }
        # 扩展组织团队信息
        teams(first: 5) {
          nodes {
            name  # 组织团队名称
            description  # 组织团队描述
            members {
              totalCount  # 团队成员总数
            }
          }
        }
      }
    }

    # 项目信息
    projectsV2(first: 5) {
      nodes {
        title  # 用户的项目标题
        closed  # 项目是否已关闭
        items {
          totalCount  # 项目中的项总数
        }
      }
    }
  }`

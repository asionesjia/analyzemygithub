import { Metrics, RepositoryMetricsConnection } from '~/types/metrics'

export type GithubDetails = {
  user: GitHubUser
} & Viewer

export type Viewer = {
  viewer: {
    id: string
    login: string
  }
}

export type BaseProfile = {
  user: GitHubUser
} & Viewer

export type Contributions = {
  user: {
    contributionsCollection: ContributionsCollection
  }
} & Viewer

export type Repositories = {
  user: {
    repositories: RepositoryConnection
  }
}

export type StarredRepositories = {
  user: {
    starredRepositories: StarredRepositoryConnection
  }
}

export type PullRequests = {
  user: {
    pullRequests: PullRequestConnection
  }
}

export type Issues = {
  user: {
    issues: IssueConnection
  }
}

export type Followers = {
  user: {
    followers: FollowerConnection
  }
}

export type Following = {
  user: {
    following: FollowingConnection
  }
}

export type Organizations = {
  user: {
    organizations: OrganizationConnection
  }
}

export type ProjectsV2 = {
  user: {
    projectsV2: ProjectV2Connection
  }
}
export type RepositoryDiscussionComments = {
  user: {
    repositoryDiscussionComments: repositoryDiscussionCommentConnection
  }
}

export interface UserCommitsInRepoQuery {
  user: {
    login: string
    contributionsCollection: {
      commitContributionsByRepository: {
        repository: {
          owner: { login: string }
          name: string
          url: string
          nameWithOwner: string
          isPrivate: boolean
        }
        contributions: {
          nodes: {
            commit: {
              oid: string
              message: string
              abbreviatedOid: string
              committedDate: string
              authoredDate: string
              additions: number
              deletions: number
              changedFiles: number
              associatedPullRequests: {
                nodes: {
                  title: string
                  state: 'OPEN' | 'CLOSED' | 'MERGED'
                  author: {
                    login: string
                    avatarUrl: string
                  }
                }[]
              }
            }
          }[]
          totalCount: number
        }
      }[]
    }
  }
}

export interface GistsQuery {
  user: {
    gists: GistConnection
  }
}

// 用户的详细信息结构
export type GitHubUser = {
  id: string
  login: string
  name?: string | null
  bio?: string | null
  company?: string | null
  location?: string | null
  email?: string | null
  twitterUsername?: string | null
  avatarUrl: string
  hasSponsorsListing: boolean
  isBountyHunter: boolean
  isCampusExpert: boolean
  isDeveloperProgramMember: boolean
  isEmployee: boolean
  isGitHubStar: boolean
  isHireable: boolean
  websiteUrl?: string | null
  createdAt: string

  // 贡献统计信息
  contributionsCollection: ContributionsCollection

  // 用户的公开仓库信息
  repositories?: Repository[]

  topRepositories?: RepositoryConnection

  // 用户 star 的仓库信息
  starredRepositories: StarredRepositoryConnection

  // 用户提交的 PR 信息
  pullRequests: PullRequestConnection

  // 用户提交的 Issues 信息
  issues: IssueConnection

  // 用户的粉丝信息
  followers: FollowerConnection

  // 用户关注的用户信息
  following: FollowingConnection

  // 用户的组织信息
  organizations: OrganizationConnection

  // 用户的项目信息
  projectsV2: ProjectV2Connection

  gists: GistConnection

  repositoryDiscussionComments: repositoryDiscussionCommentConnection

  repositoryContributors: RepositoryContributorConnection[]

  metrics?: Metrics

  infer?: any

  languages?: { name: string; size: number }[]
}

// 贡献统计结构
export type ContributionsCollection = {
  totalCommitContributions: number // 总提交数
  totalPullRequestContributions: number // 总 PR 数
  totalIssueContributions: number // 总 Issue 数
  totalRepositoryContributions: number // 总仓库贡献数
  commitContributionsByRepository: {
    repository: Repository
  }[]
  contributionCalendar: ContributionCalendar // 用户贡献日历
}

// 贡献日历信息
export type ContributionCalendar = {
  totalContributions: number // 总贡献数
  weeks: ContributionWeek[]
}

export type ContributionWeek = {
  contributionDays: ContributionDay[]
}

export type ContributionDay = {
  date: string // 每日贡献日期
  contributionCount: number // 每日贡献数
  contributionLevel:
    | 'FIRST_QUARTILE'
    | 'FOURTH_QUARTILE'
    | 'NONE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE' // 贡献度等级
  color: string // 每日贡献颜色（热度）
}

// 用户的公开仓库信息
export type RepositoryConnection = {
  nodes: Repository[] // 仓库列表
  totalCount: number // 仓库总数
}

// 仓库信息结构
export type Repository = {
  owner: {
    login: string
  }
  name: string // 仓库名称
  nameWithOwner: string
  description: string | null // 仓库描述
  isPrivate: boolean // 是否为私有仓库
  isFork: boolean // 是否为Fork仓库
  stargazerCount: number // star 数
  forkCount: number // fork 数
  primaryLanguage: { name: string } | null // 主要语言
  languages: {
    edges: {
      node: {
        name: string
      }
      size: number
    }[]
  }
  createdAt: string // 仓库创建日期
  updatedAt: string // 仓库最后更新时间
  pullRequests: { totalCount: number } // 仓库中的 PR 总数
  openPullRequests: { totalCount: number } // 仓库中的 PR 总数
  closedPullRequests: { totalCount: number } // 仓库中的 PR 总数
  mergedPullRequests: { totalCount: number } // 仓库中的 PR 总数
  issues: { totalCount: number } // 仓库中的 Issue 总数
  openIssues: { totalCount: number } // 仓库中的 Issue 总数
  closedIssues: { totalCount: number } // 仓库中的 Issue 总数
  totalCommits?: number
  repositoryContributors?: RepositoryContributorConnection[]
  commitCountsByMonth?: {
    totalCount: number | null | undefined
    since: Date | null | undefined
    until: Date | null | undefined
  }[]
  metrics?: RepositoryMetricsConnection
  weight?: number
}

// Starred 仓库信息
export type StarredRepositoryConnection = {
  nodes: {
    name: string // Star 的仓库名称
    description: string | null // 仓库描述
    owner: { login: string } // 仓库所有者
    primaryLanguage: { name: string } | null // 主要语言
  }[]
  totalCount: number // 总 Star 数
}

// PR 信息结构
export type PullRequestConnection = {
  nodes: {
    title: string // PR 标题
    state: 'OPEN' | 'CLOSED' | 'MERGED' // PR 状态
    author: { login: string }
    repository: {
      owner: { login: string }
      name: string
      url: string
      nameWithOwner: string
      isPrivate: boolean
    } // PR 所属仓库
    createdAt: string
  }[]
  totalCount: number // 总 PR 数
}

// Issue 信息结构
export type IssueConnection = {
  nodes: {
    title: string // Issue 标题
    state: 'OPEN' | 'CLOSED' // Issue 状态
    author: { login: string }
    repository: {
      owner: { login: string }
      name: string
      url: string
      nameWithOwner: string
      isPrivate: boolean
    } // Issue 所属仓库
    createdAt: string
  }[]
  totalCount: number // 总 Issue 数
}

// 粉丝信息结构
export type FollowerConnection = {
  totalCount: number // 总粉丝数
}

// 用户关注的用户信息结构
export type FollowingConnection = {
  nodes: {
    login: string // 用户关注的用户的用户名
    name: string | null // 用户关注的用户的显示名称
    avatarUrl: string // 用户关注的用户的头像 URL
  }[]
  totalCount: number // 总关注数
}

// 组织信息结构
export type OrganizationConnection = {
  nodes: {
    name: string // 组织名称
    description: string | null // 组织描述
    membersWithRole: { totalCount: number } // 组织成员总数
    teams: {
      nodes: {
        name: string // 团队名称
        description: string | null // 团队描述
        members: { totalCount: number } // 团队成员总数
      }[]
    }
  }[]
  totalCount: number
}

// 项目信息结构
export type ProjectV2Connection = {
  nodes: {
    title: string // 项目标题
    closed: boolean // 项目是否已关闭
    items: { totalCount: number } // 项目项总数
  }[]
  totalCount: number
}

export type GistConnection = {
  nodes: {
    name: string
    description?: string | null
    createdAt: string
    updatedAt: string
    files: {
      name: string
      language: {
        name: string
      } | null
    }[]
  }[]
  totalCount: number
}

export type repositoryDiscussionCommentConnection = {
  nodes: {
    body: string
    createdAt: string
    author: { login: string }
    discussion: {
      title: string
      url: string
      repository: {
        owner: { login: string }
        name: string
        url: string
        nameWithOwner: string
        isPrivate: boolean
      }
    }
  }[]
  totalCount: number
}

export type RepositoryContributorConnection = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  contributions: number
  email: string
  name: string
  user_view_type: string
}

export type TopRepositories = {
  user: {
    topRepositories: RepositoryConnection
  }
}

export type GithubError = {
  type: string
  message: string
}

export type GithubErrors = {
  errors: GithubError[]
}

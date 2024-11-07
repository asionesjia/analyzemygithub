export const QUERY_VIEWER = `
query {
  viewer {
    id
    login
  }
}
`

export const QUERY_BASE_PROFILE = `
query($username: String!) {
  viewer {
    id     # 当前登陆用户的ID
    login  # 当前登录的用户的 GitHub 用户名
  }
  user(login: $username) {
    id                       # 指定用户的ID
    login                    # 指定用户的 GitHub 用户名
    name                     # 指定用户的显示名称
    bio                      # 指定用户的个人简介
    company                  # 用户当前就职公司信息
    location                 # 用户的位置信息
    email                    # 用户的公开电子邮件地址
    twitterUsername          # 用户的 Twitter 用户名
    avatarUrl                # 用户的头像 URL
    hasSponsorsListing       # 是否拥有赞助列表，表明用户是否在 GitHub 上寻求资助。
    isBountyHunter           # 是否参与漏洞奖励计划，评估用户的安全技能和开源参与度。
    isCampusExpert           # 是否为校园专家，表明用户在 GitHub 的校园影响力。
    isDeveloperProgramMember # 是否为 GitHub 开发者计划成员，展示用户的 GitHub 专业关联。
    isEmployee               # 是否为 GitHub 员工，标记其官方身份。
    isGitHubStar             # 是否为 GitHub Star，表明用户在社区中的影响力。
    isHireable               # 是否可被雇佣，评估用户的职业兴趣状态。
    websiteUrl               # 用户的个人网站，提供更深入了解开发者背景的途径。
   
    createdAt  # 用户的账户创建时间
  }
}`

export const QUERY_CONTRIBUTIONS = (from: any, to: any) => `
  query($username: String!${from ? ', $from: DateTime!' : ''}${to ? ', $to: DateTime!' : ''}) {
  viewer {
    id
    login  # 当前登录的用户的 GitHub 用户名
  }
  user(login: $username) {
        # 贡献统计信息
    contributionsCollection${from || to ? '(' : ''}${from ? 'from: $from' : ''}${from && to ? ', ' : ''}${to ? 'to: $to' : ''}${from || to ? ')' : ''} {
      totalCommitContributions  # 用户的总提交次数
      totalPullRequestContributions  # 用户的总 Pull Request 次数
      totalIssueContributions  # 用户的总 Issue 提交次数
      totalRepositoryContributions  # 用户的总仓库贡献次数
      commitContributionsByRepository(maxRepositories: 10) {
        repository {
          owner {
            login
          }
          name  # 仓库名称
          nameWithOwner
          description  # 仓库描述
          isPrivate  # 仓库是否为私有
          isFork  # 是否为Fork仓库
          stargazerCount  # 仓库的 star 数量
          forkCount  # 仓库的 fork 数量
          primaryLanguage {
            name  # 仓库的主要编程语言
          }
          languages(first: 100) {
            edges {
              node {
                name
              }
              size
            }
          }
          createdAt  # 仓库创建日期
          updatedAt  # 仓库的最后更新时间
          pullRequests(states: [OPEN, CLOSED, MERGED]) {
            totalCount
          }
          openPullRequests: pullRequests(states: OPEN) {
            totalCount
          }
          closedPullRequests: pullRequests(states: CLOSED) {
            totalCount
          }
          mergedPullRequests: pullRequests(states: MERGED) {
            totalCount
          }
          issues(states: [OPEN, CLOSED]){
            totalCount
          }
          openIssues: issues(states: OPEN) {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
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

export const QUERY_REPOSITORIES = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户的公开仓库
    repositories(first: 10, after:$cursor, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        owner {
          login
        }
        name  # 仓库名称
        nameWithOwner
        description  # 仓库描述
        isPrivate  # 仓库是否为私有
        isFork  # 是否为Fork仓库
        stargazerCount  # 仓库的 star 数量
        forkCount  # 仓库的 fork 数量
        primaryLanguage {
          name  # 仓库的主要编程语言
        }
        languages(first: 100) {
          edges {
            node {
              name
            }
            size
          }
        }
        createdAt  # 仓库创建日期
        updatedAt  # 仓库的最后更新时间
        pullRequests(states: [OPEN, CLOSED, MERGED]) {
          totalCount
        }
        openPullRequests: pullRequests(states: OPEN) {
          totalCount
        }
        closedPullRequests: pullRequests(states: CLOSED) {
          totalCount
        }
        mergedPullRequests: pullRequests(states: MERGED) {
          totalCount
        }
        issues(states: [OPEN, CLOSED]){
          totalCount
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
      }
      totalCount  # 用户的公开仓库总数
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`

export const QUERY_COMMIT_COMMENTS = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户的 Commit 评论信息
    commitComments(first: 10, after: $cursor) {
      nodes {
        # 评论作者信息
        author {
          login           # GitHub 用户名，用于识别作者身份。
          avatarUrl       # 作者的头像 URL，便于展示用户形象。
        }
        
        # 评论的关联属性
        authorAssociation  # 作者与提交的关联关系，如 OWNER、CONTRIBUTOR，帮助判断作者身份及角色。
        body               # 评论的正文，记录作者对提交的具体意见或反馈内容。
        bodyHTML           # 评论内容的 HTML 格式，用于显示带格式的评论。
        bodyText           # 评论的纯文本版本，便于搜索和关键字提取。

        # 关联的提交信息
        commit {
          abbreviatedOid    # 提交的缩写 ID，用于简洁展示提交记录。
          message           # 提交消息，提供提交内容的概述，判断代码变更的意图。
          additions         # 提交的增加行数，衡量提交的规模。
          deletions         # 提交的删除行数，衡量代码删除及重构的规模。
          changedFilesIfAvailable      # 提交涉及的文件数，显示变更的广度。
          committedDate     # 提交日期，帮助确定代码变更的时间点。
          authoredDate        # 提交推送到远程仓库的时间，分析代码实际上线时间与提交时间的差异。

          # 关联的 Pull Requests 详情
          associatedPullRequests(first: 10) {
            nodes {
              title              # PR 标题，提供变更的简要描述。
              state              # PR 的当前状态（如 OPEN、MERGED、CLOSED），判断是否成功合并。
              additions          # PR 的增加行数，用于评估 PR 的规模。
              deletions          # PR 的删除行数，了解代码清理和重构量。
              changedFiles       # 涉及的文件数，分析代码变更的广度。
              createdAt          # PR 创建时间，评估变更的发起时间。
              updatedAt          # PR 更新日期，观察进度和团队反馈时间。
              mergedAt           # 合并日期，标记 PR 成功合并的时间点。
              closedAt           # PR 关闭时间，记录 PR 被关闭的时间，用于分析处理周期。

              # PR 提交者信息
              author {
                login            # PR 提交者的 GitHub 用户名，识别贡献者身份。
                avatarUrl        # 提交者的头像 URL，便于在界面上展示其形象。
              }

              # PR 审核者信息
              reviews(first: 5) {
                nodes {
                  author {
                    login        # 审核者的 GitHub 用户名，便于识别与追踪审核者。
                    avatarUrl    # 审核者头像 URL，增强界面展示的友好性。
                  }
                  state          # 审核状态，如 APPROVED 或 CHANGES_REQUESTED，显示 PR 审核过程。
                  submittedAt    # 审核时间，分析审核响应速度及审核周期。
                }
                totalCount       # 审核次数，评估 PR 的审核强度。
              }

              # PR 指派人员
              assignees(first: 5) {
                nodes {
                  login            # 被指派人的 GitHub 用户名，识别责任分配情况。
                  name             # 指派人的显示名称，有助于用户识别。
                  avatarUrl        # 指派人头像 URL，便于展示。
                  bio              # 指派人的个人简介，了解其背景和技能。
                  location         # 位置信息，用于地理分析。
                  company          # 当前就职公司，分析开发者所属公司影响力。
                  email            # 公开电子邮件，有助于直接联系（若公开）。
                  twitterUsername  # Twitter 用户名，用于社交网络分析。
                  followers {
                    totalCount     # 追随者数量，衡量开发者的社交影响力。
                  }
                  createdAt        # 账户创建日期，用于分析经验年限。
                }
              }

              # PR 的标签信息
              labels(first: 5) {
                nodes {
                  name            # 标签名称，标识 PR 的关键主题或特性。
                }
              }
            }
          }
        }
      }
      totalCount              # 总评论数，衡量用户提交的评论数量。
      pageInfo {
        hasNextPage           # 标记是否有更多评论，用于分页控制。
        endCursor             # 分页游标，用于抓取下一页数据。
      }
    }
  }
}`

export const QUERY_STARRED_REPOSITORIES = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户 Star 的仓库
    starredRepositories(first: 10, after:$cursor) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_PULL_REQUESTS = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户提交的 PR 信息
    pullRequests(first: 10, after:$cursor, states: [OPEN, CLOSED, MERGED]) {
      nodes {
        title  # PR 标题
        state  # PR 状态（OPEN、CLOSED、MERGED）
        repository {
          owner {
           login
          }
          name
          nameWithOwner
          url
          isPrivate
        }
        author {
          login
        }
        createdAt
      }
      totalCount  # 用户的总 PR 数
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_ISSUES = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户提交的 Issues 信息
    issues(first: 10, after:$cursor) {
      nodes {
        title  # Issue 标题
        state  # Issue 状态（OPEN 或 CLOSED）
        repository {
          owner {
           login
          }
          name
          nameWithOwner
          url
          isPrivate
        }
        author {
          login
        }
        createdAt
      }
      totalCount  # 用户的总 Issue 数
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_FOLLOWERS = `
query paginate($username: String!) {
  user(login: $username) {
      # 粉丝信息
    followers(first: 10) {
      totalCount
    }
  }
}`
export const QUERY_FOLLOWING = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 关注的用户信息
    following(first: 10, after:$cursor) {
      nodes {
        login  # 用户关注的用户的 GitHub 用户名
        name  # 用户关注的用户的显示名称
        avatarUrl  # 用户关注的用户的头像 URL
      }
      totalCount  # 用户关注的用户总数
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`
export const QUERY_ORGANIZATIONS = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户的组织信息
    organizations(first: 10, after:$cursor) {
      nodes {
        name  # 用户所属组织的名称
        description  # 用户所属组织的描述
        membersWithRole {
          totalCount  # 组织成员总数
        }
        # 扩展组织团队信息
        teams(first: 100) {
          nodes {
            name  # 组织团队名称
            description  # 组织团队描述
            members {
              totalCount  # 团队成员总数
            }
          }
        }
      }
      totalCount  # 加入组织总数
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`
export const QUERY_PROJECTS_V2 = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 项目信息
    projectsV2(first: 10, after:$cursor) {
      nodes {
        title  # 用户的项目标题
        closed  # 项目是否已关闭
        items {
          totalCount  # 项目中的项总数
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_GISTS = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户公开的 Gists
    gists(first: 10, after: $cursor) {
      nodes {
        name           # Gist 的名称，用于识别和显示。
        description    # Gist 描述，说明其内容。
        createdAt      # 创建时间，帮助评估用户的分享活跃度。
        updatedAt      # 上次更新时间，显示用户最近的更新频率。
        files {
          name        # 文件名，用于了解 Gist 的内容种类。
          language {  # 文件语言，用于识别开发者技能。
            name
          }
        }
      }
      totalCount       # 用户 Gists 总数，展示分享内容的数量。
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_ISSUE_COMMENTS = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户发表的 Issue 评论
    issueComments(first: 10, after: $cursor) {
      nodes {
        body           # 评论正文，提供用户的观点和技术见解。
        createdAt      # 创建时间，用于评估活跃时间。
        updatedAt      # 上次更新时间，显示用户反馈更新频率。
        author {
          login        # 评论作者，用于识别评论的作者。
        }
        issue {
          title        # 关联 Issue 的标题，表明评论主题。
          url          # 关联 Issue 的 URL，提供跳转到原帖。
        }
      }
      totalCount       # 总评论数，衡量用户活跃度。
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_PACKAGES = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户关联的 GitHub Packages
    packages(first: 10, after: $cursor) {
      nodes {
        name           # Package 名称，展示用户管理的 Package。
        description    # Package 描述，说明内容用途。
        latestVersion {
          version      # 最新版本，标记 Package 的更新情况。
          publishedAt  # 版本发布日期，显示最近的更新活动。
        }
      }
      totalCount       # 用户管理的 Packages 数量，展示用户的内容贡献。
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_REPOSITORY_DISCUSSION_COMMENTS = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户的讨论评论
    repositoryDiscussionComments(first: 10, after: $cursor) {
      nodes {
        body           # 评论正文，用于分析技术见解。
        createdAt      # 创建时间，标记用户活跃期。
        author {
          login
        }
        discussion {
          title        # 关联讨论的标题，展示评论主题。
          url          # 讨论的链接，便于跳转到原帖。        
          repository {
            owner {
              login
            }
            name
            nameWithOwner
            url
            isPrivate
          }
        }
      }
      totalCount       # 讨论评论总数，用于衡量用户在社区中的互动。
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_REPOSITORY_DISCUSSION = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户发起的讨论
    repositoryDiscussions(first: 10, after: $cursor) {
      nodes {
        title          # 讨论标题，标识讨论主题。
        body           # 讨论内容，用于分析用户的发起内容。
        createdAt      # 创建时间，标记用户的活跃起点。
        url            # 讨论 URL，用于跳转。
      }
      totalCount       # 用户的讨论总数，衡量用户在 GitHub 讨论社区的影响力。
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_TOP_REPOSITORIES = `
query paginate($username: String!, $cursor: String) {
  user(login: $username) {
    # 用户的顶级仓库（依据星标数排序）
    topRepositories(first: 10, after: $cursor, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes {
        owner {
          login
        }
        name  # 仓库名称
        nameWithOwner
        description  # 仓库描述
        isPrivate  # 仓库是否为私有
        isFork  # 是否为Fork仓库
        stargazerCount  # 仓库的 star 数量
        forkCount  # 仓库的 fork 数量
        primaryLanguage {
          name  # 仓库的主要编程语言
        }
        languages(first: 100) {
          edges {
            node {
              name
            }
            size
          }
        }
        createdAt  # 仓库创建日期
        updatedAt  # 仓库的最后更新时间
        pullRequests(states: [OPEN, CLOSED, MERGED]) {
          totalCount
        }
        openPullRequests: pullRequests(states: OPEN) {
          totalCount
        }
        closedPullRequests: pullRequests(states: CLOSED) {
          totalCount
        }
        mergedPullRequests: pullRequests(states: MERGED) {
          totalCount
        }
        issues(states: [OPEN, CLOSED]){
          totalCount
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
      }
      totalCount       # 用户的讨论总数，衡量用户在 GitHub 讨论社区的影响力。
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

export const QUERY_USER_COMMITS_IN_REPO = `
query paginate($username: String!, $$repositoryName: String!, $cursor: String) {
  repository(owner: $username, name: $repositoryName) {
    name              # 仓库名称
    url               # 仓库 URL
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 10, after: $cursor, author: { id: $username }) {
            edges {
              node {
                oid                   # 提交的唯一 ID
                message               # 提交信息
                committedDate         # 提交日期
                author {
                  name                # 作者名称
                  email               # 作者邮箱
                  user {
                    login             # 作者的 GitHub 用户名
                  }
                }
                additions             # 代码增加行数
                deletions             # 代码删除行数
                changedFiles          # 修改的文件数
                url                   # 提交记录的 URL
              }
            }
            pageInfo {
              hasNextPage             # 是否有下一页
              endCursor               # 用于分页的游标
            }
          }
        }
      }
    }
  }
}`

export const QUERY_REPOSITORY_COMMIT_COUNT_BY_DATE_RANGE = `
query CommitCountInRange($owner: String!, $name: String!, $since: GitTimestamp!, $until: GitTimestamp!) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(since: $since, until: $until) {
            totalCount
          }
        }
      }
    }
  }
}`

export const QUERY_USER_COMMIT_COUNT_IN_REPOSITORY_BY_ID = `
query($id: ID, $owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    # 获取指定用户的 commits 数量
    object(expression: "HEAD") {
      ... on Commit {
        history(author: {id: $id}) {
          totalCount
        }
      }
    }
  }
}`

export const QUERY_REPOSITORY_COMMIT_COUNT = `
query CommitCountInRange($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history {
            totalCount
          }
        }
      }
    }
  }
}`

export const QUERY_REPOSITORY_README = `
query getRepositoryReadme($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    object(expression: "HEAD:README.md") {
      ... on Blob {
        text
      }
    }
  }
}`

import { MainNavItem, SidebarNavItem } from '~/types'

interface AppConfig {
  mainNav: MainNavItem[]
  sidebarNav: (slug: string) => SidebarNavItem[]
}

export const appConfig: AppConfig = {
  mainNav: [
    {
      title: 'Trend',
      href: '/trend',
    },
    {
      title: 'Recommend',
      href: '/recommend',
    },
  ],
  sidebarNav: (slug) => [
    {
      title: 'Analytics',
      href: `/report/${slug}`,
      items: [
        {
          title: 'Overview',
          href: `/report/${slug}`,
        },
        {
          title: 'Languages',
          href: `/report/${slug}/languages`,
        },
        {
          title: 'Skills',
          href: `/report/${slug}/skills`,
        },
        {
          title: 'Contributions',
          href: `/report/${slug}/contributions`,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'TalendRank',
          href: '/4',
          items: [],
        },
        {
          title: 'TalendRank1',
          href: '/5',
          items: [],
        },
        {
          title: 'TalendRank2',
          href: '/6',
          items: [],
        },
        {
          title: 'TalendRank3',
          href: '/7',
          items: [],
        },
      ],
    },
  ],
}

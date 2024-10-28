import { MainNavItem, SidebarNavItem } from '~/types'

interface AppConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const appConfig: AppConfig = {
  mainNav: [
    {
      title: 'Trend',
      href: '/1',
    },
    {
      title: 'Recommend',
      href: '/2',
    },
  ],
  sidebarNav: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Report',
          href: '/3',
        },
      ],
    },
    {
      title: 'Analytics',
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

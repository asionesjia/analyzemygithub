'use server'

import { DocsSidebarNav } from '~/components/sidebar-nav'
import { appConfig } from '~/config/app'
import { AnalysisDataProvider } from '~/components/providers/analysisDataProvider'
import { findAnalysisByLogin } from '~/server/mongodb/api'
import { GitHubUser } from '~/server/api/routers/github/types'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params
  const githubData = await findAnalysisByLogin(slug)
  if (!slug || !githubData) return null
  return (
    <AnalysisDataProvider initialData={githubData as GitHubUser}>
      <div className="items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 hidden w-full shrink-0 px-4 py-4 md:sticky md:block md:px-8 md:py-8">
          <DocsSidebarNav items={appConfig.sidebarNav(slug)} />
        </aside>
        {children}
      </div>
    </AnalysisDataProvider>
  )
}

export default Layout

'use server'

import { DocsSidebarNav } from '~/components/sidebar-nav'
import { appConfig } from '~/config/app'

// export async function generateStaticParams() {
//   const analyses = await findAllAnalyses()
//
//   return analyses.map((analysis) => ({
//     slug: analysis.login,
//   }))
// }

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params
  console.log(slug)
  return (
    <div className="items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden w-full shrink-0 px-4 py-4 md:sticky md:block md:px-8 md:py-8">
        <DocsSidebarNav items={appConfig.sidebarNav(slug)} />
      </aside>
      {children}
    </div>
  )
}

export default Layout

import { DocsSidebarNav } from '~/components/sidebar-nav'
import { appConfig } from '~/config/app'

type AnalyzingProps = {
  mode: 'public' | 'private'
  accessToken: string
}

const Analyzing = ({ mode, accessToken }: AnalyzingProps) => {
  return (
    <div className="items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden w-full shrink-0 px-4 py-4 md:sticky md:block md:px-8 md:py-8">
        <DocsSidebarNav items={appConfig.sidebarNav} />
      </aside>
    </div>
  )
}

export default Analyzing

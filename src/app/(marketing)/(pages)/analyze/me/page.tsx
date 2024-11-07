import { auth } from '~/server/auth'
import { FocusCardProps } from '~/components/ui/focus-card'
import NewAnalysis from '~/app/(marketing)/(pages)/analyze/me/_components/new-analysis'
import { findAnalysisByLogin } from '~/server/mongodb/api'
import { apiServer } from '~/trpc/server'
import NewAnyoneAnalysis from '~/app/(marketing)/(pages)/analyze/[anyone]/_components/new_anyone_analysis'

const focusCardData: FocusCardProps[] = [
  {
    title: 'Analyze Public Repositories Only',
    description: 'Instantly analyze only your public repositories for a quick start.',
    hoverLabel: 'Start Public Analysis',
    position: 'left',
  },
  {
    title: 'Comprehensive GitHub Analysis',
    description:
      'Authorize access for in-depth analysis of all repositories, including private and organizational (read-only). We ensure no access tokens or repository data are stored, retaining only the final evaluation scores.',
    hoverLabel: 'Get Full Analysis',
    position: 'right',
  },
]

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: PageProps) => {
  const searchParamsData = await searchParams
  const session = await auth()
  const mode = searchParamsData?.mode
  if (mode === 'anyone') {
    return <NewAnyoneAnalysis />
  }
  const isAnalyzed = async (): Promise<boolean> => {
    const { data: viewerResult, error: viewerError } = await apiServer.github.getViewer()
    if (viewerResult) {
      const doc = await findAnalysisByLogin(viewerResult.viewer.login)
      return !!doc
    }
    return true
  }

  if (!(await isAnalyzed())) {
    return <NewAnalysis session={session} searchParams={searchParamsData} />
  }

  return <section></section>
}

export default Page

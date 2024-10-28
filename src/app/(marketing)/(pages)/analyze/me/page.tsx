import { auth } from '~/server/auth'
import { FocusCardProps } from '~/components/ui/focus-card'
import NewAnalysis from '~/app/(marketing)/(pages)/analyze/me/_components/new-analysis'

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
  // :TODO 从浏览器读取分析记录，暂用伪方法。
  const isAnalyzed = (): boolean => {
    return false
  }

  if (!isAnalyzed()) {
    return <NewAnalysis session={session} searchParams={searchParamsData} />
  }

  return <section></section>
}

export default Page

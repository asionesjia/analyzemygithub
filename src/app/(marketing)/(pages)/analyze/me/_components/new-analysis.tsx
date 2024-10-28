import { Session } from 'next-auth'
import SelectAnalysisScope from '~/app/(marketing)/(pages)/analyze/me/_components/select-analysis-scope'

type NewAnalysisProps = {
  session: Session | null
  searchParams: { [key: string]: string | string[] | undefined }
}

const NewAnalysis = async ({ session, searchParams }: NewAnalysisProps) => {
  if (
    !searchParams?.mode ||
    (searchParams?.mode !== 'public' && searchParams?.mode !== 'private')
  ) {
    return <SelectAnalysisScope />
  }
}

export default NewAnalysis

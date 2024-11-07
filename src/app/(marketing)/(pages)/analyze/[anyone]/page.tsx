import Page_client from '~/app/(marketing)/(pages)/analyze/[anyone]/page_client'

type PageProps = {
  params: Promise<{ anyone: string }>
}

const Page = async ({ params }: PageProps) => {
  const { anyone } = await params
  return <Page_client username={anyone} />
}

export default Page

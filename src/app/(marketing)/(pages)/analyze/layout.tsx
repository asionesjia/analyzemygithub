import { auth } from '~/server/auth'
import SignIn from '~/app/(marketing)/(pages)/login/sign-in'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth()
  console.log('session', session)
  if (!session) {
    return <SignIn />
  }
  return <>{children}</>
}

export default Layout

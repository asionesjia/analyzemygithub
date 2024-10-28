'use client'
import SignInWithGithub from '~/app/_components/sign-in-with-github'
import { useSearchParams } from 'next/navigation'
import { BlurInEffect } from '~/components/ui/blur-in-effect'

type SignInProps = {}

const SignIn = ({}: SignInProps) => {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  return (
    <>
      <div className="space-y-4 px-4 pt-4 md:space-y-8 md:px-10 md:pt-10">
        <BlurInEffect index={0}>
          <div className="text-3xl font-semibold sm:text-5xl">Authorize your Git provider</div>
        </BlurInEffect>
        <SignInWithGithub redirect={redirect || ''} />
        <BlurInEffect index={2}>
          <div>
            Before using the analysis service, you need to authenticate your GitHub OAuth identity
            to obtain an access token so that the server can call the GitHub API to obtain data
            during analysis.
          </div>
        </BlurInEffect>
      </div>
    </>
  )
}

export default SignIn

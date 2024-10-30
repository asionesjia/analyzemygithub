'use client'
import { useActionState } from 'react'
import { signInWithGithubAction } from '~/actions/login'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import { Icons } from '~/components/icons'
import FullWidthButton from '~/app/_components/ui/full-width-button'

type SignInWithGithubProps = {
  redirect: string
}

const SignInWithGithub = ({ redirect }: SignInWithGithubProps) => {
  const [state, formAction, isPending] = useActionState(signInWithGithubAction, undefined)
  return (
    <>
      <BlurInEffect>{state?.error ? <div>state.error</div> : ''}</BlurInEffect>
      <BlurInEffect index={1}>
        <form action={formAction}>
          <input type="hidden" name="redirect" value={redirect || ''} />
          <FullWidthButton
            type="submit"
            label="Sign In with GitHub"
            iconLeft={Icons.gitHub}
            iconRight={Icons.arrowUpRight}
            isLoading={isPending}
          />
        </form>
      </BlurInEffect>
    </>
  )
}

export default SignInWithGithub

'use client'
import { Loader2 } from 'lucide-react'
import { useActionState } from 'react'
import { signInWithGithubAction } from '~/actions/login'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import { Icons } from '~/components/icons'

type SignInWithGithubProps = {
  redirect: string
}

const SignInWithGithub = ({ redirect }: SignInWithGithubProps) => {
  const [state, formAction, isPending] = useActionState(signInWithGithubAction, undefined)
  return (
    <>
      {isPending ? (
        <BlurInEffect>
          <button type="submit" className="group w-full" disabled>
            <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-600/60 via-neutral-600/30 to-neutral-600/0 dark:from-neutral-200/60 dark:via-neutral-200/30 dark:to-neutral-200/0" />
            <div className="flex w-full items-center justify-between py-4 md:py-8">
              <div className="flex items-center justify-between space-x-4">
                <Loader2 className="size-12 animate-spin" />
                <div className="border-b border-dashed border-foreground text-xl md:text-3xl">
                  Loading...
                </div>
              </div>
            </div>
            <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-600/60 via-neutral-600/30 to-neutral-600/0 dark:from-neutral-200/60 dark:via-neutral-200/30 dark:to-neutral-200/0" />
          </button>
        </BlurInEffect>
      ) : (
        <BlurInEffect index={1}>
          {state?.error ? <div>state.error</div> : ''}
          <form action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />

            <button type="submit" className="group w-full">
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-600/60 via-neutral-600/30 to-neutral-600/0 dark:from-neutral-200/60 dark:via-neutral-200/30 dark:to-neutral-200/0" />
              <div className="flex w-full items-center justify-between py-4 md:py-8">
                <div className="flex items-center justify-between space-x-4">
                  <Icons.gitHub className="size-12" />
                  <div className="border-b border-foreground text-xl transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:border-dashed md:text-3xl">
                    Sign In with GitHub
                  </div>
                </div>
                <Icons.arrowUpRight className="size-12 transition-all duration-300 ease-out group-hover:-translate-x-1" />
              </div>
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-600/60 via-neutral-600/30 to-neutral-600/0 dark:from-neutral-200/60 dark:via-neutral-200/30 dark:to-neutral-200/0" />
            </button>
          </form>
        </BlurInEffect>
      )}
    </>
  )
}

export default SignInWithGithub

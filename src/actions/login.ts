'use server'
import { signIn } from '~/server/auth'
import { validatedAction } from '~/actions/index'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const signInWithGithubActionSchema = z.object({
  redirect: z.string().optional(),
})
export const signInWithGithubAction = validatedAction(
  signInWithGithubActionSchema,
  async (data, formData) => {
    const { redirect: redirectParma } = data
    let res
    try {
      res = await signIn('github', {
        redirect: !!redirectParma,
        redirectTo: redirectParma ? redirectParma : undefined,
      })
    } catch (e) {
      console.error(e)
      return { error: 'Sign in with GitHub Failed.' }
    }
    redirect(res)
  },
)

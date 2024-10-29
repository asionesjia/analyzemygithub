'use server'

import { streamResponse } from '~/actions/iterateStream'

export const publicAnalyzeAction = streamResponse(async function* () {
  try {
    // const githubData = await apiServer.github.hello({ username: 'nana' })
    // console.log(githubData)
    yield { index: 1, message: 'Step1', error: null }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    yield { index: 2, message: 'Step2', error: null }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    yield { index: 3, message: 'Step3', error: null }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    yield { index: 4, message: 'Step4', error: null }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    yield { index: 5, message: 'Step5', error: null }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    yield { index: 6, message: 'Step6', error: null }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    yield { index: 7, message: 'Step7', error: null }
  } catch (e) {
    console.error(e)
    return { index: undefined, message: undefined, error: e.message }
  }
})

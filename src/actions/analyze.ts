import { z } from 'zod'

const publicAnalyzeActionSchema = z.object({
  accessToken: z.string(),
})

function* foo(index: number) {
  while (index < 2) {
    yield index
    index++
  }
}

export async function* publicAnalyzeAction() {
  try {
    for (let i = 0; i < 10; i++) {
      console.log(i)
      yield { index: i.toString() }
      i++
    }
    return { index: 'ok' }
  } catch (e) {
    console.error(e)
    return { error: '' }
  }
}

export async function* fetchDataAction() {
  yield '第一个数据块'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  yield '第二个数据块'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  yield '第三个数据块'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  yield '第三个数据块'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  yield '第三个数据块'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  yield '第三个数据块'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  yield '第三个数据块'
  return { done: true }
}

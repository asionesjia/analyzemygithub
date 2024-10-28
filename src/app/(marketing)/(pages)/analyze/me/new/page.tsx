'use client'
import { MultiStepLoader } from '~/components/ui/multi-step-loader'
import { Icons } from '~/components/icons'
import { useActionState, useEffect, useState } from 'react'
import { fetchDataAction } from '~/actions/analyze'

const loadingStates = [
  {
    text: 'Buying a condo',
  },
  {
    text: 'Travelling in a flight',
  },
  {
    text: 'Meeting Tyler Durden',
  },
  {
    text: 'He makes soap',
  },
  {
    text: 'We goto a bar',
  },
  {
    text: 'Start a fight',
  },
  {
    text: 'We like it',
  },
  {
    text: 'Welcome to F**** C***',
  },
]

type PageProps = {}

const Page = ({}: PageProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [state, formAction, isPending] = useActionState(fetchDataAction, undefined)
  useEffect(() => {
    state
      ?.next()
      .then((res) => {
        setCurrentIndex(1)
        return state.next()
      })
      .then((res) => {
        setCurrentIndex(2)
        return state.next()
      })
      .then((res) => {
        setCurrentIndex(3)
        return state.next()
      })
      .then((res) => {
        setCurrentIndex(4)
        return state.next()
      })
  }, [state])
  return (
    <div>
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        currentIndex={currentIndex}
      />
      {loading && (
        <form action={formAction}>
          <button
            type="submit"
            formAction={formAction}
            className="fixed right-4 top-4 z-[120] text-black dark:text-white"
          >
            <Icons.close className="h-10 w-10" />
          </button>
        </form>
      )}
    </div>
  )
}

export default Page

'use client'
import { MultiStepLoader } from '~/components/ui/multi-step-loader'
import { Icons } from '~/components/icons'
import { memo, useCallback, useState } from 'react'
import { publicAnalyzeAction } from '~/actions/analyze'
import { iterateStreamResponse } from '~/actions/iterateStream'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import { Button } from '~/components/ui/button'

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

type PageLayoutProps = {
  handleAnalyze: () => Promise<void>
}

const PageLayout = memo(({ handleAnalyze }: PageLayoutProps) => {
  return (
    <>
      <div className="space-y-4 px-4 pt-4 md:space-y-8 md:px-10 md:pt-10">
        <BlurInEffect index={0}>
          <div className="pb-4 text-3xl font-semibold sm:text-5xl md:pb-8">
            Prepare for analysing yourself
          </div>
          <LineSeparator />
        </BlurInEffect>
        <div className="space-y-4 md:space-y-8">
          <BlurInEffect index={1}>
            <div className="text-xl font-normal sm:text-3xl">
              Select one to confirm your analysis scope
            </div>
          </BlurInEffect>
        </div>
      </div>
      <BlurInEffect index={2}>
        <div className="flex w-full items-center justify-end p-4 md:p-10">
          <Button onClick={handleAnalyze}>Start Analyzing</Button>
        </div>
      </BlurInEffect>
    </>
  )
})

const Page = () => {
  const [currentStep, setCurrentStep] = useState<{
    index: number | null | undefined
    message: string | null | undefined
    error: string | null | undefined
  }>({ index: 0, message: null, error: null })
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const handleAnalyze = useCallback(async () => {
    try {
      setIsLoaderOpen(true)
      setLoading(true)
      for await (const value of iterateStreamResponse(publicAnalyzeAction())) {
        console.log(value)
        setCurrentStep(value)
      }
      setIsLoaderOpen(false)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }, [])
  return (
    <>
      <PageLayout handleAnalyze={handleAnalyze} />
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isLoaderOpen}
        currentIndex={currentStep?.index || 0}
      />
      {isLoaderOpen && (
        <button
          onClick={() => setIsLoaderOpen(false)}
          className="fixed right-4 top-4 z-[120] text-black dark:text-white"
        >
          <Icons.close className="h-10 w-10" />
        </button>
      )}
    </>
  )
}

export default Page

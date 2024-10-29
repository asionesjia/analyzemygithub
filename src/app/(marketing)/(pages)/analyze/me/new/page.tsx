'use client'
import { MultiStepLoader } from '~/components/ui/multi-step-loader'
import { Icons } from '~/components/icons'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { publicAnalyzeAction } from '~/actions/analyze'
import { iterateStreamResponse } from '~/actions/iterateStream'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import { Button } from '~/components/ui/button'
import confetti from 'canvas-confetti'

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
  isAnalyzed: boolean
  loading: boolean
  setToggleLoader: Dispatch<SetStateAction<boolean>>
  handleAnalyze: () => Promise<void>
}

const PageLayout = memo(
  ({ isAnalyzed, loading, setToggleLoader, handleAnalyze }: PageLayoutProps) => {
    const congratulation = () => {
      const end = Date.now() + 100
      const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

      const frame = () => {
        if (Date.now() > end) return

        confetti({
          particleCount: 10,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        })
        confetti({
          particleCount: 10,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        })

        requestAnimationFrame(frame)
      }

      frame()
    }
    useEffect(() => {
      if (isAnalyzed) {
        const timer = setTimeout(() => {
          congratulation()
        }, 800)
        return () => clearTimeout(timer)
      }
    }, [isAnalyzed])
    return (
      <>
        <div className="space-y-4 px-4 pt-4 md:space-y-8 md:px-10 md:pt-10">
          <BlurInEffect index={0}>
            <div className="pb-4 text-3xl font-semibold sm:text-5xl md:pb-8">
              {isAnalyzed ? 'Your Analysis Completed ✨' : 'Prepare for analysing yourself'}
            </div>
            <LineSeparator />
          </BlurInEffect>
          <div className="space-y-4 md:space-y-8">
            <BlurInEffect index={1}>
              <div className="text-xl font-normal sm:text-3xl">
                {isAnalyzed
                  ? 'You are about to enter the analysis results page. You will be redirected in 3 seconds.'
                  : 'We will analyze all your GitHub public information as much as possible, including Profile, repository, issue, pull request, organize, discussion, object, etc. You will get a comprehensive analysis soon.'}
              </div>
            </BlurInEffect>
          </div>
        </div>
        <div className="flex w-full items-center justify-end p-4 md:p-10">
          {loading && (
            <BlurInEffect index={2} className="pr-4">
              <Button onClick={() => setToggleLoader(true)}>Details</Button>
            </BlurInEffect>
          )}
          <BlurInEffect index={3}>
            <Button onClick={handleAnalyze} isLoading={loading}>
              {loading ? 'Analyzing...' : 'Start Analyzing'}
            </Button>
          </BlurInEffect>
        </div>
      </>
    )
  },
)

const Page = () => {
  const [currentStep, setCurrentStep] = useState<{
    index: number | null | undefined
    message: string | null | undefined
    error: string | null | undefined
  }>({ index: 0, message: null, error: null })
  const [toggleLoader, setToggleLoader] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false)
  const handleAnalyze = useCallback(async () => {
    try {
      setToggleLoader(true)
      setLoading(true)
      for await (const value of iterateStreamResponse(publicAnalyzeAction())) {
        console.log(value)
        setCurrentStep(value)
      }
      setIsAnalyzed(true)
      setToggleLoader(false)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }, [])
  return (
    <>
      <PageLayout
        isAnalyzed={isAnalyzed}
        loading={loading}
        setToggleLoader={setToggleLoader}
        handleAnalyze={handleAnalyze}
      />
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={toggleLoader}
        currentIndex={currentStep?.index || 0}
      />
      {toggleLoader && (
        <button
          onClick={() => setToggleLoader(false)}
          className="fixed right-4 top-4 z-[120] text-black dark:text-white"
        >
          <Icons.close className="h-10 w-10" />
        </button>
      )}
    </>
  )
}

export default Page

'use client'
import { MultiStepLoader } from '~/components/ui/multi-step-loader'
import { Icons } from '~/components/icons'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { publicAnalyzeAction } from '~/actions/analyze'
import { iterateStreamResponse } from '~/actions/iterateStream'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import confetti from 'canvas-confetti'
import FullWidthButton from '~/app/_components/ui/full-width-button'
import { ArrowRight, ChartNoAxesCombined, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

const loadingStates = [
  {
    text: 'Start analyzing your github.',
  },
  {
    text: 'Successfully connected with GitHub.',
  },
  {
    text: 'Get Github Profile data.',
  },
  {
    text: 'Get Github Contributions data.',
  },
  {
    text: 'Get Github Starred Repositories data.',
  },
  {
    text: 'Get Github Pull Requests data.',
  },
  {
    text: 'Get Github Issues data.',
  },
  {
    text: 'Get Github Followers data.',
  },
  {
    text: 'Get Github Following data.',
  },
  {
    text: 'Get Github Discussion Comments data.',
  },
  {
    text: 'Get all Github Data data.',
  },
  {
    text: 'Analyze all public data and public repositories.',
  },
  {
    text: 'Use OpenAI gpt-4o-mini to deeply analyze.',
  },
  {
    text: 'All tasks completed！',
  },
]

type InteractionButtonsProps = {
  isAnalyzed: boolean
  loading: boolean
  setToggleLoader: Dispatch<SetStateAction<boolean>>
  handleAnalyze: () => Promise<void>
  analysisSlug?: string | null
}

const InteractionButtons = memo(
  ({
    isAnalyzed,
    loading,
    setToggleLoader,
    handleAnalyze,
    analysisSlug,
  }: InteractionButtonsProps) => {
    const router = useRouter()
    const handleRedirect = useCallback(() => {
      router.push(`/report/${analysisSlug}`)
    }, [analysisSlug])
    useEffect(() => {
      if (isAnalyzed) {
        const timer = setTimeout(handleRedirect, 3000)

        return () => clearTimeout(timer)
      }
    }, [isAnalyzed])
    return (
      <div className="w-full p-4 md:p-10">
        <BlurInEffect index={3}>
          <FullWidthButton
            label={isAnalyzed ? 'Go Now!' : 'Start Analysis'}
            iconLeft={ChartNoAxesCombined}
            iconRight={isAnalyzed ? ArrowRight : Play}
            onClick={isAnalyzed ? handleRedirect : handleAnalyze}
            isLoading={loading}
            loadingText="Analyzing..."
          />
        </BlurInEffect>
        {loading && (
          <BlurInEffect index={2} className="pr-4">
            <FullWidthButton onClick={() => setToggleLoader(true)} hrTop={false}>
              Analyzing Details
            </FullWidthButton>
          </BlurInEffect>
        )}
      </div>
    )
  },
)

type PageLayoutProps = {
  isAnalyzed: boolean
}

const PageLayout = memo(({ isAnalyzed }: PageLayoutProps) => {
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
            {isAnalyzed ? 'Your Analysis Completed ✨' : 'Prepare for analysing the GitHub account'}
          </div>
          <LineSeparator />
        </BlurInEffect>
        <div className="space-y-4 md:space-y-8">
          <BlurInEffect index={1}>
            <div className="text-xl font-normal sm:text-3xl">
              {isAnalyzed
                ? 'You are about to enter the analysis results page. You will be redirected in 3 seconds.'
                : 'We will analyze all the GitHub public information as much as possible, including Profile, repository, issue, pull request, organize, discussion, object, etc. You will get a comprehensive analysis soon.'}
            </div>
          </BlurInEffect>
        </div>
      </div>
    </>
  )
})

const Page = () => {
  const [currentStep, setCurrentStep] = useState<{
    index: number | null | undefined
    message: string | null | undefined
    error: string | null | undefined
    slug?: string | null | undefined
  }>({ index: 0, message: null, error: null, slug: undefined })
  const [analysisSlug, setAnalysisSlug] = useState<string | null | undefined>(undefined)
  const [toggleLoader, setToggleLoader] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false)
  const handleAnalyze = useCallback(async () => {
    try {
      setToggleLoader(true)
      setLoading(true)
      for await (const value of iterateStreamResponse(publicAnalyzeAction())) {
        console.log(value)
        // @ts-ignore
        setCurrentStep(value)
      }
      setToggleLoader(false)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }, [])
  useEffect(() => {
    if (currentStep?.slug) {
      setAnalysisSlug(currentStep?.slug)
      setIsAnalyzed(true)
    }
  }, [currentStep?.slug])

  return (
    <>
      <PageLayout isAnalyzed={isAnalyzed} />
      <InteractionButtons
        loading={loading}
        handleAnalyze={handleAnalyze}
        isAnalyzed={isAnalyzed}
        setToggleLoader={setToggleLoader}
        analysisSlug={analysisSlug}
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

'use client'

import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import ScopeSelects from '~/app/(marketing)/(pages)/analyze/me/_components/scope-selects'
import { Input } from '~/components/ui/input'
import { memo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'

const InputComponent = memo(() => {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleConfirm = () => {
    if (username) {
      router.push(`/${username}`)
    }
  }

  return (
    <div>
      <Input
        className="text-xl font-normal sm:text-3xl"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={handleConfirm}>确认</Button>
    </div>
  )
})

type NewAnalysisProps = {}

const NewAnalysis = ({}: NewAnalysisProps) => {
  return (
    <div className="space-y-4 px-4 pt-4 md:space-y-8 md:px-10 md:pt-10">
      <BlurInEffect index={0}>
        <div className="pb-4 text-3xl font-semibold sm:text-5xl md:pb-8">
          Enter the GitHub username you want to analyze
        </div>
        <LineSeparator />
      </BlurInEffect>
      <div className="space-y-4 md:space-y-8">
        <BlurInEffect index={1}>
          <InputComponent />
        </BlurInEffect>
        <ScopeSelects />
      </div>
    </div>
  )
}

export default NewAnalysis

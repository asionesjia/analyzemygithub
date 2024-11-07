'use client'

import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import { Input } from '~/components/ui/input'
import { memo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'
import { Label } from '~/components/ui/label'

const InputComponent = memo(() => {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleConfirm = () => {
    if (username) {
      router.push(`/analyze/${username}`)
    }
  }

  return (
    <div className="mx-auto w-full p-6 pt-12 md:flex md:max-w-md md:flex-col md:items-center md:justify-between md:space-y-6">
      <div className="w-full">
        <Label>Username</Label>
        <Input
          className="text-xl font-normal sm:text-3xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <Button className="w-full" onClick={handleConfirm}>
        确认
      </Button>
    </div>
  )
})

type NewAnalysisProps = {}

const NewAnyoneAnalysis = ({}: NewAnalysisProps) => {
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
          <div className="text-xl font-normal sm:text-3xl">
            Please confirm that the username you entered actually exists
          </div>
        </BlurInEffect>
        <BlurInEffect index={2}>
          <InputComponent />
        </BlurInEffect>
      </div>
    </div>
  )
}

export default NewAnyoneAnalysis

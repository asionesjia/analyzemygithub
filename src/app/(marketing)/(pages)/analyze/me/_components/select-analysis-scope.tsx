'use client'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import ScopeSelects from '~/app/(marketing)/(pages)/analyze/me/_components/scope-selects'

type SelectAnalysisScopeProps = {}

const SelectAnalysisScope = ({}: SelectAnalysisScopeProps) => {
  return (
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
        <ScopeSelects />
      </div>
    </div>
  )
}

export default SelectAnalysisScope

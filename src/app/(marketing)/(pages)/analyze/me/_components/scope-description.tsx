import { BlurInEffect } from '~/components/ui/blur-in-effect'
import { memo } from 'react'

type ScopeDescriptionProps = {
  blurInEffectIndex?: number
  description: string
}

const ScopeDescription = memo(({ blurInEffectIndex = 0, description }: ScopeDescriptionProps) => {
  return (
    <BlurInEffect index={blurInEffectIndex}>
      <div className="py-4 md:py-8">{description}</div>
    </BlurInEffect>
  )
})

export default ScopeDescription

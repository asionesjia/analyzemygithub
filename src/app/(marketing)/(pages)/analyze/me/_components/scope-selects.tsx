import React, { ForwardRefExoticComponent, memo, RefAttributes, useCallback, useState } from 'react'
import { BlurInEffect } from '~/components/ui/blur-in-effect'
import LineSeparator from '~/components/ui/line-separator'
import { BookLock, BookMarked, LucideProps } from 'lucide-react'
import ScopeDescription from '~/app/(marketing)/(pages)/analyze/me/_components/scope-description'
import { Icons } from '~/components/icons'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type scopeSelectsDataProps = {
  title: string
  description: string
  hoverLabel: string
  iconLeft: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  iconRight: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  position: number
}

const scopeSelectsData: scopeSelectsDataProps[] = [
  {
    title: 'Analyze Public Repositories Only',
    description: 'Instantly analyze only your public repositories for a quick start.',
    hoverLabel: 'Start Public Analysis',
    iconLeft: BookMarked,
    iconRight: Icons.arrowUpRight,
    position: 1,
  },
  {
    title: 'Comprehensive GitHub Analysis',
    description:
      'Authorize access for in-depth analysis of all repositories, including private and organizational (read-only). We ensure no access tokens or repository data are stored, retaining only the final evaluation scores.',
    hoverLabel: 'Get Full Analysis',
    iconLeft: BookLock,
    iconRight: Icons.arrowRight,
    position: 2,
  },
]

const defaultScopeSelectDescription: string = 'hahahah hahahhah hahhahahaha hhha.'

type ScopeSelectOptionProps = {
  title: string
  hoverLabel?: string
  blurInEffectIndex: number
  iconLeft: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
  iconRight: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  position: number
  setHovered: React.Dispatch<React.SetStateAction<number | null | undefined>>
  onClick?: (mode: string, router: AppRouterInstance) => void
}

const ScopeSelectOption = memo(
  ({
    title,
    hoverLabel,
    blurInEffectIndex,
    iconLeft: IconLeft,
    iconRight: IconRight,
    onClick,
    position,
    setHovered,
  }: ScopeSelectOptionProps) => {
    const router = useRouter()
    return (
      <BlurInEffect index={blurInEffectIndex}>
        <button
          onMouseEnter={() => setHovered(position)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onClick?.('public', router)}
          type="button"
          className="group w-full"
        >
          <LineSeparator />
          <div className="flex w-full items-center justify-between py-4 md:py-8">
            <div className="flex items-center justify-between space-x-4">
              <IconLeft className="size-8" />
              <div className="border-b border-foreground text-xl font-semibold transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:border-dashed md:text-2xl">
                {title}
              </div>
            </div>
            <IconRight className="size-8 transition-all duration-300 ease-out group-hover:-translate-x-1" />
          </div>
          {position === 2 && <LineSeparator />}
        </button>
      </BlurInEffect>
    )
  },
)

type ScopeSelectsProps = {}

const ScopeSelects = ({}: ScopeSelectsProps) => {
  const [hovered, setHovered] = useState<number | null | undefined>(undefined)

  const handleClick = useCallback((mode: string, router: AppRouterInstance) => {
    router.push('/analyze/me/new?mode=public')
  }, [])

  return (
    <div>
      {scopeSelectsData.map((item, index) => {
        return (
          <ScopeSelectOption
            title={item.title}
            blurInEffectIndex={index + 2}
            key={index}
            iconLeft={item.iconLeft}
            iconRight={item.iconRight}
            position={item.position}
            setHovered={setHovered}
            onClick={handleClick}
          />
        )
      })}
      <ScopeDescription
        blurInEffectIndex={hovered === undefined ? 4 : hovered === 1 ? 0 : hovered === 2 ? 0 : 0}
        description={
          !hovered
            ? defaultScopeSelectDescription
            : hovered === 1
              ? scopeSelectsData[0]?.description || defaultScopeSelectDescription
              : hovered === 2
                ? scopeSelectsData[1]?.description || defaultScopeSelectDescription
                : defaultScopeSelectDescription
        }
      />
    </div>
  )
}

export default ScopeSelects

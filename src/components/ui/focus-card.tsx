'use client'
import React, { useState } from 'react'
import { cn } from '~/lib/utils'
import LineSeparator from '~/components/ui/line-separator'

export const Card = React.memo(
  ({
    title,
    description,
    hoverLabel,
    position,
    hovered,
    setHovered,
  }: {
    title: string
    description: string
    hoverLabel: string
    position: 'left' | 'right'
    hovered: 'left' | 'right' | null
    setHovered: React.Dispatch<React.SetStateAction<'left' | 'right' | null>>
  }) => (
    <div
      onMouseEnter={() => setHovered(position)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'relative h-32 w-full overflow-hidden rounded-lg border bg-card px-4 py-2 text-card-foreground shadow-md transition-all duration-300 ease-out md:h-52',
        hovered !== null && hovered !== position && 'scale-[0.98] blur-sm',
      )}
    >
      <div className="object-cover px-2">
        <div className="py-2 text-2xl font-semibold">{title}</div>
        <LineSeparator />
        <div className="pt-2 text-muted-foreground">{description}</div>
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-black/50 px-4 py-8 transition-opacity duration-300',
          hovered === position ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent md:text-2xl">
          {hoverLabel}
        </div>
      </div>
    </div>
  ),
)

Card.displayName = 'Card'

export type FocusCardProps = {
  title: string
  description: string
  hoverLabel: string
  position: 'left' | 'right'
}

export function FocusCards({ cards }: { cards: FocusCardProps[] }) {
  const [hovered, setHovered] = useState<'left' | 'right' | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between md:flex-row">
      <Card
        title={cards[0]?.title || ''}
        description={cards[0]?.description || ''}
        hoverLabel={cards[0]?.hoverLabel || ''}
        position={'left'}
        hovered={hovered}
        setHovered={setHovered}
      />
      <div className="m-0 h-32 w-px border-none bg-gradient-to-t from-neutral-600/0 via-neutral-600/60 to-neutral-600/0 dark:from-neutral-200/0 dark:via-neutral-200/60 dark:to-neutral-200/0 md:mx-4 md:h-48"></div>
      <Card
        title={cards[1]?.title || ''}
        description={cards[1]?.description || ''}
        hoverLabel={cards[1]?.hoverLabel || ''}
        position={'right'}
        hovered={hovered}
        setHovered={setHovered}
      />
    </div>
  )
}

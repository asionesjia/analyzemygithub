'use client'

import React from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart'
import { chartConfig } from '~/config/chart'

interface RadarChartProps {
  data?: { score: string; desktop: number; fullMark: number }[]
  name?: string
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ data, name }) => {
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadarChart width={450} height={300} data={data}>
        <PolarGrid className="fill-[--color-desktop] opacity-10" />
        <PolarAngleAxis dataKey="score" />
        <PolarRadiusAxis angle={18} domain={[0, 1, 2, 3, 4, 5]} />
        <Radar name={name} dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.7} />
        <ChartTooltip content={<ChartTooltipContent />} />
      </RadarChart>
    </ChartContainer>
  )
}

export default RadarChartComponent

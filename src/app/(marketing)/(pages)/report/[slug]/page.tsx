'use client'

import { cn } from '~/lib/utils'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useAnalysis } from '~/components/providers/analysisDataProvider'
import RadarChartComp from '~/app/(marketing)/(pages)/report/[slug]/_components/radar-chart'
import { Badge } from '~/components/ui/badge'
import Flag from 'react-world-flags'

type PageProps = {}

const Page = ({}: PageProps) => {
  const { analyses } = useAnalysis()
  return (
    <main
      className={cn('relative py-6 lg:gap-10 lg:py-8 xl:grid', {
        'xl:grid-cols-[1fr_300px]': true,
      })}
    >
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="truncate">Analytics</div>
          <ChevronRightIcon className="size-4" />
          <div className="font-medium text-foreground">Overview</div>
        </div>
        <div className="flex items-center justify-between pr-4">
          <div className="flex items-center space-x-6">
            <Avatar className="size-20 cursor-pointer rounded-xl">
              <AvatarImage
                alt={analyses?.name || ''}
                src={analyses?.avatarUrl || undefined}
                className="size-20 h-20 w-20"
              />
              <AvatarFallback>
                {(analyses?.name || analyses?.login || analyses?.email || 'User')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>
                Hi, {analyses?.name}{' '}
                <Flag code={analyses?.infer.user_info.country} className="inline-flex h-6" />
              </h1>
              <p className="text-balance text-lg text-muted-foreground">
                Click on any tab to view the data you care about.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-2">
            <div className="font-semibold">Talent Rating</div>
            <div className="flex items-center justify-start space-x-2">
              <Avatar className="size-9 cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                <AvatarFallback className="bg-transparent text-xl font-black text-white">
                  {(analyses?.metrics?.comprehensiveScore.toFixed(0).toString() || '0')
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-2xl font-semibold">
                {analyses?.metrics?.comprehensiveScore.toFixed(2)}
              </div>
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              Above <b>98%</b> of people
            </div>
          </div>
        </div>
        <div className="pb-12 pt-12">
          <div className="flex items-center justify-between space-x-6">
            <div className="flex flex-col items-start space-y-6">
              <div>
                <div className="font-semibold">
                  Activity Score{' '}
                  <Badge variant="outline" className="ml-2 px-2">
                    {Number(((analyses?.metrics?.activityScore || 0) * 5).toFixed(2))}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Measures overall participation and engagement in various activities.
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  Contribution Score
                  <Badge variant="outline" className="ml-2 px-2">
                    {Number(((analyses?.metrics?.contributionScore || 0) * 5).toFixed(2))}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Evaluates the number and quality of contributions made to projects.
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  Technical Score
                  <Badge variant="outline" className="ml-2 px-2">
                    {Number(((analyses?.metrics?.technicalScore || 0) * 5).toFixed(2))}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Reflects technical expertise demonstrated through code and solutions.
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  Community Impact Score
                  <Badge variant="outline" className="ml-2 px-2">
                    {Number(((analyses?.metrics?.communityImpactScore || 0) * 5).toFixed(2))}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Assesses the positive influence and impact on the community.
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  Community Activity Score
                  <Badge variant="outline" className="ml-2 px-2">
                    {Number(((analyses?.metrics?.communityActivityScore || 0) * 5).toFixed(2))}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Tracks interactions, collaborations, and support provided to peers.
                </div>
              </div>
            </div>
            <RadarChartComp
              data={[
                {
                  score: 'Activity',
                  desktop: Number(((analyses?.metrics?.activityScore || 0) * 5).toFixed(2)),
                  fullMark: 5,
                },
                {
                  score: 'Contribution',
                  desktop: Number(((analyses?.metrics?.contributionScore || 0) * 5).toFixed(2)),
                  fullMark: 5,
                },
                {
                  score: 'Technical',
                  desktop: Number(((analyses?.metrics?.technicalScore || 0) * 5).toFixed(2)),
                  fullMark: 5,
                },
                {
                  score: 'Community Impact',
                  desktop: Number(((analyses?.metrics?.communityImpactScore || 0) * 5).toFixed(2)),
                  fullMark: 5,
                },
                {
                  score: 'Community Activity',
                  desktop: Number(
                    ((analyses?.metrics?.communityActivityScore || 0) * 5).toFixed(2),
                  ),
                  fullMark: 5,
                },
              ]}
              name="Score"
            />
          </div>
        </div>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 pt-4">
          <ScrollArea className="pb-10">
            <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] space-y-4 py-12">
              <div>导航</div>
              <div>筛选器</div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </main>
  )
}

export default Page

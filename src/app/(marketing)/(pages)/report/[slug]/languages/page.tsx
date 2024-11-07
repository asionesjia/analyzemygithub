import { cn } from '~/lib/utils'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '~/components/ui/scroll-area'
import { LanguagesPieChart } from '~/app/(marketing)/(pages)/report/[slug]/_components/languages-pie-chart'

type PageProps = {}

const Page = ({}: PageProps) => {
  return (
    <main
      className={cn('relative py-6 lg:gap-10 lg:py-8 xl:grid', {
        'xl:grid-cols-[1fr_300px]': true,
      })}
    >
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="truncate">Overview</div>
          <ChevronRightIcon className="size-4" />
          <div className="font-medium text-foreground">{'Components Title'}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>Languages</h1>

          <p className="text-balance text-lg text-muted-foreground">
            Programming languages you have used and are good at.
          </p>
        </div>
        <div className="pb-12 pt-8">
          <LanguagesPieChart />
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

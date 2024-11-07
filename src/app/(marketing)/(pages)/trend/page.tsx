'use server'
import { findAllAnalyses } from '~/server/mongodb/api'
import { DataTable } from '~/app/(marketing)/(pages)/trend/_components/data-table'
import { columns } from '~/app/(marketing)/(pages)/trend/_components/columns'
import { cn } from '~/lib/utils'

type PageProps = {}

const Page = async ({}: PageProps) => {
  const analyses = await findAllAnalyses()
  let list = []
  for (const analyse of analyses) {
    list.push({
      name: analyse.name,
      avatarUrl: analyse.avatarUrl,
      login: analyse.login,
      comprehensiveScore: analyse.metrics?.comprehensiveScore,
      nation: analyse.infer.user_info.country,
      languages: analyse.languages?.map((item) => item.name) || [],
      skills: analyse.infer.expertise_fields
        .map((item: { field: string; proficiency: { field: string; level: number }[] }) =>
          item.proficiency.map((i) => i.field),
        )
        .flat(),
    })
  }

  const nations = Array.from(new Set(list.map((item) => item.nation)))
  const languages = Array.from(new Set(list.flatMap((item) => item.languages) || []))
  const skills = Array.from(new Set(list.flatMap((skill) => skill.skills) || []))
  return (
    <div className="relative z-10 px-16 py-8">
      <div className="space-y-2 pb-6">
        <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>Trend</h1>
        <p className="text-balance text-lg text-muted-foreground">
          Who are the great people in the community?
        </p>
      </div>
      <DataTable columns={columns} data={list} />
    </div>
  )
}

export default Page

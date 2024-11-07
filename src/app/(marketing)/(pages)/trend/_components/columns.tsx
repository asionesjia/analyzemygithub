'use client'

import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '~/app/(marketing)/(pages)/trend/_components/data-table-columns-header'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Flag from 'react-world-flags'
import { Badge } from '~/components/ui/badge'

export const trendSchema = z.object({
  avatarUrl: z.string().url(),
  name: z.string().optional().nullable(),
  login: z.string(),
  nation: z.string(),
  comprehensiveScore: z.number().optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()),
})

export type Trend = z.infer<typeof trendSchema>

export const columns: ColumnDef<Trend>[] = [
  {
    accessorKey: 'avatarUrl',
    header: 'Avatar',
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.getValue('avatarUrl')} alt={row.getValue('name') || 'User'} />
          <AvatarFallback>{row.getValue('name')}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <Link
          href={`/report/${row.getValue('login')}`}
          className="flex items-center justify-center space-x-2 whitespace-nowrap font-semibold hover:underline"
        >
          <div>{row.getValue('name')}</div>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )
    },
  },
  {
    accessorKey: 'nation',
    header: 'Nation',
    cell: ({ row }) => {
      return (
        <Flag
          code={row.getValue('nation')}
          className="inline-flex h-5 rounded-sm"
          fallback={
            <div className="flex h-8 w-10 items-center justify-center rounded border text-xs font-semibold shadow-sm">
              NaN
            </div>
          }
        />
      )
    },
    filterFn: 'equals',
  },
  {
    accessorKey: 'login',
    header: 'Login',
  },
  {
    accessorKey: 'languages',
    header: 'Languages',
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue<string[]>('languages')?.map((item) => {
            return (
              <Badge key={item} variant="outline" className="m-1">
                {item}
              </Badge>
            )
          })}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const rowValues = row.getValue(columnId)
      return Array.isArray(rowValues) && rowValues.includes(filterValue)
    },
  },
  {
    accessorKey: 'skills',
    header: 'Skills',
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue<string[]>('skills')?.map((item) => {
            return (
              <Badge key={item} variant="outline" className="m-1">
                {item}
              </Badge>
            )
          })}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const rowValues = row.getValue(columnId)
      return Array.isArray(rowValues) && rowValues.includes(filterValue)
    },
  },
  {
    accessorKey: 'comprehensiveScore',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
    cell: ({ row }) => {
      return (
        <Avatar className="size-9 cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          <AvatarFallback className="bg-transparent text-xl font-black text-white">
            {(
              row
                .getValue<number | undefined | null>('comprehensiveScore')
                ?.toFixed(0)
                .toString() || '0'
            )
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      )
    },
  },
]

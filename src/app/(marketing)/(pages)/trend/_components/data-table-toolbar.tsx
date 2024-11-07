import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { DataTableViewOptions } from '~/app/(marketing)/(pages)/trend/_components/data-table-view-options'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useMemo, useState } from 'react'
import Flag from 'react-world-flags'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const [selectedNation, setSelectedNation] = useState<string | undefined>(undefined)
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined)
  const [selectedSkill, setSelectedSkill] = useState<string | undefined>(undefined)

  const isFiltered = table.getState().columnFilters.length > 0

  // 获取所有nation列的唯一值
  const uniqueNations = useMemo(() => {
    const nations = table.getRowModel().rows.map((row: any) => row.getValue('nation'))
    return [...new Set(nations)]
  }, [table.getRowModel().rows])

  const uniqueLanguages = useMemo(() => {
    const languages = table
      .getRowModel()
      .rows.map((row: any) => row.getValue('languages'))
      .flat()
    return [...new Set(languages)]
  }, [table.getRowModel().rows])

  const uniqueSkills = useMemo(() => {
    const skills = table
      .getRowModel()
      .rows.map((row: any) => row.getValue('skills'))
      .flat()
    return [...new Set(skills)]
  }, [table.getRowModel().rows])

  // 更新过滤条件
  const handleNationChange = (nation: string | undefined) => {
    setSelectedNation(nation)
    table.getColumn('nation')?.setFilterValue(nation || '')
  }

  const handleLanguageChange = (language: string | undefined) => {
    setSelectedLanguage(language)
    table.getColumn('languages')?.setFilterValue(language || '')
  }

  const handleSkillChange = (skill: string | undefined) => {
    setSelectedSkill(skill)
    table.getColumn('skills')?.setFilterValue(skill || '')
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Login..."
          value={(table.getColumn('login')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('login')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
        <Select onValueChange={handleNationChange} value={selectedNation}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Nation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a nation</SelectLabel>
              {uniqueNations.map((nation, index) => (
                <SelectItem key={index} value={nation}>
                  <Flag
                    code={nation}
                    className="mr-2 inline-flex h-3 rounded-sm"
                    fallback={
                      <div className="mr-2 flex h-4 w-6 items-center justify-center rounded border text-xs font-semibold shadow-sm">
                        NaN
                      </div>
                    }
                  />
                  {nation}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={handleLanguageChange} value={selectedLanguage}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a language</SelectLabel>
              {uniqueLanguages.map((lang, index) => (
                <SelectItem key={index} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={handleSkillChange} value={selectedSkill}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a skill</SelectLabel>
              {uniqueSkills.map((skill, index) => (
                <SelectItem key={index} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

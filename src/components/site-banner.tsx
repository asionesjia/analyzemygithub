'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function SiteBanner() {
  return (
    <div className="group z-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-4 py-1 text-left font-sans text-sm font-medium tracking-tight text-white md:text-center">
      <Link
        href="https://github.com/asionesjia/analyzemygithub"
        target="_blank"
        className="inline-flex text-xs leading-normal md:text-sm"
      >
        ✨{' '}
        <span className="ml-1 font-[580] dark:font-[550]">
          {' '}
          <b>Open to collaboration</b>, seeking the right company or team to join this project.
        </span>{' '}
        <ChevronRight className="ml-1 mt-[3px] hidden size-4 transition-all duration-300 ease-out group-hover:translate-x-1 lg:inline-block" />
      </Link>
      <hr className="absolute bottom-0 right-0 m-0 h-px w-full bg-neutral-200/30" />
    </div>
  )
}

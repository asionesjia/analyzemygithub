import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Metadata } from 'next'
import { envClient } from '~/env/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (str: string, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())

export function absoluteUrl(path: string) {
  return `${envClient.NEXT_PUBLIC_APP_URL}${path}`
}

export function constructMetadata({
  title = 'Analysis & Insights Your GitHub for Free - Analyze My Github',
  description = 'AnalyzeMyGitHub is a powerful GitHub data analysis tool designed to evaluate developer skills, contributions, and project impact. Using GitHub’s GraphQL API and multi-dimensional data modeling, it provides detailed insights into a developer’s expertise across various fields and their skill ranking. Ideal for individual developers looking to showcase their contributions or team managers seeking potential candidates, AnalyzeMyGitHub helps uncover meaningful insights from GitHub data.',
  image = absoluteUrl('/og'),
  ...props
}: {
  title?: string
  description?: string
  image?: string
  [key: string]: Metadata[keyof Metadata]
}): Metadata {
  return {
    title,
    description,
    keywords: [
      'GitHub',
      'Developer Assessment',
      'TalentRank',
      'Open Source Contribution',
      'Developer Ranking',
      'AnalyzeMyGitHub',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@asionesjia',
    },
    icons: '/favicon.ico',
    metadataBase: new URL('https://analyzemygithub.com'),
    authors: [
      {
        name: 'Asiones Jia',
        url: 'https://twitter.com/AsionesJia',
      },
    ],
    creator: 'Asiones Jia',
    ...props,
  }
}

export const uuid = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

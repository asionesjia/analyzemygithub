'use client'

import React, { createContext, useContext, useState } from 'react'
import { GitHubUser } from '~/server/api/routers/github/types'

interface AnalysisContextType {
  analyses: GitHubUser | undefined
  setAnalyses: (newAnalyses: GitHubUser | undefined) => void
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export const AnalysisDataProvider: React.FC<{
  children: React.ReactNode
  initialData: GitHubUser
}> = ({ children, initialData = undefined }) => {
  const [analyses, setAnalyses] = useState<GitHubUser | undefined>(initialData)

  return (
    <AnalysisContext.Provider value={{ analyses, setAnalyses }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)

  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisDataProvider')
  }

  return context // 现在返回的是 AnalysisContextType 类型，不会再出现 undefined
}

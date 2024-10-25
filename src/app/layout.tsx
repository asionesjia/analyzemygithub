import '~/styles/globals.css'

import { type Metadata } from 'next'

import { TRPCReactProvider } from '~/trpc/react'
import { cn } from '~/lib/utils'
import { fontSans } from '~/lib/fonts'
import { ThemeProvider } from '~/components/theme-provider'

export const metadata: Metadata = {
  title: 'Create T3 App',
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background relative flex min-h-screen w-full flex-col justify-center overflow-x-hidden scroll-smooth font-sans antialiased',
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

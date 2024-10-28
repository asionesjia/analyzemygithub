import '~/styles/globals.css'

import { type Metadata, Viewport } from 'next'

import { TRPCReactProvider } from '~/trpc/react'
import { absoluteUrl, cn, constructMetadata } from '~/lib/utils'
import { fontSans } from '~/lib/fonts'
import { ThemeProvider } from '~/components/theme-provider'
import { Analytics } from '~/components/analytics'
import { TooltipProvider } from '~/components/ui/tooltip'
import { Toaster } from '~/components/ui/toaster'
import { AnimatePresence } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = constructMetadata({
  title: 'Analyze Your Github',
  description:
    'Gain powerful insights into developer reputation with transparent, data-driven GitHub analysis.',
  image: absoluteUrl('/og'),
})

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'relative flex min-h-screen w-full flex-col justify-center overflow-x-hidden scroll-smooth bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <SessionProvider>
          <AnimatePresence>
            <ThemeProvider attribute="class" defaultTheme="light">
              <TooltipProvider>
                <TRPCReactProvider>{children}</TRPCReactProvider>
                <Toaster />
                <Analytics />
              </TooltipProvider>
            </ThemeProvider>
          </AnimatePresence>
        </SessionProvider>
      </body>
    </html>
  )
}

import { StarsBackground } from '~/components/ui/starts-background'
import { ShootingStars } from '~/components/ui/shooting-starts'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Spotlight } from '~/components/ui/spotlight'
import { BlurInEffect } from '~/components/ui/blur-in-effect'

type HeroProps = {}

const Hero = async ({}: HeroProps) => {
  return (
    <section id="hero">
      <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background antialiased bg-grid-white/[0.02] md:items-center md:justify-center">
        <Spotlight className="-left-10 -top-60 md:-top-40 md:left-0" fill="white" />
        <ShootingStars />
        <StarsBackground />
        <div className="relative h-full overflow-hidden py-5 md:py-14">
          <div className="z-10 flex flex-col">
            <div className="mt-10 grid grid-cols-1 md:mt-20">
              <div className="flex flex-col items-start gap-6 px-7 pb-8 text-center md:items-center md:px-10">
                <div className="relative flex flex-col gap-4 md:items-center lg:flex-row">
                  <BlurInEffect
                    as="h1"
                    index={0}
                    text="Analysis & Insights Your GitHub for Free"
                    className={cn(
                      'text-black dark:text-white',
                      'relative mx-0 max-w-[43.5rem] pt-5 md:mx-auto md:px-4 md:py-2',
                      'text-balance text-left font-semibold tracking-tighter md:text-center',
                      'text-5xl sm:text-7xl md:text-7xl lg:text-7xl',
                    )}
                  />
                </div>

                <BlurInEffect
                  as={'p'}
                  index={1}
                  className="max-w-xl text-balance text-left text-base tracking-tight text-black dark:font-medium dark:text-white md:text-center md:text-lg"
                >
                  analyzemygithub.com is a powerful GitHub data analysis tool designed to evaluate
                  developer skills, contributions, and project impact.
                </BlurInEffect>

                <div className="mx-0 flex w-full max-w-full flex-col gap-4 py-1 sm:max-w-lg sm:flex-row md:mx-auto">
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4">
                    <BlurInEffect index={2}>
                      <Link
                        href="/analyze/me"
                        className={cn(
                          buttonVariants({
                            variant: 'rainbow',
                            size: 'lg',
                          }),
                          'w-full gap-2',
                        )}
                      >
                        Start Self-Analysis
                        <ChevronRight className="ml-1 size-4 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
                      </Link>
                    </BlurInEffect>
                    <BlurInEffect index={2}>
                      <Link
                        href="/analyze/me?mode=anyone"
                        className={cn(
                          buttonVariants({
                            size: 'lg',
                            variant: 'rainbow-outline',
                          }),
                          'w-full gap-2',
                        )}
                      >
                        Analyze Someone
                        <ChevronRight className="ml-1 size-4 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
                      </Link>
                    </BlurInEffect>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

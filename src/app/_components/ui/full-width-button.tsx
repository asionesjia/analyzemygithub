import LineSeparator from '~/components/ui/line-separator'
import { Slot } from '@radix-ui/react-slot'
import { Loader2, LucideProps } from 'lucide-react'
import React, { ForwardRefExoticComponent, JSX } from 'react'
import { cn } from '~/lib/utils'
import { IconProps } from '~/components/icons'

type FullWidthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string
  iconLeft?:
    | ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
    | ((props: IconProps) => JSX.Element)
  iconRight?:
    | ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
    | ((props: IconProps) => JSX.Element)
  isLoading?: boolean
  loadingText?: string
  asChild?: boolean
  hrTop?: boolean
  hrBottom?: boolean
}

const FullWidthButton = React.forwardRef<HTMLButtonElement, FullWidthButtonProps>(
  (
    {
      children,
      className,
      label,
      iconLeft: IconLeft,
      iconRight: IconRight,
      isLoading = false,
      loadingText = 'Loading...',
      asChild = false,
      hrTop = true,
      hrBottom = true,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn('group w-full', isLoading ? 'cursor-not-allowed opacity-80' : '', className)}
        disabled={isLoading}
        {...props}
      >
        {hrTop && <LineSeparator />}
        <div className="flex w-full items-center justify-between py-4 pr-4 md:py-8">
          <div className="flex items-center justify-between space-x-4">
            {isLoading ? (
              <Loader2 className="size-8 animate-spin" />
            ) : (
              IconLeft && <IconLeft className="size-8" />
            )}
            <div className="border-b border-foreground text-xl font-semibold transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:border-dashed md:text-2xl">
              {isLoading ? loadingText : label || children}
            </div>
          </div>
          {IconRight && (
            <IconRight className="size-8 transition-all duration-300 ease-out group-hover:-translate-x-1" />
          )}
        </div>
        {hrBottom && <LineSeparator />}
      </Comp>
    )
  },
)

export default FullWidthButton

import { cn } from '~/lib/utils'

type LineSeparatorProps = {
  className?: string
}

const LineSeparator = ({ className }: LineSeparatorProps) => {
  return (
    <hr
      className={cn(
        'm-0 h-px w-full border-none bg-gradient-to-r from-neutral-600/0 via-neutral-600/30 to-neutral-600/60 dark:from-neutral-200/0 dark:via-neutral-200/30 dark:to-neutral-200/60',
        className,
      )}
    />
  )
}

export default LineSeparator

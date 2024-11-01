'use client'
import { ReactNode, RefObject, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { uuid } from '~/lib/utils'

export const BlurInEffect = ({
  children,
  text,
  as = 'div', // 动态标签类型，默认是 div
  className,
  filter = true,
  duration = 0.3,
  index = 0,
  ...props
}: {
  children?: ReactNode
  text?: string
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' // 支持的标签类型
  className?: string
  filter?: boolean
  duration?: number
  index?: number
} & React.ComponentProps<'div'>) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref as RefObject<Element>, { once: true })

  const MotionTag = motion.create(as) // 使用 motion(as) 动态渲染标签

  return (
    <MotionTag
      key={uuid()}
      ref={ref}
      initial={{
        opacity: 0,
        y: 20,
        filter: filter ? 'blur(24px)' : 'none',
      }}
      animate={isInView ? { opacity: 1, y: 0, filter: filter ? 'blur(0px)' : 'none' } : undefined}
      exit={{ opacity: 0, filter: 'blur(24px)', y: 20 }}
      transition={{
        duration,
        delay: isInView ? index * 0.2 : 0,
        ease: 'easeIn',
      }}
      // @ts-ignore
      className={className}
      {...props}
    >
      {children || text}
    </MotionTag>
  )
}

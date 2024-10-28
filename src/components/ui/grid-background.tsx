type GridBackgroundProps = {
  children?: React.ReactNode
}

const GridBackground = ({ children }: GridBackgroundProps) => {
  return (
    <>
      <div className="relative z-10">{children}</div>
      <div className="dark:bg-grid-white/[0.1] bg-grid-black/[0.05] fixed left-0 top-0 -z-10 min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-white dark:bg-black">
        <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      </div>
    </>
  )
}

export default GridBackground

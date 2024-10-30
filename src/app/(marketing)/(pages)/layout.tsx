type LayoutProps = {
  children?: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="dark:bg-grid-white/[0.1] bg-grid-black/[0.05] flex-1">
      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </main>
  )
}

export default Layout

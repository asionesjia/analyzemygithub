'use client'

import { api } from '~/trpc/react'
import { useState } from 'react'

type GithubProps = {}

const Github = ({}: GithubProps) => {
  const [enabled, setEnabled] = useState(false)
  const { data, refetch } = api.github.hello.useQuery({ username: 'Samueli924' }, { enabled })

  const handleClick = async () => {
    setEnabled(true)
    refetch()
  }
  console.log(data?.user)

  return (
    <div>
      <button onClick={handleClick}>Github</button>
    </div>
  )
}

export default Github

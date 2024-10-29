'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import { Home, LogOut } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'

type UserDropdownMenuProps = {}

const UserDropdownMenu = ({}: UserDropdownMenuProps) => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <div className={session ? 'pl-2' : ''}>
      {session ? (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-9 cursor-pointer">
              <AvatarImage
                alt={session.user?.name || ''}
                src={session.user?.image || undefined}
                className="size-9 h-9 w-9"
              />
              <AvatarFallback>
                {(session.user?.name || session.user?.name || 'User')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1">
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/" className="flex w-full items-center">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <button type="button" className="flex w-full" onClick={() => signOut()}>
              <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => signIn('github')} variant="ghost">
          Sign in with Github
        </Button>
      )}
    </div>
  )
}

export default UserDropdownMenu

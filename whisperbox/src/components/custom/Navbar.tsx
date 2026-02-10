'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from '../ui/button'
import { LogOut, MessageSquareText } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
        >
          <MessageSquareText className="h-5 w-5 text-pink-500" />
          Whisper<span className="text-pink-500">Box</span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden sm:block text-sm text-zinc-400">
                @{user?.username || user?.email}
              </span>

              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="flex items-center gap-2 rounded-full border border-white/10 text-zinc-300 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-full bg-pink-500 px-5 hover:bg-pink-600">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

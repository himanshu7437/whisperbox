'use client'

import MessageCard from '@/components/custom/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, Link as LinkIcon } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MessageInterface } from '@/types/MessageInterface'

const page = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((m) => m._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ??
          'Failed to fetch message settings'
      )
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      const result: MessageInterface[] = (response.data.messages || []).map(
        (msg) => ({
          _id: msg._id.toString(),
          content: msg.content,
          createdAt: msg.createdAt,
        })
      )
      setMessages(result)

      if (refresh) {
        toast('Refreshed', {
          description: 'Showing latest messages',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ?? 'Failed to fetch messages'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session?.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, fetchMessages, fetchAcceptMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      })
      setValue('acceptMessages', !acceptMessages)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ??
          'Failed to update message settings'
      )
    }
  }

  if (!session?.user) return null

  const { username } = session.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Link copied ✨')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Your Dashboard
          </h1>
          <p className="text-zinc-400">
            Share your link and receive anonymous messages 👀
          </p>
        </div>

        {/* PROFILE LINK */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 space-y-3">
          <p className="text-sm text-zinc-400">Your anonymous inbox link</p>

          <div className="flex gap-2">
            <input
              value={profileUrl}
              disabled
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm text-zinc-300"
            />
            <Button onClick={copyToClipboard} className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* SETTINGS */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <div>
            <p className="font-medium">Accept Messages</p>
            <p className="text-sm text-zinc-400">
              Turn off if you need a break
            </p>
          </div>

          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>

        <Separator className="bg-white/10" />

        {/* REFRESH */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Inbox</h2>

          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            className="gap-2 text-black"
          > 
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* MESSAGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-zinc-500 py-16">
              No messages yet 👀  
              <br />
              Share your link and check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page

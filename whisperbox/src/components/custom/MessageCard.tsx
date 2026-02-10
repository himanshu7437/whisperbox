'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { X, MessageCircle } from 'lucide-react'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { MessageInterface } from '@/types/MessageInterface'

type MessageCardProps = {
  message: MessageInterface
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    )
    toast.success(response.data.message)
    onMessageDelete(message._id)
  }

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:bg-zinc-900/90">
      {/* subtle gradient hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-pink-500/5 via-transparent to-transparent" />

      <CardHeader className="relative p-0 space-y-3">
        {/* top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-pink-400">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">
              Anonymous
            </span>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-zinc-900 border border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this message?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border border-white/20">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* message content */}
        <CardTitle className="text-base font-medium leading-relaxed text-zinc-100">
          {message.content}
        </CardTitle>

        <CardDescription className="text-xs text-zinc-500">
          Received anonymously
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default MessageCard

'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { MailCheck } from 'lucide-react'

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      })

      toast("Success", {
        description: response.data.message,
      })

      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Verification failed", {
        description: axiosError.response?.data.message,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/90 p-8 shadow-xl backdrop-blur">
        
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10 text-pink-500">
            <MailCheck />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Verify your account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            We sent a 6-digit code to your email for <span className="text-pink-400">@{params.username}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter code"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 text-center tracking-widest"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              Verify & Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount

'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Loader2, Sparkles } from "lucide-react"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"

const Page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 400)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) return

      setIsCheckingUsername(true)
      setUsernameMessage('')

      try {
        const res = await axios.get(
          `/api/check-username-unique?username=${username}`
        )
        setUsernameMessage(res.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Username check failed'
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsername()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const res = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success(res.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ?? 'Signup failed'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black text-white overflow-hidden">

      {/* 🔮 BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-pink-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-fuchsia-500/10 blur-[140px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/4 h-[320px] w-[320px] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      {/* LEFT – BRAND */}
      <div className="relative hidden lg:flex flex-col justify-center px-16">
        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1 text-sm text-pink-400">
            <Sparkles className="h-4 w-4" />
            Mystery Message
          </div>

          <h1 className="text-4xl font-extrabold leading-tight">
            Create your<br />
            <span className="text-pink-500">anonymous inbox</span>
          </h1>

          <p className="text-zinc-400">
            Share your link.  
            Receive honest messages.  
            Stay anonymous.
          </p>
        </div>
      </div>

      {/* RIGHT – FORM */}
      <div className="relative flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">

          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-3xl font-bold">Create account</h2>
            <p className="text-sm text-zinc-400">
              Get your anonymous message link
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="cool_username"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormDescription
                      className={`text-xs ${
                        usernameMessage.includes('available')
                          ? 'text-green-500'
                          : 'text-zinc-400'
                      }`}
                    >
                      {isCheckingUsername
                        ? 'Checking username…'
                        : usernameMessage}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="you@example.com"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || isCheckingUsername}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-pink-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page

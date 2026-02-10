'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    if (result?.error) {
      toast("Sign in failed", { description: result.error })
    } else {
      toast("Welcome back 👋")
      if (result?.url) router.replace("/dashboard")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black text-white overflow-hidden">

      {/* 🔮 BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-pink-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-fuchsia-500/10 blur-[140px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/4 h-[320px] w-[320px] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      {/* LEFT – BRAND / VIBE */}
      <div className="relative hidden lg:flex flex-col justify-center px-16">
        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1 text-sm text-pink-400">
            <Sparkles className="h-4 w-4" />
            Mystery Message
          </div>

          <h1 className="text-4xl font-extrabold leading-tight">
            Receive honest<br />
            <span className="text-pink-500">anonymous messages</span>
          </h1>

          <p className="text-zinc-400">
            No names. No pressure.  
            Just real thoughts from real people.
          </p>
        </div>
      </div>

      {/* RIGHT – FORM */}
      <div className="relative flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">

          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-sm text-zinc-400">
              Sign in to your anonymous inbox
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            New here?{" "}
            <Link
              href="/sign-up"
              className="text-pink-500 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page

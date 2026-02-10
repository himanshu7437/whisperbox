'use client'

import { Mail, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Autoplay from 'embla-carousel-autoplay'
import messages from '../../message.json'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
      {/* HERO */}
      <main className="flex-1 flex items-center px-4 sm:px-6 lg:px-12 py-20">
        <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          {/* LEFT CONTENT */}
          <section className="relative text-center lg:text-left space-y-7">
            {/* subtle glow */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl hidden lg:block" />

            <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1 text-sm text-pink-400">
              <Sparkles className="h-4 w-4" />
              Anonymous • Honest • Fun
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight">
              Receive <span className="text-pink-500">anonymous</span>
              <br />
              messages from anyone
            </h1>

            <p className="text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Let people tell you what they really think — without names,
              without pressure. Just honest vibes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href="/sign-up"
                className="rounded-xl bg-pink-500 px-7 py-3 text-white font-medium hover:bg-pink-600 active:scale-95 transition"
              >
                Get started
              </a>

              <a
                href="/sign-in"
                className="rounded-xl border border-white/20 px-7 py-3 hover:bg-white/5 active:scale-95 transition"
              >
                I already have an account
              </a>
            </div>
          </section>

          {/* RIGHT CAROUSEL */}
          <section className="w-full">
            <Carousel
              plugins={[Autoplay({ delay: 2600 })]}
              className="relative"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="px-2">
                    <Card className="bg-zinc-900/80 border border-white/10 rounded-2xl shadow-xl transition hover:scale-[1.02]">
                      <CardHeader>
                        <CardTitle className="text-white text-base md:text-lg">
                          {message.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex gap-3">
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
                          <Mail className="h-4 w-4" />
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-zinc-200 leading-relaxed">
                            {message.content}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* hide arrows on mobile */}
              <CarouselPrevious className="-left-6 hidden md:flex" />
              <CarouselNext className="-right-6 hidden md:flex" />
            </Carousel>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Mystery Message · Built for Gen-Z
      </footer>
    </div>
  )
}

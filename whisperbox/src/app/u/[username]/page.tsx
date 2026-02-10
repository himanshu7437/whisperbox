"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { messageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
  const params = useParams();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });
      toast.success("Message sent anonymously 💌");
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error sending message", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestion = async () => {
    try {
      setIsGettingSuggestion(true);
      const response = await axios.get("/api/suggest-messages");

      const result: string = response.data.result;
      setSuggestions(
        result
          .split("||")
          .map((s) => s.trim())
          .filter(Boolean)
      );

      toast.success("Suggestions ready ✨");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error fetching suggestions", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsGettingSuggestion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1 text-sm text-pink-400">
            <Sparkles className="h-4 w-4" />
            Anonymous message
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Send a message to{" "}
            <span className="text-pink-500">@{username}</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            Your identity stays hidden. Be honest, be kind.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-xl backdrop-blur">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">
                      Your message
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write something anonymous…"
                        {...field}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send anonymously"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSuggestion}
                  disabled={isGettingSuggestion}
                  className="flex-1 text-black border-white/20 hover:bg-white/5 hover:text-white"
                >
                  {isGettingSuggestion ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    "Get suggestions"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 text-center">
              Tap a suggestion to auto-fill 👇
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() =>
                    form.setValue("content", suggestion, {
                      shouldValidate: true,
                    })
                  }
                  className="cursor-pointer rounded-xl border border-white/10 bg-zinc-900/80 p-4 text-sm text-zinc-200 transition hover:border-pink-500/40 hover:bg-zinc-900"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

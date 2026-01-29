'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/router"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {
  const [username, setUsername] = useState(' ');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceUsername = useDebounceValue(username, 300);
  const router = useRouter();


  // zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async() => {
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`);
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username")
      } finally {
        setIsCheckingUsername(false);
      }
    }
    checkUsernameUnique();
  }, [debounceUsername])

  const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast(
        "success",{
          description: response.data.message
        }
      )
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast(
        "Signup failed",{
          description: errorMessage,
        }
      )
      setIsSubmitting(false);
    }
  }


  return (
    <div>page</div>
  )
}

export default page
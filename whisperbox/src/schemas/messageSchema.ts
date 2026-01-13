import z from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {message: 'Content must be atleast 10 charcters'})
    .max(300, {message: 'Content must not be longer than 300 charcters'})
})
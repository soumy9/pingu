import { z } from "zod";


// verify am object containing a property email which is a string and and an email
export const addFriendValidator = z.object({ email: z.string().email() });


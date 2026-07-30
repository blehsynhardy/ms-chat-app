import { z } from "@chatapp/common";

export const registerScehma = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
    displayName: z.string().min(3).max(30),
  }),
});

export const loginScehma = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const refreshScehma = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const revokeScehma = z.object({
  body: z.object({
    userId: z.uuid(),
  }),
});

"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isRateLimited, recordAttempt, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";

export type LoginState = {
  error?: string;
};

const MAX_ATTEMPTS = 8;
const WINDOW_MINUTES = 15;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const key = `login:${email}`;

  if (email && (await isRateLimited(key, { maxAttempts: MAX_ATTEMPTS, windowMinutes: WINDOW_MINUTES }))) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (email) await recordAttempt(key);
      return { error: "E-mail ou senha inválidos" };
    }
    throw error;
  }
}

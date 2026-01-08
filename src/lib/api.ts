// src/lib/api.ts
import { supabase } from "./supabase";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(session?.access_token);

  return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session?.access_token}`,
      "Content-Type": "application/json",
    },
  });
}

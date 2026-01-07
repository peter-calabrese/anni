// src/routes/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.session) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/Login" });
  },
});

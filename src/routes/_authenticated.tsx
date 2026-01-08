// src/routes/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
 
    const now = new Date();
    const exp = new Date(context.auth.session?.expires_at * 1000);

    console.log(exp);
    if (exp < now) {
      context.auth.signOut();
    }

    if (!context.auth.session) {
      throw redirect({
        to: "/Login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});

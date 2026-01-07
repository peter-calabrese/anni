// src/routes/login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export const Route = createFileRoute("/Login/")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      navigate({ to: "/timeline" });
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

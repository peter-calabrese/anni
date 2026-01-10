// src/routes/login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import styles from './login.module.css'
import { useAuth } from "../../contexts/AuthContext";
export const Route = createFileRoute("/Login/")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { session } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (session) {
      navigate({ to: "/timeline" });
    }
  }, [session, navigate]);

  return (
    <div className={styles.wrapper}>
      <h2>Sign In</h2>
      <form className={styles.container} onSubmit={handleLogin}>
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

"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal masuk.");
      window.location.href = "/admin";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk.");
      setBusy(false);
    }
  }

  return (
    <form className="adm-login-form" onSubmit={submit}>
      <label className="adm-field">
        <span>Kata sandi admin</span>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
      </label>
      {error && <p className="adm-msg adm-msg-error" role="alert">{error}</p>}
      <button className="adm-primary" type="submit" disabled={busy}>{busy ? "Memeriksa…" : "Masuk dashboard"}</button>
    </form>
  );
}

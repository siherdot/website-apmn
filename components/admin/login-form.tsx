"use client";

import { useState } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";

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
    <form className="admin-form-stack" onSubmit={submit}>
      <TextInput
        label="Kata sandi admin"
        type="password"
        value={password}
        onChange={(value) => setPassword(value)}
        isRequired
        hasAutoFocus
      />
      {error && <Banner status="error" title={error} container="card" />}
      <Button
        label="Masuk dashboard"
        type="submit"
        variant="primary"
        isLoading={busy}
        isDisabled={busy}
      />
    </form>
  );
}

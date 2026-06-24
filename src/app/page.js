"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./lib/firebase";

const COLORS = {
  bg: "#F9F7F4",
  card: "#FFFFFF",
  gold: "#C9A84C",
  goldLight: "#F0E6C8",
  text: "#1A1A1A",
  muted: "#6B6B6B",
  border: "#E8E4DC",
  error: "#C0392B",
};

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState("personal");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cref, setCref] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin() {
    setErro("");
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/dashboard");
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setErro("E-mail ou senha incorretos.");
      } else {
        setErro("Erro ao entrar. Tente novamente.");
      }
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>

      {/* Logo símbolo */}
      <div style={{ marginBottom: 16 }}>
        <Image
          src="/logo-simbolo.png"
          alt="Vetta"
          width={100}
          height={100}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Wordmark */}
      <div style={{ marginBottom: 40 }}>
        <Image
          src="/logo-texto.png"
          alt="Vetta Performance"
          width={220}
          height={60}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 380,
        background: COLORS.card,
        borderRadius: 16,
        padding: 28,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      }}>

        {/* Toggle */}
        <div style={{
          display: "flex",
          background: COLORS.bg,
          borderRadius: 10,
          padding: 3,
          marginBottom: 24,
        }}>
          {["personal", "aluno"].map((m) => (
            <button key={m} onClick={() => { setModo(m); setErro(""); }} style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 8,
              border: "none",
              background: modo === m ? COLORS.card : "transparent",
              color: modo === m ? COLORS.text : COLORS.muted,
              fontSize: 13,
              fontWeight: modo === m ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: modo === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              {m === "personal" ? "Personal Trainer" : "Aluno"}
            </button>
          ))}
        </div>

        {/* E-mail */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            fontSize: 10, letterSpacing: 1.5, color: COLORS.muted,
            textTransform: "uppercase", display: "block", marginBottom: 6,
          }}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{
              width: "100%", padding: "11px 14px",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10, fontSize: 14, color: COLORS.text,
              background: COLORS.bg, outline: "none", boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.gold}
            onBlur={(e) => e.target.style.borderColor = COLORS.border}
          />
        </div>

        {/* Senha */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            fontSize: 10, letterSpacing: 1.5, color: COLORS.muted,
            textTransform: "uppercase", display: "block", marginBottom: 6,
          }}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            style={{
              width: "100%", padding: "11px 14px",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10, fontSize: 14, color: COLORS.text,
              background: COLORS.bg, outline: "none", boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.gold}
            onBlur={(e) => e.target.style.borderColor = COLORS.border}
          />
        </div>

        {/* CREF — só personal */}
        {modo === "personal" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontSize: 10, letterSpacing: 1.5, color: COLORS.muted,
              textTransform: "uppercase", display: "block", marginBottom: 6,
            }}>Registro CREF</label>
            <input
              type="text"
              value={cref}
              onChange={(e) => setCref(e.target.value)}
              placeholder="000000-G/SP"
              style={{
                width: "100%", padding: "11px 14px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10, fontSize: 14, color: COLORS.text,
                background: COLORS.bg, outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.gold}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div style={{
            background: "#fde8e8", border: "1px solid #f5c6c6",
            borderRadius: 8, padding: "10px 14px",
            fontSize: 13, color: COLORS.error, marginBottom: 14,
          }}>
            {erro}
          </div>
        )}

        {/* Botão */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "13px 0",
            background: loading ? COLORS.goldLight : COLORS.gold,
            border: "none", borderRadius: 10, color: "#fff",
            fontSize: 14, fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            letterSpacing: 0.5, marginTop: 8,
            transition: "background 0.2s",
          }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {/* Rodapé card */}
        <div style={{ textAlign: "center", marginTop: 18 }}>
          {modo === "personal" ? (
            <span style={{ fontSize: 12, color: COLORS.muted }}>
              Ainda não tem conta?{" "}
              <span onClick={() => router.push("/cadastro")}
                style={{ color: COLORS.gold, cursor: "pointer", fontWeight: 500 }}>
                Cadastrar
              </span>
            </span>
          ) : (
            <span style={{ fontSize: 12, color: COLORS.muted }}>
              Acesse com o link enviado pelo seu personal
            </span>
          )}
        </div>
      </div>

      {/* Rodapé página */}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 2, marginBottom: 6 }}>
          VETTA · Performance Intelligence
        </div>
        <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 0.5, marginBottom: 6 }}>
          Plataforma exclusiva para profissionais certificados
        </div>
        <div style={{ fontSize: 10, color: COLORS.border, letterSpacing: 0.5 }}>
          © 2026 Vetta · Todos os direitos reservados
        </div>
      </div>

    </div>
  );
}
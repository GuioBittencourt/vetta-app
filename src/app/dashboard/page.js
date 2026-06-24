"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import Image from "next/image";

const COLORS = {
  bg: "#F9F7F4",
  card: "#FFFFFF",
  gold: "#C9A84C",
  goldLight: "#F0E6C8",
  text: "#1A1A1A",
  muted: "#6B6B6B",
  border: "#E8E4DC",
  success: "#4A7C59",
};

function Avatar({ nome, size = 40 }) {
  const iniciais = nome ? nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: COLORS.goldLight, border: `1.5px solid ${COLORS.gold}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 700, color: COLORS.gold,
      flexShrink: 0, fontFamily: "Georgia, serif",
    }}>
      {iniciais}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: "14px 12px", textAlign: "center",
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "Georgia, serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: COLORS.success, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: `linear-gradient(to right, ${COLORS.gold}40, ${COLORS.gold}, ${COLORS.gold}40)`, margin: "20px 0" }} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/"); return; }
      try {
        const snap = await getDoc(doc(db, "usuarios", user.uid));
        if (snap.exists()) setUsuario({ uid: user.uid, ...snap.data() });

        const q = query(collection(db, "alunos"), where("personalId", "==", user.uid));
        const alunosSnap = await getDocs(q);
        setAlunos(alunosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Image src="/logo-simbolo.png" alt="Vetta" width={60} height={60} style={{ objectFit: "contain", opacity: 0.5 }} priority />
          <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 2, marginTop: 12 }}>CARREGANDO</div>
        </div>
      </div>
    );
  }

  const primeiroNome = usuario?.nome?.split(" ")[0] || "";
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "16px 20px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Saudação — esquerda */}
        <div>
          <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 0.5, textTransform: "capitalize", marginBottom: 2 }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div style={{ fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 400, color: COLORS.text }}>
            {saudacao}, {primeiroNome || "..."}.
          </div>
        </div>

        {/* Logo completo — centro */}
        <Image
  src="/logo-texto.png"
  alt="Vetta"
  width={110}
  height={32}
  style={{ objectFit: "contain" }}
/>

        {/* Ações — direita */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <Avatar nome={usuario?.nome} size={34} />
          <button onClick={handleLogout} style={{
            background: "none",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8, padding: "5px 10px", fontSize: 11,
            color: COLORS.text, cursor: "pointer",
          }}>Sair</button>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 100px" }}>

        <Divider />

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <StatCard label="Alunos ativos" value={alunos.length} />
          <StatCard label="Plano atual" value={usuario?.plano === "starter" ? "Starter" : usuario?.plano || "—"} />
          <StatCard label="Sessões" value="—" sub="em breve" />
        </div>

        {/* Coach IA */}
        <button onClick={() => router.push("/coach")} style={{
          width: "100%", padding: "16px 20px", background: COLORS.text,
          border: "none", borderRadius: 12, color: "#fff",
          display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer", marginBottom: 12, textAlign: "left",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: COLORS.gold,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 16 }}>✦</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Coach IA</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              Discuta programação, periodização e estratégia
            </div>
          </div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,0.3)" }}>›</div>
        </button>

        {/* Meu Treino — personal como aluno */}
        <button onClick={() => router.push("/meu-treino")} style={{
          width: "100%", padding: "14px 20px", background: COLORS.card,
          border: `1px solid ${COLORS.border}`, borderRadius: 12, color: COLORS.text,
          display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer", marginBottom: 24, textAlign: "left",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: COLORS.goldLight,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 16 }}>◎</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Meu Treino</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
              Sua experiência como atleta
            </div>
          </div>
          <div style={{ fontSize: 20, color: COLORS.border }}>›</div>
        </button>

        {/* Alunos */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase" }}>
            Seus Alunos
          </div>
          <button onClick={() => router.push("/alunos/novo")} style={{
            fontSize: 11, color: COLORS.gold, background: "none",
            border: `1px solid ${COLORS.gold}`, borderRadius: 20,
            padding: "4px 14px", cursor: "pointer",
          }}>
            + Adicionar
          </button>
        </div>

        {alunos.length === 0 ? (
          <div style={{
            background: COLORS.card, border: `1px dashed ${COLORS.border}`,
            borderRadius: 14, padding: "32px 20px", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
            <div style={{ fontSize: 14, color: COLORS.text, fontFamily: "Georgia, serif", marginBottom: 6 }}>
              Nenhum aluno ainda
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20 }}>
              Adicione seu primeiro aluno e envie o link de convite.
            </div>
            <button onClick={() => router.push("/alunos/novo")} style={{
              padding: "10px 24px", background: COLORS.gold,
              border: "none", borderRadius: 10, color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              Adicionar primeiro aluno
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alunos.map((aluno) => (
              <div key={aluno.id}
                onClick={() => router.push(`/alunos/${aluno.id}`)}
                style={{
                  background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  borderRadius: 14, padding: 16, cursor: "pointer",
                  display: "flex", gap: 14, alignItems: "center",
                }}>
                <Avatar nome={aluno.nome} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{aluno.nome}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{aluno.objetivo || "Objetivo não definido"}</div>
                </div>
                <div style={{ fontSize: 20, color: COLORS.border }}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: COLORS.card, borderTop: `1px solid ${COLORS.border}`,
        display: "flex", padding: "10px 0 18px",
      }}>
        {[
          { label: "Alunos", icon: "◫", path: "/dashboard" },
          { label: "Meu Treino", icon: "◎", path: "/meu-treino" },
          { label: "Coach IA", icon: "✦", path: "/coach" },
          { label: "Perfil", icon: "○", path: "/perfil" },
        ].map((item) => (
          <button key={item.label} onClick={() => router.push(item.path)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <span style={{ fontSize: 16, color: item.path === "/dashboard" ? COLORS.gold : COLORS.muted }}>
              {item.icon}
            </span>
            <span style={{ fontSize: 10, color: item.path === "/dashboard" ? COLORS.gold : COLORS.muted, fontWeight: item.path === "/dashboard" ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
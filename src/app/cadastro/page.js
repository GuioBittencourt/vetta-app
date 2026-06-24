"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

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

function Campo({ label, value, onChange, type = "text", placeholder, erro, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 10, letterSpacing: 1.5,
        color: erro ? COLORS.error : COLORS.muted,
        textTransform: "uppercase", display: "block", marginBottom: 6,
      }}>{label}</label>
      {children ? children : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "11px 14px",
            border: `1px solid ${erro ? COLORS.error : focused ? COLORS.gold : COLORS.border}`,
            borderRadius: 10, fontSize: 14, color: COLORS.text,
            background: COLORS.bg, outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
      )}
      {erro && <div style={{ fontSize: 11, color: COLORS.error, marginTop: 4 }}>{erro}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, erro }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 10, letterSpacing: 1.5,
        color: erro ? COLORS.error : COLORS.muted,
        textTransform: "uppercase", display: "block", marginBottom: 6,
      }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "11px 14px",
          border: `1px solid ${erro ? COLORS.error : focused ? COLORS.gold : COLORS.border}`,
          borderRadius: 10, fontSize: 14, color: value ? COLORS.text : COLORS.muted,
          background: COLORS.bg, outline: "none", boxSizing: "border-box",
          cursor: "pointer", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        <option value="">Selecione...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {erro && <div style={{ fontSize: 11, color: COLORS.error, marginTop: 4 }}>{erro}</div>}
    </div>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        cursor: "pointer", marginBottom: 12,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
        border: `1.5px solid ${checked ? COLORS.gold : COLORS.border}`,
        background: checked ? COLORS.gold : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
].map((e) => ({ value: e, label: e }));

const COMO_CONHECEU = [
  { value: "instagram", label: "Instagram" },
  { value: "indicacao", label: "Indicação de colega" },
  { value: "google", label: "Google" },
  { value: "evento", label: "Evento / Congresso" },
  { value: "outro", label: "Outro" },
];

const QTDE_ALUNOS = [
  { value: "1-5", label: "1 a 5 alunos" },
  { value: "6-10", label: "6 a 10 alunos" },
  { value: "11-20", label: "11 a 20 alunos" },
  { value: "21-30", label: "21 a 30 alunos" },
  { value: "30+", label: "Mais de 30 alunos" },
];

const TIPO_ATENDIMENTO = [
  { value: "academia", label: "Academia" },
  { value: "studio", label: "Studio próprio" },
  { value: "domicilio", label: "A domicílio" },
  { value: "ar_livre", label: "Ao ar livre" },
  { value: "misto", label: "Misto" },
];

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cref, setCref] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState("");
  const [nomeAcademia, setNomeAcademia] = useState("");
  const [comoConheceu, setComoConheceu] = useState("");
  const [qtdeAlunos, setQtdeAlunos] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitaPrivacidade, setAceitaPrivacidade] = useState(false);
  const [aceitaDados, setAceitaDados] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [etapa, setEtapa] = useState(1);

  function validarEtapa1() {
    const e = {};
    if (!nome.trim()) e.nome = "Nome obrigatório";
    if (!email.trim()) e.email = "E-mail obrigatório";
    if (!whatsapp.trim()) e.whatsapp = "WhatsApp obrigatório";
    if (!cref.trim()) e.cref = "CREF obrigatório";
    return e;
  }

  function validarEtapa2() {
    const e = {};
    if (!cidade.trim()) e.cidade = "Cidade obrigatória";
    if (!estado) e.estado = "Estado obrigatório";
    if (!tipoAtendimento) e.tipoAtendimento = "Selecione onde atende";
    if (!comoConheceu) e.comoConheceu = "Campo obrigatório";
    if (!qtdeAlunos) e.qtdeAlunos = "Campo obrigatório";
    return e;
  }

  function validarEtapa3() {
    const e = {};
    if (senha.length < 6) e.senha = "Mínimo 6 caracteres";
    if (senha !== confirmarSenha) e.confirmarSenha = "Senhas não conferem";
    if (!aceitaPrivacidade) e.privacidade = "Aceite obrigatório";
    if (!aceitaDados) e.dados = "Aceite obrigatório";
    return e;
  }

  function avancarEtapa() {
    let e = {};
    if (etapa === 1) e = validarEtapa1();
    if (etapa === 2) e = validarEtapa2();
    if (Object.keys(e).length > 0) { setErros(e); return; }
    setErros({});
    setEtapa(etapa + 1);
  }

  async function handleCadastro() {
    const e = validarEtapa3();
    if (Object.keys(e).length > 0) { setErros(e); return; }
    setErros({});
    setLoading(true);
    setErroGeral("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nome,
        email,
        whatsapp,
        cref,
        cidade,
        estado,
        tipoAtendimento,
        nomeAcademia: tipoAtendimento === "academia" ? nomeAcademia : null,
        comoConheceu,
        qtdeAlunos,
        tipo: "personal",
        admin: false,
        plano: "starter",
        criadoEm: new Date().toISOString(),
        lgpd: {
          aceitaPrivacidade: true,
          aceitaDados: true,
          dataAceite: new Date().toISOString(),
        },
      });
      router.push("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErroGeral("Este e-mail já está cadastrado.");
      } else {
        setErroGeral("Erro ao criar conta. Tente novamente.");
      }
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 10 }}>
        <Image src="/logo-simbolo.png" alt="Vetta" width={68} height={68}
          style={{ objectFit: "contain" }} priority />
      </div>
      <div style={{ marginBottom: 28 }}>
        <Image src="/logo-texto.png" alt="Vetta Performance" width={160} height={44}
          style={{ objectFit: "contain" }} priority />
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: COLORS.card, borderRadius: 16, padding: 28,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.gold, textTransform: "uppercase", marginBottom: 4 }}>
            Personal Trainer · Etapa {etapa} de 3
          </div>
          <div style={{ fontSize: 20, fontFamily: "Georgia, serif", fontWeight: 400, color: COLORS.text }}>
            {etapa === 1 && "Dados pessoais"}
            {etapa === 2 && "Informações profissionais"}
            {etapa === 3 && "Acesso e termos"}
          </div>
          {/* Barra de progresso */}
          <div style={{ height: 2, background: COLORS.border, borderRadius: 2, marginTop: 12 }}>
            <div style={{
              height: "100%", borderRadius: 2, background: COLORS.gold,
              width: `${(etapa / 3) * 100}%`, transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        {/* ETAPA 1 */}
        {etapa === 1 && (
          <>
            <Campo label="Nome completo" value={nome} onChange={setNome} placeholder="Seu nome completo" erro={erros.nome} />
            <Campo label="E-mail" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" erro={erros.email} />
            <Campo label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="(11) 99999-9999" erro={erros.whatsapp} />
            <Campo label="Registro CREF" value={cref} onChange={setCref} placeholder="000000-G/SP" erro={erros.cref} />
          </>
        )}

        {/* ETAPA 2 */}
        {etapa === 2 && (
          <>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 2 }}>
                <Campo label="Cidade" value={cidade} onChange={setCidade} placeholder="Sua cidade" erro={erros.cidade} />
              </div>
              <div style={{ flex: 1 }}>
                <Select label="Estado" value={estado} onChange={setEstado} options={ESTADOS} erro={erros.estado} />
              </div>
            </div>
            <Select label="Onde você atende" value={tipoAtendimento} onChange={(v) => { setTipoAtendimento(v); setNomeAcademia(""); }} options={TIPO_ATENDIMENTO} erro={erros.tipoAtendimento} />
            {tipoAtendimento === "academia" && (
              <Campo label="Nome da academia" value={nomeAcademia} onChange={setNomeAcademia} placeholder="Ex: SmartFit Paulista" />
            )}
            <Select label="Quantos alunos você tem hoje" value={qtdeAlunos} onChange={setQtdeAlunos} options={QTDE_ALUNOS} erro={erros.qtdeAlunos} />
            <Select label="Como conheceu o Vetta" value={comoConheceu} onChange={setComoConheceu} options={COMO_CONHECEU} erro={erros.comoConheceu} />
          </>
        )}

        {/* ETAPA 3 */}
        {etapa === 3 && (
          <>
            <Campo label="Senha" value={senha} onChange={setSenha} type="password" placeholder="Mínimo 6 caracteres" erro={erros.senha} />
            <Campo label="Confirmar senha" value={confirmarSenha} onChange={setConfirmarSenha} type="password" placeholder="Repita a senha" erro={erros.confirmarSenha} />

            <div style={{ height: 1, background: COLORS.border, margin: "16px 0" }} />

            <div style={{ fontSize: 11, letterSpacing: 1, color: COLORS.muted, textTransform: "uppercase", marginBottom: 12 }}>
              Termos e privacidade
            </div>

            <Checkbox checked={aceitaPrivacidade} onChange={setAceitaPrivacidade}>
              Li e aceito a{" "}
              <span style={{ color: COLORS.gold, textDecoration: "underline", cursor: "pointer" }}>
                Política de Privacidade
              </span>{" "}
              do Vetta, em conformidade com a LGPD (Lei 13.709/2018).
            </Checkbox>
            {erros.privacidade && <div style={{ fontSize: 11, color: COLORS.error, marginBottom: 8, marginTop: -8 }}>{erros.privacidade}</div>}

            <Checkbox checked={aceitaDados} onChange={setAceitaDados}>
              Autorizo o uso dos meus dados profissionais para melhoria da plataforma Vetta, conforme descrito na Política de Privacidade.
            </Checkbox>
            {erros.dados && <div style={{ fontSize: 11, color: COLORS.error, marginBottom: 8, marginTop: -8 }}>{erros.dados}</div>}

            {erroGeral && (
              <div style={{
                background: "#fde8e8", border: "1px solid #f5c6c6",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: COLORS.error, marginBottom: 14,
              }}>
                {erroGeral}
              </div>
            )}
          </>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {etapa > 1 && (
            <button onClick={() => setEtapa(etapa - 1)} style={{
              flex: 1, padding: "13px 0", background: "none",
              border: `1px solid ${COLORS.border}`, borderRadius: 10,
              color: COLORS.muted, fontSize: 14, cursor: "pointer",
            }}>
              Voltar
            </button>
          )}
          <button
            onClick={etapa < 3 ? avancarEtapa : handleCadastro}
            disabled={loading}
            style={{
              flex: 2, padding: "13px 0",
              background: loading ? COLORS.goldLight : COLORS.gold,
              border: "none", borderRadius: 10, color: "#fff",
              fontSize: 14, fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              letterSpacing: 0.5, transition: "background 0.2s",
            }}>
            {loading ? "Criando conta..." : etapa < 3 ? "Continuar" : "Criar conta"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span style={{ fontSize: 12, color: COLORS.muted }}>
            Já tem conta?{" "}
            <span onClick={() => router.push("/")}
              style={{ color: COLORS.gold, cursor: "pointer", fontWeight: 500 }}>
              Entrar
            </span>
          </span>
        </div>
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>
          © 2026 Vetta · Todos os direitos reservados
        </div>
      </div>
    </div>
  );
}
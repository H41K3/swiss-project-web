import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logoImg from "../assets/logo.jpeg";

const AppLogo = ({ size = 45 }: { size?: number }) => (
  <div style={{ backgroundColor: "#fff", borderRadius: "12px", width: `${size}px`, height: `${size}px`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
    <img src={logoImg} alt="Logo GlobalWallet" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.3)" }} />
  </div>
);

// Ícones SVG inline para evitar picos de layout
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeSlashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
);

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Estados para o olhinho
  const [isPermanentlyShown, setIsPermanentlyShown] = useState(false); // Toggle
  const [isTemporarilyShown, setIsTemporarilyShown] = useState(false); // Segurar

  // Determina se a senha está visível (combina os dois comportamentos)
  const isPasswordVisible = isPermanentlyShown || isTemporarilyShown;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("https://swiss-project-api.onrender.com/api/v1/auth/login", {
        login: username, 
        password: password
      });
      const token = response.data.token || response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", username);
        navigate("/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: "#f9fafb", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "1rem", boxSizing: "border-box" }}>
      <div style={{ backgroundColor: "#fff", padding: "3rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", width: "100%", maxWidth: "400px", textAlign: "center", boxSizing: "border-box" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "2.5rem" }}>
          <AppLogo />
          <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#111", letterSpacing: "0.5px" }}>GlobalWallet</h1>
        </div>

        {error && (
          <div style={{ backgroundColor: "#ffebee", color: "#EC0000", padding: "12px", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: "600" }}>{error}</div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nome de usuário</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #eaeaea", backgroundColor: "#fafafa", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" }} />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Senha</label>
            {/* Container Relativo para alinhar o olho */}
            <div style={{ position: "relative", width: "100%" }}>
              <input 
                type={isPasswordVisible ? "text" : "password"} // Tipo Dinâmico
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ 
                  width: "100%", 
                  padding: "12px 42px 12px 16px", // padding-right maior para o olho
                  borderRadius: "12px", 
                  border: "1px solid #eaeaea", 
                  backgroundColor: "#fafafa", 
                  outline: "none", 
                  fontSize: "0.95rem", 
                  boxSizing: "border-box" 
                }} 
              />
              {/* Botão do Olho com Lógica Combinada (Clique + Segurar) */}
              <button
                type="button" // Essencial para não submeter o formulário
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
                //Comportamento 1: Clique Rápido (Toggle)
                onClick={() => setIsPermanentlyShown(prev => !prev)}
                //Comportamento 2: Segurar (Hold-to-Reveal)
                onMouseDown={() => setIsTemporarilyShown(true)}
                onMouseUp={() => setIsTemporarilyShown(false)}
                onMouseLeave={() => setIsTemporarilyShown(false)} // Garante que oculta se arrastar o mouse para fora
                //Suporte Mobile para Segurar
                onTouchStart={() => setIsTemporarilyShown(true)}
                onTouchEnd={() => setIsTemporarilyShown(false)}
              >
                {isPermanentlyShown ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </div>
          </div>

          <button type="submit" style={{ marginTop: "1.5rem", padding: "14px 20px", backgroundColor: "#EC0000", color: "white", border: "none", borderRadius: "15px", fontWeight: "700", cursor: "pointer", fontSize: "1.0rem", width: "100%", boxShadow: "0 5px 15px rgba(236,0,0,0.25)" }}>Entrar</button>
        </form>

        <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666", margin: "2rem 0 0 0" }}>Não tem uma conta? <Link to="/register" style={{ color: "#EC0000", fontWeight: "600", textDecoration: "underline" }}>Cadastre-se</Link></p>
      </div>
    </div>
  );
}
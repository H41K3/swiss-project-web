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

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Novo estado
  const [error, setError] = useState<string | null>(null);

  // Estados para o olhinho da Nova Senha
  const [isPermanentlyShown, setIsPermanentlyShown] = useState(false);
  const [isTemporarilyShown, setIsTemporarilyShown] = useState(false);
  const isPasswordVisible = isPermanentlyShown || isTemporarilyShown;

  // Estados para o olhinho de Confirmar Senha
  const [isConfirmPermanentlyShown, setIsConfirmPermanentlyShown] = useState(false);
  const [isConfirmTemporarilyShown, setIsConfirmTemporarilyShown] = useState(false);
  const isConfirmPasswordVisible = isConfirmPermanentlyShown || isConfirmTemporarilyShown;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação local antes de chamar a API
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("https://swiss-project-api.onrender.com/api/v1/auth/register", {
        login: username,
        password: password
      });
      alert("Conta criada com sucesso!");
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError("Erro ao criar conta. Escolha outro nome de usuário.");
    }
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: "#f9fafb", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "1rem", boxSizing: "border-box" }}>
      <div style={{ backgroundColor: "#fff", padding: "3rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", width: "100%", maxWidth: "400px", textAlign: "center", boxSizing: "border-box", transition: "height 0.3s ease" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "2.5rem" }}>
          <AppLogo />
          <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#111", letterSpacing: "0.5px" }}>GlobalWallet</h1>
        </div>

        {error && (
          <div style={{ backgroundColor: "#ffebee", color: "#EC0000", padding: "12px", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: "600" }}>{error}</div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Novo Nome de usuário</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #eaeaea", backgroundColor: "#fafafa", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" }} />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Nova Senha</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input 
                type={isPasswordVisible ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: "100%", padding: "12px 42px 12px 16px", borderRadius: "12px", border: "1px solid #eaeaea", backgroundColor: "#fafafa", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" }} 
              />
              <button
                type="button" 
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => setIsPermanentlyShown(prev => !prev)}
                onMouseDown={() => setIsTemporarilyShown(true)}
                onMouseUp={() => setIsTemporarilyShown(false)}
                onMouseLeave={() => setIsTemporarilyShown(false)} 
                onTouchStart={() => setIsTemporarilyShown(true)}
                onTouchEnd={() => setIsTemporarilyShown(false)}
              >
                {isPermanentlyShown ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Senha - Só aparece se a senha principal tiver sido digitada */}
          {password.length > 0 && (
            <div style={{ textAlign: "left", animation: "fadeIn 0.3s ease-in-out" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Confirmar Senha</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input 
                  type={isConfirmPasswordVisible ? "text" : "password"} 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  style={{ width: "100%", padding: "12px 42px 12px 16px", borderRadius: "12px", border: "1px solid #eaeaea", backgroundColor: "#fafafa", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" }} 
                />
                <button
                  type="button" 
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => setIsConfirmPermanentlyShown(prev => !prev)}
                  onMouseDown={() => setIsConfirmTemporarilyShown(true)}
                  onMouseUp={() => setIsConfirmTemporarilyShown(false)}
                  onMouseLeave={() => setIsConfirmTemporarilyShown(false)} 
                  onTouchStart={() => setIsConfirmTemporarilyShown(true)}
                  onTouchEnd={() => setIsConfirmTemporarilyShown(false)}
                >
                  {isConfirmPermanentlyShown ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" style={{ marginTop: "1.5rem", padding: "14px 20px", backgroundColor: "#EC0000", color: "white", border: "none", borderRadius: "15px", fontWeight: "700", cursor: "pointer", fontSize: "1.0rem", width: "100%", boxShadow: "0 5px 15px rgba(236,0,0,0.25)" }}>Criar Conta</button>
        </form>

        <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666", margin: "2rem 0 0 0" }}>Já tem uma conta? <Link to="/" style={{ color: "#EC0000", fontWeight: "600", textDecoration: "underline" }}>Faça Login</Link></p>
      </div>
    </div>
  );
}
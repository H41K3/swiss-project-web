import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. O GPS importado aqui!
import axios from 'axios';
import './Login.css';

export function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); // 2. O GPS ativado aqui!

  // Função que roda quando clica em "Entrar"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página pisque/recarregue
    setError(''); // Limpa mensagens de erro antigas

    try {
      // O Axios bate na porta da sua API real lá no Render
      const response = await axios.post('https://swiss-project-api.onrender.com/api/v1/auth/login', {
        login: login,
        password: password
      });

      // O Java disse "OK" e mandou o Token! Guardamos no "cofre" do navegador.
      const token = response.data.token;
      localStorage.setItem('token', token);

      // 3. O teletransporte (Adeus, alert!)
      navigate('/dashboard'); 
      
    } catch (err) {
      // Se o Java retornar erro (403, 400, etc), cai aqui.
      setError('Usuário ou senha incorretos. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Swiss Project</h2>
        
        {/* Se a variável error tiver texto, mostra essa barrinha vermelha */}
        {error && <div style={{color: 'red', textAlign: 'center', fontSize: '0.9rem'}}>{error}</div>}
        
        <div className="input-group">
          <label>Usuário</label>
          <input 
            type="text" 
            placeholder="Ex: haike_dev" 
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="Sua senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-login">Entrar</button>
      </form>
    </div>
  );
}
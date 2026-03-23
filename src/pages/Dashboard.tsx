import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// O "Molde" para o TypeScript (adeus 'any')
interface Transacao {
  id?: number;
  description?: string;
  descricao?: string;
  amount?: number;
  valor?: number;
  transactionDate?: string;
  type?: string; // <-- Adicionado para sabermos se é despesa na hora de exibir
}

export function Dashboard() {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');

  // Função limpa e direta
  const buscarTudo = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    try {
      const [resSaldo, resTrans] = await Promise.all([
        axios.get('https://swiss-project-api.onrender.com/api/v1/transactions/balance', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://swiss-project-api.onrender.com/api/v1/transactions', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setSaldo(resSaldo.data.balance || resSaldo.data.saldo || resSaldo.data);
      setTransacoes(Array.isArray(resTrans.data) ? resTrans.data : (resTrans.data.content || []));
    } catch (erro) {
      console.error(erro);
      navigate('/');
    }
  };

  useEffect(() => { 
    buscarTudo(); 
    // O comando mágico que manda o linter parar de reclamar dessa função
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // 1. Pega o valor digitado (ex: -5)
      const valorNumerico = parseFloat(novoValor);
      
      // 2. O React descobre sozinho se é Receita (INCOME) ou Despesa (EXPENSE)
      const tipoTransacao = valorNumerico >= 0 ? "INCOME" : "EXPENSE";
      
      // 3. Pega a data de hoje no formato exato que o Java pediu
      const dataHoje = new Date().toISOString().split('T')[0];

      // 4. Envia o pacote completo e perfeito para o Java
      await axios.post('https://swiss-project-api.onrender.com/api/v1/transactions', {
        description: novaDescricao,
        amount: Math.abs(valorNumerico), // <-- CORREÇÃO: Envia sempre positivo para passar no @Positive do Java
        transactionDate: dataHoje,
        type: tipoTransacao
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Se deu certo, limpa a tela e recarrega os dados!
      setNovaDescricao('');
      setNovoValor('');
      buscarTudo(); 
      alert("Transação realizada com sucesso!");
    } catch (erro) {
      console.error(erro);
      alert("Erro ao realizar transação. Verifique os dados.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Swiss Financial Tracker 🇨🇭</h2>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sair</button>
      </div>
      
      <div style={{ backgroundColor: '#f4f7f6', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
        <p style={{ color: '#555', margin: 0 }}>Saldo Disponível</p>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>CHF {saldo !== null ? saldo : '---'}</h1>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Registrar Nova Transação</h4>
        <form onSubmit={handleAddTransaction} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" placeholder="Descrição (ex: Almoço)" required 
            value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)}
            style={{ flex: 2, padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input 
            type="number" step="0.01" placeholder="Valor (ex: -50.00)" required 
            value={novoValor} onChange={e => setNovoValor(e.target.value)}
            style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '0.8rem 1.5rem', backgroundColor: '#e3000f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Enviar
          </button>
        </form>
        <small style={{ color: '#777', marginTop: '10px', display: 'block' }}>Dica: Use valores negativos para despesas e positivos para depósitos.</small>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ borderBottom: '2px solid #e3000f', paddingBottom: '10px' }}>Últimas Transações</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#777', fontSize: '0.9rem' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Descrição</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Data</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t, i) => {
              // Pega o valor absoluto do banco
              const valorPuro = t.amount !== undefined ? t.amount : (t.valor || 0);
              
              // <-- CORREÇÃO: Se for despesa, adiciona o sinal negativo para a interface pintar de vermelho
              const valorExibicao = t.type === 'EXPENSE' ? -Math.abs(valorPuro) : valorPuro;

              return (
              <tr key={t.id || i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{t.description || t.descricao}</td>
                <td style={{ padding: '12px', color: '#999', fontSize: '0.85rem' }}>{t.transactionDate || '---'}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: valorExibicao >= 0 ? '#2e7d32' : '#d32f2f' }}>
                  CHF {valorExibicao}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
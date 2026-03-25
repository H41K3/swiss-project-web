import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- DICIONÁRIOS ---
const translations = {
  pt: { flag: '🇧🇷', langs: { pt: 'Português', en: 'Inglês', es: 'Espanhol', fr: 'Francês', de: 'Alemão', it: 'Italiano', ja: 'Japonês', zh: 'Chinês', ko: 'Coreano' }, title: 'GlobalWallet', subtitle: 'Seu controle financeiro', home: 'Início', statement: 'Extrato Detalhado', cards: 'Meus Cartões', settings: 'Configurações', welcome: 'Olá', logout: 'Sair', balance: 'Saldo Disponível', newTransaction: 'Registrar Nova Transação', income: 'Entrada', expense: 'Saída', descPlaceholder: 'Descrição (ex: Mercado)', valPlaceholder: '0,00', btnRegister: 'Registrar', history: 'Últimas Transações', noTransactions: 'Nenhuma transação.', confirmDelete: 'Excluir transação?', errorValue: 'Valor inválido.', selCategory: 'Categoria' },
  en: { flag: '🇺🇸', langs: { pt: 'Portuguese', en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', ja: 'Japanese', zh: 'Chinese', ko: 'Korean' }, title: 'GlobalWallet', subtitle: 'Your financial control', home: 'Home', statement: 'Statement', cards: 'My Cards', settings: 'Settings', welcome: 'Hello', logout: 'Logout', balance: 'Available Balance', newTransaction: 'New Transaction', income: 'Income', expense: 'Expense', descPlaceholder: 'Description (ex: Grocery)', valPlaceholder: '0.00', btnRegister: 'Register', history: 'Recent Transactions', noTransactions: 'No transactions yet.', confirmDelete: 'Delete transaction?', errorValue: 'Invalid value.', selCategory: 'Category' },
  es: { flag: '🇪🇸', langs: { pt: 'Portugués', en: 'Inglés', es: 'Español', fr: 'Francés', de: 'Alemán', it: 'Italiano', ja: 'Japonés', zh: 'Chino', ko: 'Coreano' }, title: 'GlobalWallet', subtitle: 'Tu control financiero', home: 'Inicio', statement: 'Estado', cards: 'Mis Tarjetas', settings: 'Ajustes', welcome: 'Hola', logout: 'Salir', balance: 'Saldo Disponible', newTransaction: 'Nueva Transacción', income: 'Ingreso', expense: 'Gasto', descPlaceholder: 'Descripción (ej: Mercado)', valPlaceholder: '0,00', btnRegister: 'Registrar', history: 'Últimas Transacciones', noTransactions: 'Aún no hay transacciones.', confirmDelete: '¿Eliminar?', errorValue: 'Valor inválido.', selCategory: 'Categoría' },
  fr: { flag: '🇫🇷', langs: { pt: 'Portugais', en: 'Anglais', es: 'Espagnol', fr: 'Français', de: 'Allemand', it: 'Italien', ja: 'Japonais', zh: 'Chinois', ko: 'Coréen' }, title: 'GlobalWallet', subtitle: 'Votre contrôle financier', home: 'Accueil', statement: 'Relevé', cards: 'Mes Cartes', settings: 'Paramètres', welcome: 'Bonjour', logout: 'Quitter', balance: 'Solde Disponible', newTransaction: 'Nouvelle Transaction', income: 'Revenu', expense: 'Dépense', descPlaceholder: 'Description (ex: Marché)', valPlaceholder: '0,00', btnRegister: 'Enregistrer', history: 'Dernières Transactions', noTransactions: 'Aucune transaction.', confirmDelete: 'Supprimer?', errorValue: 'Valeur invalide.', selCategory: 'Catégorie' },
  de: { flag: '🇩🇪', langs: { pt: 'Portugiesisch', en: 'Englisch', es: 'Spanisch', fr: 'Französisch', de: 'Deutsch', it: 'Italienisch', ja: 'Japanisch', zh: 'Chinesisch', ko: 'Koreanisch' }, title: 'GlobalWallet', subtitle: 'Ihre Finanzkontrolle', home: 'Startseite', statement: 'Auszug', cards: 'Meine Karten', settings: 'Einstellungen', welcome: 'Hallo', logout: 'Abmelden', balance: 'Verfügbares Guthaben', newTransaction: 'Neue Transaktion', income: 'Einnahme', expense: 'Ausgabe', descPlaceholder: 'Beschreibung (z.B. Markt)', valPlaceholder: '0,00', btnRegister: 'Registrieren', history: 'Letzte Transaktionen', noTransactions: 'Noch keine Transaktionen.', confirmDelete: 'Löschen?', errorValue: 'Ungültiger Wert.', selCategory: 'Kategorie' },
  it: { flag: '🇮🇹', langs: { pt: 'Portoghese', en: 'Inglese', es: 'Spagnolo', fr: 'Francese', de: 'Tedesco', it: 'Italiano', ja: 'Giapponese', zh: 'Cinese', ko: 'Coreano' }, title: 'GlobalWallet', subtitle: 'Il tuo controllo', home: 'Inizio', statement: 'Estratto', cards: 'Le Mie Carte', settings: 'Impostazioni', welcome: 'Ciao', logout: 'Esci', balance: 'Saldo Disponibile', newTransaction: 'Nuova Transazione', income: 'Entrata', expense: 'Uscita', descPlaceholder: 'Descrizione (es: Mercato)', valPlaceholder: '0,00', btnRegister: 'Registra', history: 'Ultime Transazioni', noTransactions: 'Nessuna transazione.', confirmDelete: 'Eliminare?', errorValue: 'Valore non valido.', selCategory: 'Categoria' },
  ja: { flag: '🇯🇵', langs: { pt: 'ポルトガル語', en: '英語', es: 'スペイン語', fr: 'フランス語', de: 'ドイツ語', it: 'イタリア語', ja: '日本語', zh: '中国語', ko: '韓国語' }, title: 'GlobalWallet', subtitle: '財務管理', home: 'ホーム', statement: '明細', cards: 'カード', settings: '設定', welcome: 'こんにちは', logout: 'ログアウト', balance: '利用可能残高', newTransaction: '新規取引', income: '収入', expense: '支出', descPlaceholder: '説明 (例: スーパー)', valPlaceholder: '0.00', btnRegister: '登録', history: '最近の取引', noTransactions: '取引はまだありません。', confirmDelete: '削除しますか？', errorValue: '無効な値です。', selCategory: 'カテゴリ' },
  zh: { flag: '🇨🇳', langs: { pt: '葡萄牙语', en: '英语', es: '西班牙语', fr: '法语', de: '德语', it: '意大利语', ja: '日语', zh: '中文', ko: '韩语' }, title: 'GlobalWallet', subtitle: '你的财务控制', home: '首页', statement: '声明', cards: '我的卡', settings: '设置', welcome: '你好', logout: '退出', balance: '可用余额', newTransaction: '新交易', income: '收入', expense: '支出', descPlaceholder: '描述 (例: 超市)', valPlaceholder: '0.00', btnRegister: '注册', history: '最近交易', noTransactions: '暂无交易。', confirmDelete: '删除交易？', errorValue: '无效值。', selCategory: '类别' },
  ko: { flag: '🇰🇷', langs: { pt: '포르투갈어', en: '영어', es: '스페인어', fr: '프랑스어', de: '독일어', it: '이탈리아어', ja: '일본어', zh: '중국어', ko: '한국어' }, title: 'GlobalWallet', subtitle: '귀하의 재정 관리', home: '홈', statement: '명세서', cards: '내 카드', settings: '설정', welcome: '안녕하세요', logout: '로그아웃', balance: '사용 가능 잔액', newTransaction: '새 거래', income: '수입', expense: '지출', descPlaceholder: '설명 (예: 시장)', valPlaceholder: '0.00', btnRegister: '등록', history: '최근 거래', noTransactions: '아직 거래가 없습니다.', confirmDelete: '삭제하시겠습니까?', errorValue: '잘못된 값입니다.', selCategory: '카테고리' }
};

// --- DICIONÁRIO E ESTILO DAS CATEGORIAS ---
const categoryMap: Record<string, { pt: string, en: string, es: string, fr: string, de: string, it: string, ja: string, zh: string, ko: string, emoji: string, color: string, bgColor: string }> = {
  SALARY: { pt: 'Salário', en: 'Salary', es: 'Salario', fr: 'Salaire', de: 'Gehalt', it: 'Stipendio', ja: '給与', zh: '工资', ko: '급여', emoji: '💰', color: '#2e7d32', bgColor: '#e8f5e9' },
  SALES: { pt: 'Vendas', en: 'Sales', es: 'Ventas', fr: 'Ventes', de: 'Verkäufe', it: 'Vendite', ja: '売上', zh: '销售', ko: '판매', emoji: '🛍️', color: '#0277bd', bgColor: '#e3f2fd' },
  FOOD: { pt: 'Alimentação', en: 'Food', es: 'Alimentación', fr: 'Alimentation', de: 'Essen', it: 'Cibo', ja: '食事', zh: '食物', ko: '음식', emoji: '🍔', color: '#e65100', bgColor: '#fff3e0' },
  TRANSPORT: { pt: 'Transporte', en: 'Transport', es: 'Transporte', fr: 'Transport', de: 'Transport', it: 'Trasporto', ja: '交通', zh: '交通', ko: '교통', emoji: '🚌', color: '#1565c0', bgColor: '#e3f2fd' },
  ENTERTAINMENT: { pt: 'Lazer', en: 'Entertainment', es: 'Entretenimiento', fr: 'Loisirs', de: 'Freizeit', it: 'Svago', ja: '娯楽', zh: '娱乐', ko: '오락', emoji: '🍿', color: '#6a1b9a', bgColor: '#f3e5f5' },
  BILLS: { pt: 'Contas', en: 'Bills', es: 'Cuentas', fr: 'Factures', de: 'Rechnungen', it: 'Bollette', ja: '請求書', zh: '账单', ko: '청구서', emoji: '📄', color: '#00695c', bgColor: '#e0f2f1' },
  OTHER: { pt: 'Outros', en: 'Other', es: 'Otros', fr: 'Autres', de: 'Andere', it: 'Altro', ja: 'その他', zh: '其他', ko: '기타', emoji: '📌', color: '#616161', bgColor: '#f5f5f5' }
};

type IdiomaType = keyof typeof translations;

interface Transacao {
  id?: number;
  description?: string;
  amount?: number;
  transactionDate?: string;
  type?: string; 
  category?: string; 
}

export function Dashboard() {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [tipoTransacaoSelecionado, setTipoTransacaoSelecionado] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('OTHER'); 

  const [menuCategoriaAberto, setMenuCategoriaAberto] = useState(false);
  const menuCategoriaRef = useRef<HTMLDivElement>(null);

  const [menuAberto, setMenuAberto] = useState(false);
  const [idioma, setIdioma] = useState<IdiomaType>('pt');
  const [menuIdiomaAberto, setMenuIdiomaAberto] = useState(false);
  const t = translations[idioma]; 
  const menuIdiomaRef = useRef<HTMLDivElement>(null);

  const [moedaExibicao, setMoedaExibicao] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  const [cotacoes, setCotacoes] = useState({ usd: 0, eur: 0 });
  const nomeUsuario = localStorage.getItem('usuario') || 'haike_dev';

  const buscarTudo = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    try {
      const [resSaldo, resTrans] = await Promise.all([
        axios.get('https://swiss-project-api.onrender.com/api/v1/transactions/balance', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://swiss-project-api.onrender.com/api/v1/transactions', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSaldo(resSaldo.data.balance !== undefined ? resSaldo.data.balance : resSaldo.data);
      setTransacoes(Array.isArray(resTrans.data) ? resTrans.data : (resTrans.data.content || []));
    } catch (erro) {
      console.error(erro);
      navigate('/');
    }
  };

  const buscarCotacoes = async () => {
    try {
      const res = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
      setCotacoes({
        usd: parseFloat(res.data.USDBRL.bid),
        eur: parseFloat(res.data.EURBRL.bid) 
      });
    } catch (erro) {
      console.error("Erro ao buscar cotações:", erro);
    }
  };

  useEffect(() => { 
    buscarTudo(); 
    buscarCotacoes(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuIdiomaRef.current && !menuIdiomaRef.current.contains(event.target as Node)) {
        setMenuIdiomaAberto(false);
      }
      if (menuCategoriaRef.current && !menuCategoriaRef.current.contains(event.target as Node)) {
        setMenuCategoriaAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // Controla as opções de categoria quando o tipo de transação muda
  useEffect(() => {
    if (tipoTransacaoSelecionado === 'INCOME') {
      if (!['SALARY', 'SALES', 'OTHER'].includes(categoriaSelecionada)) {
        setCategoriaSelecionada('SALARY');
      }
    } else {
      if (!['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'BILLS', 'OTHER'].includes(categoriaSelecionada)) {
        setCategoriaSelecionada('OTHER');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoTransacaoSelecionado]);

  const getCategoriasDisponiveis = () => {
    if (tipoTransacaoSelecionado === 'INCOME') {
      return ['SALARY', 'SALES', 'OTHER'];
    }
    return ['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'BILLS', 'OTHER'];
  };

  const handleDescricaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaDescricao(e.target.value.replace(/[0-9]/g, ''));
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoValor(e.target.value.replace(/[^0-9.,]/g, ''));
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const valorCorrigido = novoValor.replace(',', '.');
      const valorNumerico = Math.abs(parseFloat(valorCorrigido));
      if (isNaN(valorNumerico)) { alert(t.errorValue); return; }
      const descFormatada = novaDescricao.charAt(0).toUpperCase() + novaDescricao.slice(1);
      
      let valorParaSalvar = valorNumerico;
      if (moedaExibicao === 'USD' && cotacoes.usd > 0) valorParaSalvar = valorNumerico * cotacoes.usd;
      if (moedaExibicao === 'EUR' && cotacoes.eur > 0) valorParaSalvar = valorNumerico * cotacoes.eur;

      const dataHojeLocal = new Date();
      const ano = dataHojeLocal.getFullYear();
      const mes = String(dataHojeLocal.getMonth() + 1).padStart(2, '0');
      const dia = String(dataHojeLocal.getDate()).padStart(2, '0');
      const dataSeguraParaBanco = `${ano}-${mes}-${dia}`;

      await axios.post('https://swiss-project-api.onrender.com/api/v1/transactions', {
        description: descFormatada,
        amount: valorParaSalvar, 
        transactionDate: dataSeguraParaBanco, 
        type: tipoTransacaoSelecionado,
        category: categoriaSelecionada
      }, { headers: { Authorization: `Bearer ${token}` } });

      // Aqui está a mudança: Apenas limpamos os campos de texto.
      // O Tipo de Transação e a Categoria permanecem os mesmos que o usuário escolheu!
      setNovaDescricao(''); 
      setNovoValor(''); 
      
      buscarTudo();
    } catch (erro) { 
      console.error(erro); 
      alert("Erro ao salvar! Certifique-se de que reiniciou o servidor Java para aplicar as novas categorias.");
    }
  };

  const handleDeleteTransaction = async (id?: number) => {
    if (!id || !window.confirm(t.confirmDelete)) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://swiss-project-api.onrender.com/api/v1/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      buscarTudo(); 
    } catch (erro) { console.error(erro); }
  };

  const getValorExibicao = (valorBaseReal: number) => {
    if (moedaExibicao === 'USD' && cotacoes.usd > 0) return { simbolo: 'US$', valorFormatado: (valorBaseReal / cotacoes.usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
    if (moedaExibicao === 'EUR' && cotacoes.eur > 0) return { simbolo: '€', valorFormatado: (valorBaseReal / cotacoes.eur).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
    return { simbolo: 'R$', valorFormatado: valorBaseReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
  };

  const fmtBRL = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtUSD = (v: number) => `US$ ${(v / cotacoes.usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtEUR = (v: number) => `€ ${(v / cotacoes.eur).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatarDataLocal = (dataString?: string) => {
    if (!dataString) return '---';
    const apenasData = dataString.split('T')[0];
    const partes = apenasData.split('-');
    if (partes.length !== 3) return dataString; 
    const dataObj = new Date(Date.UTC(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2])));
    const mapaLocais: Record<IdiomaType, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR' };
    return dataObj.toLocaleDateString(mapaLocais[idioma], { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const CategoryOption = ({ catKey }: { catKey: string }) => {
    const cat = categoryMap[catKey];
    const isSelected = categoriaSelecionada === catKey;
    const catName = cat[idioma as keyof typeof cat] as string;

    return (
      <div 
        onClick={() => { setCategoriaSelecionada(catKey); setMenuCategoriaAberto(false); }}
        style={{ 
          padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', 
          backgroundColor: isSelected ? '#f4f6f8' : 'transparent',
          borderRadius: '8px', transition: 'all 0.2s ease',
          marginBottom: '2px'
        }}
        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
        onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <span style={{ fontSize: '1.2rem' }}>{cat.emoji}</span>
        <span style={{ fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111' : '#555', fontSize: '0.9rem' }}>{catName}</span>
        {isSelected && <span style={{ marginLeft: 'auto', color: '#EC0000', fontSize: '0.85rem' }}>✔</span>}
      </div>
    );
  };

  const catSelecionadaData = categoryMap[categoriaSelecionada] || categoryMap['OTHER'];
  const catSelecionadaName = catSelecionadaData[idioma as keyof typeof catSelecionadaData] as string;

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '2rem' }}>
      
      {menuAberto && <div onClick={() => setMenuAberto(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999 }} />}

      <div style={{ position: 'fixed', top: 0, left: menuAberto ? 0 : '-280px', width: '260px', height: '100vh', backgroundColor: '#fff', boxShadow: '2px 0 10px rgba(0,0,0,0.1)', transition: 'left 0.3s ease-in-out', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: '#EC0000', padding: '2rem 1.5rem', color: 'white' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{t.title} 🌍</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>{t.subtitle}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, fontSize: '0.95rem' }}>
          <li style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontWeight: 'bold', color: '#EC0000', borderLeft: '4px solid #EC0000' }}>🏠 {t.home}</li>
          <li style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', color: '#666' }}>📊 {t.statement}</li>
          <li style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', color: '#666' }}>💳 {t.cards}</li>
          <li style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', color: '#666' }}>⚙️ {t.settings}</li>
        </ul>
      </div>

      <header style={{ backgroundColor: '#EC0000', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setMenuAberto(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>☰</button>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{t.title}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <div ref={menuIdiomaRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setMenuIdiomaAberto(!menuIdiomaAberto)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: 'white' }}
              title="Trocar Idioma"
            >
              {t.flag} <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>▼</span>
            </button>

            {menuIdiomaAberto && (
              <div style={{ position: 'absolute', top: '45px', right: 0, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', zIndex: 1001, minWidth: '220px' }}>
                {(Object.keys(translations) as IdiomaType[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setIdioma(lang); setMenuIdiomaAberto(false); }}
                    style={{ background: idioma === lang ? '#f5f5f5' : 'transparent', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#333', textAlign: 'left', fontWeight: idioma === lang ? 'bold' : 'normal' }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{translations[lang].flag}</span> {t.langs[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem' }}>{t.welcome}, <strong>{nomeUsuario}</strong></span>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}>{t.logout}</button>
          </div>
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative' }}>
          {cotacoes.usd > 0 && (
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '5px', backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '8px' }}>
              <button onClick={() => setMoedaExibicao('BRL')} style={{ background: moedaExibicao === 'BRL' ? '#fff' : 'transparent', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: moedaExibicao === 'BRL' ? 'bold' : 'normal', color: '#333', boxShadow: moedaExibicao === 'BRL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>BRL</button>
              <button onClick={() => setMoedaExibicao('USD')} style={{ background: moedaExibicao === 'USD' ? '#fff' : 'transparent', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: moedaExibicao === 'USD' ? 'bold' : 'normal', color: '#333', boxShadow: moedaExibicao === 'USD' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>USD</button>
              <button onClick={() => setMoedaExibicao('EUR')} style={{ background: moedaExibicao === 'EUR' ? '#fff' : 'transparent', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: moedaExibicao === 'EUR' ? 'bold' : 'normal', color: '#333', boxShadow: moedaExibicao === 'EUR' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>EUR</button>
            </div>
          )}

          <p style={{ color: '#888', margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.balance}</p>
          <h1 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#111', fontWeight: '600' }}>
            {saldo !== null ? (
              <>
                <span style={{ fontSize: '1.2rem', color: '#888', fontWeight: 'normal', marginRight: '5px' }}>
                  {getValorExibicao(saldo).simbolo}
                </span>
                {getValorExibicao(saldo).valorFormatado}
              </>
            ) : '---'}
          </h1>
          
          {saldo !== null && cotacoes.usd > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
              {moedaExibicao !== 'BRL' && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '0.95rem' }}><span>🇧🇷</span><strong>{fmtBRL(saldo)}</strong></div>}
              {moedaExibicao !== 'USD' && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '0.95rem' }} title={`Cotação: R$ ${cotacoes.usd.toFixed(2)}`}><span>🇺🇸</span><strong>{fmtUSD(saldo)}</strong></div>}
              {moedaExibicao !== 'EUR' && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '0.95rem' }} title={`Cotação: R$ ${cotacoes.eur.toFixed(2)}`}><span>🇪🇺</span><strong>{fmtEUR(saldo)}</strong></div>}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>{t.newTransaction}</h4>
          <form onSubmit={handleAddTransaction}>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <button type="button" onClick={() => setTipoTransacaoSelecionado('INCOME')} style={{ padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', border: tipoTransacaoSelecionado === 'INCOME' ? '1px solid #2e7d32' : '1px solid #eaeaea', backgroundColor: tipoTransacaoSelecionado === 'INCOME' ? '#e8f5e9' : '#fafafa', color: tipoTransacaoSelecionado === 'INCOME' ? '#2e7d32' : '#999' }}>+ {t.income}</button>
              <button type="button" onClick={() => setTipoTransacaoSelecionado('EXPENSE')} style={{ padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', border: tipoTransacaoSelecionado === 'EXPENSE' ? '1px solid #EC0000' : '1px solid #eaeaea', backgroundColor: tipoTransacaoSelecionado === 'EXPENSE' ? '#ffebee' : '#fafafa', color: tipoTransacaoSelecionado === 'EXPENSE' ? '#EC0000' : '#999' }}>- {t.expense}</button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              <div ref={menuCategoriaRef} style={{ position: 'relative', minWidth: '160px' }}>
                <div 
                  onClick={() => setMenuCategoriaAberto(!menuCategoriaAberto)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: '12px', border: '1px solid #eaeaea', backgroundColor: '#fff', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{catSelecionadaData.emoji}</span>
                    <span style={{ fontSize: '0.95rem', color: '#333', fontWeight: '500' }}>{catSelecionadaName}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#ccc', transform: menuCategoriaAberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>

                {menuCategoriaAberto && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '8px', zIndex: 1002, border: '1px solid #f0f0f0' }}>
                    {getCategoriasDisponiveis().map(catKey => (
                      <CategoryOption key={catKey} catKey={catKey} />
                    ))}
                  </div>
                )}
              </div>

              <input type="text" placeholder={t.descPlaceholder} required value={novaDescricao} onChange={handleDescricaoChange} style={{ flex: 2, minWidth: '180px', padding: '10px 14px', borderRadius: '12px', border: '1px solid #eaeaea', backgroundColor: '#fafafa', outline: 'none', fontSize: '0.9rem' }} />
              <input type="text" placeholder={t.valPlaceholder} required value={novoValor} onChange={handleValorChange} style={{ flex: 1, minWidth: '100px', padding: '10px 14px', borderRadius: '12px', border: '1px solid #eaeaea', backgroundColor: '#fafafa', outline: 'none', textAlign: 'right', fontSize: '0.9rem' }} />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#EC0000', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(236,0,0,0.2)' }}>{t.btnRegister}</button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: '1.5rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '1.1rem', fontWeight: '600' }}>{t.history}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {transacoes.map((t_row, i) => {
                const isExpense = t_row.type === 'EXPENSE';
                const valorAbsoluto = Math.abs(t_row.amount || 0);
                const infoExibicao = getValorExibicao(valorAbsoluto);
                
                const categoriaVisual = categoryMap[t_row.category || 'OTHER'] || categoryMap['OTHER'];
                const nomeCategoriaTraduzido = categoriaVisual[idioma as keyof typeof categoriaVisual] as string;

                return (
                  <tr key={t_row.id || i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: categoriaVisual.bgColor, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }} title={nomeCategoriaTraduzido}>
                        {categoriaVisual.emoji}
                      </div>

                      <div>
                        <div style={{ fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>{t_row.description}</div>
                        <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '4px' }}>
                          <span style={{ color: categoriaVisual.color, fontWeight: 'bold', marginRight: '6px' }}>{nomeCategoriaTraduzido}</span>
                          • {formatarDataLocal(t_row.transactionDate)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 0', textAlign: 'right' }}>
                      <div style={{ fontWeight: '600', color: isExpense ? '#333' : '#107c10', fontSize: '0.95rem' }}>
                        {isExpense ? '- ' : '+ '}{infoExibicao.simbolo} {infoExibicao.valorFormatado}
                      </div>
                    </td>
                    <td style={{ width: '40px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteTransaction(t_row.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transacoes.length === 0 && <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', marginTop: '20px' }}>{t.noTransactions}</p>}
        </div>
      </div>
    </div>
  );
}
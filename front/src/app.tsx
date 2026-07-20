import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, WalletCards, Menu, X, Activity, UserCircle, LucideIcon } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Pessoas } from './pages/Pessoas';
import { Transacoes } from './pages/Transacoes';

function NavLink({ to, icon: Icon, children, onClick }: { to: string, icon: LucideIcon, children: React.ReactNode, onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} /> 
      {children}
    </Link>
  );
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-200">
        
        {/* Header Mobile (Visível apenas em telas pequenas) */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-6 z-40 shadow-md">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-400" size={24} />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              FinControl
            </h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-slate-300 hover:text-white transition-colors"
          >
            <Menu size={28} />
          </button>
        </header>

        {/* Overlay Escuro para Mobile (Fundo desfocado ao abrir o menu) */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={closeMenu}
          />
        )}

        {/* Sidebar (Navegação Lateral) */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}>
          
          {/* Logo / Header da Sidebar */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <Activity className="text-blue-400" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
                FinControl
              </h1>
            </div>
            {/* Botão de Fechar no Mobile */}
            <button onClick={closeMenu} className="md:hidden p-2 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Principal</p>
            </div>
            <NavLink to="/" icon={LayoutDashboard} onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/pessoas" icon={Users} onClick={closeMenu}>Pessoas</NavLink>
            <NavLink to="/transacoes" icon={WalletCards} onClick={closeMenu}>Lançamentos</NavLink>
          </nav>

          {/* Mockup de Perfil de Usuário no Rodapé do Menu */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
              <UserCircle size={36} className="text-slate-400" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">Administrador</p>
                <p className="text-xs text-slate-500 truncate">admin@fincontrol.app</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Área Principal de Conteúdo */}
        <main className="flex-1 w-full h-screen overflow-y-auto pt-20 md:pt-0">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pessoas" element={<Pessoas />} />
              <Route path="/transacoes" element={<Transacoes />} />
            </Routes>
          </div>
        </main>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Phone,
  PhoneOff,
  Settings,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Design: Modern Tech Dark Premium
 * - Sidebar recolhível com ícones minimalistas
 * - Glassmorphism em cards
 * - Animações suaves em transições
 * - Status indicators com glow
 */

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  const menuItems = [
    {
      label: 'Contas SIP',
      icon: Phone,
      href: '/dashboard/sip-accounts',
      admin: false,
    },
    {
      label: 'Histórico',
      icon: PhoneOff,
      href: '/dashboard/call-history',
      admin: false,
    },
    {
      label: 'Contatos',
      icon: Users,
      href: '/dashboard/contacts',
      admin: false,
    },
    ...(isAdmin
      ? [
          {
            label: 'Usuários',
            icon: Users,
            href: '/dashboard/users',
            admin: true,
          },
          {
            label: 'Configurações',
            icon: Settings,
            href: '/dashboard/admin-settings',
            admin: true,
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`glass-sm border-r border-border/20 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-foreground">Yamaphone</span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors group"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info e Logout */}
        <div className="p-4 border-t border-border/20 space-y-3">
          {sidebarOpen && (
            <div className="px-2">
              <p className="text-xs text-muted-foreground">Conectado como</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.username}
              </p>
              {isAdmin && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                  Administrador
                </span>
              )}
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Sair'}
          </Button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border/20 flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-sm border-b border-border/20 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="status-online" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

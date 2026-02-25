import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Phone } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Design: Modern Tech Dark Premium
 * - Glassmorphism background com blur
 * - Cyan accent color (#06B6D4)
 * - Tipografia Geist Bold para títulos
 * - Animações suaves em transições
 */

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradiente de fundo animado */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 mb-4">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Yamaphone</h1>
          <p className="text-muted-foreground">Gerenciamento de Contas SIP</p>
        </div>

        {/* Card de Autenticação */}
        <div className="glass p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Usuário
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seu_usuario"
                disabled={isLoading}
                className="bg-input/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="bg-input/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isLoading ? 'Carregando...' : isRegister ? 'Registrar' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/20">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRegister
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Registre-se'}
            </button>
          </div>
        </div>

        {/* Informações de Demonstração */}
        <div className="glass-sm p-4 text-center text-xs text-muted-foreground">
          <p>Sistema de gerenciamento de contas SIP Yamaphone</p>
        </div>
      </div>
    </div>
  );
}

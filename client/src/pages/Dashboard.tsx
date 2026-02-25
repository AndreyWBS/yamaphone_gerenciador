import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { Plus, Phone, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
const apiUrl =  import.meta.env.backendurl || 'http://localhost:3015';


/**
 * Design: Modern Tech Dark Premium
 * - Cards com glassmorphism
 * - Indicadores de status com glow
 * - Grid layout responsivo
 * - Animações suaves
 */

interface SipAccount {
  id: number;
  sip_uri: string;
  display_name: string;
  auto_answer: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<SipAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { request } = useApi();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await request<SipAccount[]>(`/api/sip-accounts`);
        setAccounts(data);
      } catch (err) {
        console.error('Erro ao carregar contas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [request]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header com CTA */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo ao Yamaphone
            </h2>
            <p className="text-muted-foreground">
              Gerencie suas contas SIP, histórico de chamadas e contatos
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Nova Conta SIP
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass p-6 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Contas Ativas
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {accounts.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass p-6 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Chamadas Hoje
                </p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="glass p-6 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Contatos Salvos
                </p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Contas SIP */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">
            Suas Contas SIP
          </h3>
          {isLoading ? (
            <div className="glass p-8 text-center text-muted-foreground">
              Carregando contas...
            </div>
          ) : accounts.length === 0 ? (
            <Card className="glass p-8 text-center border-border/20">
              <Phone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma conta SIP configurada
              </p>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Criar Primeira Conta
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <Card
                  key={account.id}
                  className="glass p-6 border-border/20 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {account.display_name || 'Conta SIP'}
                      </h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        {account.sip_uri}
                      </p>
                    </div>
                    <div className="status-online" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      Auto-resposta:{' '}
                      {account.auto_answer ? 'Ativada' : 'Desativada'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Design: Modern Tech Dark Premium
 * - Tabela com glassmorphism
 * - Ícones de tipo de chamada
 * - Formatação de data e duração
 * - Status visual com cores
 */

interface CallRecord {
  id: number;
  phone_number: string;
  contact_name?: string;
  call_type: 'incoming' | 'outgoing' | 'missed';
  call_status?: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  answered: boolean;
}

export default function CallHistory() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { request } = useApi();

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      setIsLoading(true);
      const data = await request<CallRecord[]>('/api/call-history');
      setCalls(data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-4 h-4 text-emerald-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getCallLabel = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'Recebida';
      case 'outgoing':
        return 'Realizada';
      case 'missed':
        return 'Perdida';
      default:
        return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Histórico de Chamadas
          </h2>
          <p className="text-muted-foreground">
            Visualize todas as suas chamadas recentes
          </p>
        </div>

        {isLoading ? (
          <Card className="glass p-8 text-center border-border/20">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando histórico...</p>
          </Card>
        ) : calls.length === 0 ? (
          <Card className="glass p-8 text-center border-border/20">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma chamada registrada
            </p>
          </Card>
        ) : (
          <div className="glass border-border/20 overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20 bg-card/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Número
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Contato
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Data/Hora
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Duração
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => (
                    <tr
                      key={call.id}
                      className="border-b border-border/10 hover:bg-card/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getCallIcon(call.call_type)}
                          <span className="text-xs text-muted-foreground">
                            {getCallLabel(call.call_type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-foreground">
                          {call.phone_number}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          {call.contact_name || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(call.start_time)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">
                          {formatDuration(call.duration_seconds)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            call.answered
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {call.answered ? 'Atendida' : 'Não atendida'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

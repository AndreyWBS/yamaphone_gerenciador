import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UserCombobox from '@/components/ui/UserCombobox';
import { useApi } from '@/hooks/useApi';
import { Plus, Trash2, Edit2, Copy, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Design: Modern Tech Dark Premium
 * - Cards com glassmorphism
 * - Diálogos com backdrop blur
 * - Ações inline com ícones
 * - Feedback visual com toasts
 */

interface SipAccount {
  id: number;
  sip_uri: string;
  sip_password: string;
  websocket_server?: string;
  display_name?: string;
  auto_answer: boolean;
  register_expiration?: number;
  created_at: string;
  user_id: number;
}






export default function SipAccounts() {
  const [accounts, setAccounts] = useState<SipAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    sip_uri: '',
    sip_password: '',
    display_name: '',
    websocket_server: '',
    auto_answer: false,
    user_id: 0,
  });
  const { request } = useApi();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await request<SipAccount[]>('/api/sip-accounts');
      setAccounts(data);
    } catch (err) {
      toast.error('Erro ao carregar contas SIP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await request(`/api/sip-accounts/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Conta atualizada com sucesso');
      } else {
        console.log('vendoooooaaaa:', formData);
        await request('/api/sip-accounts', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Conta criada com sucesso');
      }
      setIsOpen(false);
      resetForm();
      fetchAccounts();
    } catch (err) {
      toast.error('Erro ao salvar conta');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta conta?')) return;

    try {
      await request(`/api/sip-accounts/${id}`, { method: 'DELETE' });
      toast.success('Conta deletada com sucesso');
      fetchAccounts();
    } catch (err) {
      toast.error('Erro ao deletar conta');
    }
  };

  const handleEdit = (account: SipAccount) => {
    setEditingId(account.id);
    setFormData({
      sip_uri: account.sip_uri,
      sip_password: account.sip_password,
      display_name: account.display_name || '',
      websocket_server: account.websocket_server || '',
      auto_answer: account.auto_answer,
      user_id: account.user_id,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      sip_uri: '',
      sip_password: '',
      display_name: '',
      websocket_server: '',
      auto_answer: false,
      user_id: 0,
    });
    setEditingId(null);
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Contas SIP
            </h2>
            <p className="text-muted-foreground">
              Gerencie suas contas e configurações SIP
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => resetForm()}
              >
                <Plus className="w-4 h-4" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/20">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Conta SIP' : 'Nova Conta SIP'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Atualize as informações da sua conta SIP'
                    : 'Configure uma nova conta SIP'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    URI SIP
                  </label>
                  <Input
                    value={formData.sip_uri}
                    onChange={(e) =>
                      setFormData({ ...formData, sip_uri: e.target.value })
                    }
                    placeholder="sip:usuario@servidor.com"
                    required
                    className="bg-input/50 border-border/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha
                  </label>
                  <Input
                    type="password"
                    value={formData.sip_password}
                    onChange={(e) =>
                      setFormData({ ...formData, sip_password: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="bg-input/50 border-border/30"
                  />
                </div>
                <div>


                  <UserCombobox
                    value={formData.user_id}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        user_id: value,
                      }))
                    }
                  />


                </ div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome de Exibição
                  </label>
                  <Input
                    value={formData.display_name}
                    onChange={(e) =>
                      setFormData({ ...formData, display_name: e.target.value })
                    }
                    placeholder="Seu Nome"
                    className="bg-input/50 border-border/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Servidor WebSocket
                  </label>
                  <Input
                    value={formData.websocket_server}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        websocket_server: e.target.value,
                      })
                    }
                    placeholder="wss://servidor.com:8089"
                    className="bg-input/50 border-border/30"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto_answer"
                    checked={formData.auto_answer}
                    onChange={(e) =>
                      setFormData({ ...formData, auto_answer: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="auto_answer" className="text-sm text-foreground">
                    Ativar auto-resposta
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {editingId ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <Card className="glass p-8 text-center border-border/20">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando contas...</p>
          </Card>
        ) : accounts.length === 0 ? (
          <Card className="glass p-8 text-center border-border/20">
            <p className="text-muted-foreground mb-4">
              Nenhuma conta SIP configurada
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className="glass p-6 border-border/20 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {account.display_name || 'Conta SIP'}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono mb-2">
                      {account.sip_uri}
                    </p>
                    {account.websocket_server && (
                      <p className="text-xs text-muted-foreground">
                        WebSocket: {account.websocket_server}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(account.sip_uri, account.id)}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      title="Copiar URI"
                    >
                      {copiedId === account.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

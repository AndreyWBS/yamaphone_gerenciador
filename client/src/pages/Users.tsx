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
import { useApi } from '@/hooks/useApi';
import { Plus, Trash2, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Design: Modern Tech Dark Premium
 * - Tabela com glassmorphism
 * - Badges de admin
 * - Ações inline
 * - Diálogos modais
 */

interface User {
  id: number;
  username: string;
  adm_bool: boolean;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adm_bool: false,
  });
  const { request } = useApi();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await request<User[]>('/api/users');
      setUsers(data);
    } catch (err) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('/api/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      toast.success('Usuário criado com sucesso');
      setIsOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error('Erro ao criar usuário');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await request(`/api/users/${id}`, { method: 'DELETE' });
      toast.success('Usuário deletado com sucesso');
      fetchUsers();
    } catch (err) {
      toast.error('Erro ao deletar usuário');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      adm_bool: false,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Gerenciamento de Usuários
            </h2>
            <p className="text-muted-foreground">
              Crie e gerencie usuários do sistema
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => resetForm()}
              >
                <Plus className="w-4 h-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/20">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Adicione um novo usuário ao sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Usuário
                  </label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="nome_usuario"
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
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="bg-input/50 border-border/30"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="adm_bool"
                    checked={formData.adm_bool}
                    onChange={(e) =>
                      setFormData({ ...formData, adm_bool: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="adm_bool" className="text-sm text-foreground">
                    Administrador
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Criar
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
            <p className="text-muted-foreground">Carregando usuários...</p>
          </Card>
        ) : users.length === 0 ? (
          <Card className="glass p-8 text-center border-border/20">
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </Card>
        ) : (
          <div className="glass border-border/20 overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20 bg-card/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Data de Criação
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/10 hover:bg-card/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {user.username}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {user.adm_bool ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            <Shield className="w-3 h-3" />
                            Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Usuário
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString(
                            'pt-BR'
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
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

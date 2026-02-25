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
import { Plus, Trash2, Edit2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Design: Modern Tech Dark Premium
 * - Cards com glassmorphism
 * - Ícones de ação inline
 * - Favoritos com estrela
 * - Diálogos modais
 */

interface Contact {
  id: number;
  name: string;
  phone_number: string;
  is_favorite: boolean;
  created_at: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
  });
  const { request } = useApi();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await request<Contact[]>('/api/contacts');
      setContacts(data);
    } catch (err) {
      toast.error('Erro ao carregar contatos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await request(`/api/contacts/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success('Contato atualizado com sucesso');
      } else {
        await request('/api/contacts', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('Contato criado com sucesso');
      }
      setIsOpen(false);
      resetForm();
      fetchContacts();
    } catch (err) {
      toast.error('Erro ao salvar contato');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este contato?')) return;

    try {
      await request(`/api/contacts/${id}`, { method: 'DELETE' });
      toast.success('Contato deletado com sucesso');
      fetchContacts();
    } catch (err) {
      toast.error('Erro ao deletar contato');
    }
  };

  const handleToggleFavorite = async (contact: Contact) => {
    try {
      await request(`/api/contacts/${contact.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...contact,
          is_favorite: !contact.is_favorite,
        }),
      });
      fetchContacts();
    } catch (err) {
      toast.error('Erro ao atualizar favorito');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      phone_number: contact.phone_number,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone_number: '',
    });
    setEditingId(null);
  };

  const favorites = contacts.filter((c) => c.is_favorite);
  const others = contacts.filter((c) => !c.is_favorite);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Contatos
            </h2>
            <p className="text-muted-foreground">
              Gerencie seus contatos frequentes
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => resetForm()}
              >
                <Plus className="w-4 h-4" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/20">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Contato' : 'Novo Contato'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Atualize as informações do contato'
                    : 'Adicione um novo contato'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nome do contato"
                    required
                    className="bg-input/50 border-border/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Número de Telefone
                  </label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone_number: e.target.value,
                      })
                    }
                    placeholder="+55 11 99999-9999"
                    required
                    className="bg-input/50 border-border/30"
                  />
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
            <p className="text-muted-foreground">Carregando contatos...</p>
          </Card>
        ) : contacts.length === 0 ? (
          <Card className="glass p-8 text-center border-border/20">
            <p className="text-muted-foreground mb-4">
              Nenhum contato adicionado
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {favorites.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Favoritos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((contact) => (
                    <Card
                      key={contact.id}
                      className="glass p-4 border-border/20 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {contact.name}
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            {contact.phone_number}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFavorite(contact)}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </button>
                          <button
                            onClick={() => handleEdit(contact)}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {others.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Outros Contatos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {others.map((contact) => (
                    <Card
                      key={contact.id}
                      className="glass p-4 border-border/20 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {contact.name}
                          </h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            {contact.phone_number}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFavorite(contact)}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            <Star className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleEdit(contact)}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

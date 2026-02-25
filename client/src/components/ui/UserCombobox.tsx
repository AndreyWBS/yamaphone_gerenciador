import { useEffect, useState, useId } from "react";
import { useApi } from "@/hooks/useApi";
import { Combobox } from "@base-ui/react/combobox";
import { User } from "lucide-react";

interface User {
  id: number;
  username: string;
  adm_bool: boolean;
}


interface UserComboboxProps {
  value: number | null;
  onChange: (value: number) => void;
}
export default function UserCombobox({
  value,
  onChange,
}: UserComboboxProps) {
  const id = useId();
  const { request } = useApi();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await request<User[]>("/api/users");
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );

  const selectedUser = users.find((u) => u.id === selectedId) || null;

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {users.length === 0 ? (
        <option value="">Nenhuma opção disponível</option>
      ) : (
        users.map((opcao) => (
          <option
            key={opcao.id}
            value={opcao.id}
            className="bg-white text-black dark:bg-gray-800 dark:text-white"
          >
            {opcao.username}
          </option>
        ))
      )}
    </select>


  );
}

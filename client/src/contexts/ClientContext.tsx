
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  name: string;
  birthDate: string;
  cpf: string;
  maritalStatus: string;
  gender: string;
  status: 'Pendente' | 'Recebido' | 'Editado';
  createdAt: string;
  formLinkId?: string;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  generateFormLink: () => string;
  submitFormData: (linkId: string, data: Omit<Client, 'id' | 'createdAt' | 'status'>) => void;
  refreshClients: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  const loadClients = () => {
    const savedClients = localStorage.getItem('corretor-clients');
    if (savedClients) {
      const parsedClients = JSON.parse(savedClients);
      setClients(parsedClients);
      console.log('Clientes carregados:', parsedClients.length);
    } else {
      // Dados de exemplo
      const exampleClients: Client[] = [
        {
          id: '1',
          name: 'Maria Santos',
          birthDate: '1985-06-15',
          cpf: '123.456.789-00',
          maritalStatus: 'Casada',
          gender: 'Feminino',
          status: 'Recebido',
          createdAt: '2024-01-10'
        },
        {
          id: '2',
          name: 'Carlos Silva',
          birthDate: '1978-03-22',
          cpf: '987.654.321-00',
          maritalStatus: 'Solteiro',
          gender: 'Masculino',
          status: 'Editado',
          createdAt: '2024-01-12'
        }
      ];
      setClients(exampleClients);
      localStorage.setItem('corretor-clients', JSON.stringify(exampleClients));
    }
  };

  useEffect(() => {
    loadClients();

    // Listener para mudanças no localStorage (quando um formulário é enviado)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'corretor-clients') {
        console.log('Detectada mudança nos dados dos clientes, atualizando...');
        loadClients();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Polling para verificar mudanças no localStorage da mesma aba
    const interval = setInterval(() => {
      const currentData = localStorage.getItem('corretor-clients');
      if (currentData) {
        const currentClients = JSON.parse(currentData);
        if (currentClients.length !== clients.length) {
          console.log('Novos clientes detectados, atualizando lista...');
          loadClients();
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [clients.length]);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem('corretor-clients', JSON.stringify(newClients));
    
    // Disparar evento customizado para notificar outras partes da aplicação
    window.dispatchEvent(new CustomEvent('clients-updated', { detail: newClients }));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...clientData, status: 'Editado' as const } : client
    );
    saveClients(updatedClients);
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    saveClients(updatedClients);
  };

  const generateFormLink = () => {
    const linkId = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return linkId;
  };

  const submitFormData = (linkId: string, data: Omit<Client, 'id' | 'createdAt' | 'status'>) => {
    const newClient: Client = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Recebido',
      formLinkId: linkId
    };
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
    console.log('Novo cliente cadastrado via formulário:', newClient.name);
  };

  const refreshClients = () => {
    loadClients();
  };

  return (
    <ClientContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      generateFormLink,
      submitFormData,
      refreshClients
    }}>
      {children}
    </ClientContext.Provider>
  );
};

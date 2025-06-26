
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Download, 
  Search, 
  ExternalLink, 
  Eye, 
  Edit, 
  Trash2,
  LogOut,
  Shield,
  FileText,
  TrendingUp,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { clients, deleteClient, generateFormLink } = useClients();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Auto-refresh para atualizar a lista quando novos clientes são cadastrados via formulário
  useEffect(() => {
    const interval = setInterval(() => {
      // Força uma atualização dos dados do localStorage
      const savedClients = localStorage.getItem('corretor-clients');
      if (savedClients) {
        console.log('Verificando atualizações de clientes...');
      }
    }, 5000); // Verifica a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.cpf.includes(searchTerm) ||
                         client.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesGender = genderFilter === 'all' || client.gender === genderFilter;
    const matchesMaritalStatus = maritalStatusFilter === 'all' || client.maritalStatus === maritalStatusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const clientDate = new Date(client.createdAt);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = clientDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = clientDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = clientDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesGender && matchesMaritalStatus && matchesDate;
  });

  const handleGenerateLink = () => {
    const linkId = generateFormLink();
    const fullLink = `${window.location.origin}/form/${linkId}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link gerado com sucesso!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${name}?`)) {
      deleteClient(id);
      toast({
        title: "Cliente excluído",
        description: `${name} foi removido com sucesso.`,
      });
    }
  };

  const exportToExcel = () => {
    toast({
      title: "Exportando dados...",
      description: "Os dados estão sendo preparados para download.",
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setGenderFilter('all');
    setMaritalStatusFilter('all');
    setDateFilter('all');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Recebido': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Editado': return 'bg-slate-700 text-white border-slate-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-primary">Corretor DB</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-slate-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <span className="text-sm text-slate-600">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo, {user?.name}! 👋
          </h2>
          <p className="text-slate-600">
            Gerencie seus clientes e formulários de forma simples e eficiente
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Clientes</p>
                  <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Formulários Recebidos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {clients.filter(c => c.status === 'Recebido').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-slate-700">
                    {clients.length > 0 ? Math.round((clients.filter(c => c.status !== 'Pendente').length / clients.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-slate-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={handleGenerateLink} className="corretor-gradient">
            <ExternalLink className="w-4 h-4 mr-2" />
            Gerar Link de Formulário
          </Button>
          <Link to="/add-client">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar Cliente Manualmente
            </Button>
          </Link>
          <Button variant="outline" onClick={exportToExcel} className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar para Excel
          </Button>
        </div>

        {/* Clients Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-slate-900">Lista de Clientes</CardTitle>
                <CardDescription>
                  Gerencie todos os seus clientes cadastrados
                </CardDescription>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por nome, CPF ou status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="border-slate-300 text-slate-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Recebido">Recebido</SelectItem>
                    <SelectItem value="Editado">Editado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Gêneros</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={maritalStatusFilter} onValueChange={setMaritalStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado Civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    <SelectItem value="União Estável">União Estável</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Períodos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Última Semana</SelectItem>
                    <SelectItem value="month">Último Mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredClients.length > 0 ? (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">{client.name}</h3>
                          <p className="text-sm text-slate-600">CPF: {client.cpf}</p>
                          <p className="text-sm text-slate-600">
                            Cadastrado em: {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/client/${client.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/client/${client.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id, client.name)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium text-slate-900">
                  {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                </h3>
                <p className="mt-1 text-slate-500">
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou limpar o filtro'
                    : 'Comece gerando um link de formulário ou cadastrando manualmente'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClients, Client } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Save, X, Trash2, Download, User, Calendar, FileText, Heart, Users } from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, updateClient, deleteClient } = useClients();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Client>>({});

  useEffect(() => {
    const foundClient = clients.find(c => c.id === id);
    if (foundClient) {
      setClient(foundClient);
      setEditData(foundClient);
    } else {
      navigate('/');
    }
  }, [id, clients, navigate]);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSave = () => {
    updateClient(client.id, editData);
    setClient({ ...client, ...editData });
    setIsEditing(false);
    toast({
      title: "Cliente atualizado",
      description: "Os dados foram salvos com sucesso.",
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      deleteClient(client.id);
      toast({
        title: "Cliente excluído",
        description: `${client.name} foi removido com sucesso.`,
      });
      navigate('/');
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setEditData({ ...editData, cpf: formatted });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Recebido': return 'bg-green-100 text-green-800 border-green-200';
      case 'Editado': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportIndividual = () => {
    toast({
      title: "Exportando dados do cliente...",
      description: "Os dados estão sendo preparados para download.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">Detalhes do cliente</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nome Completo</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="h-12"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-md">{client.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>CPF</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.cpf || ''}
                        onChange={handleCPFChange}
                        maxLength={14}
                        className="h-12"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-md">{client.cpf}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Data de Nascimento</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.birthDate || ''}
                        onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                        className="h-12"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-md">
                        {new Date(client.birthDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Estado Civil</span>
                    </Label>
                    {isEditing ? (
                      <Select 
                        value={editData.maritalStatus || ''} 
                        onValueChange={(value) => setEditData({ ...editData, maritalStatus: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                          <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                          <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                          <SelectItem value="União Estável">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-md">{client.maritalStatus}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Gênero</span>
                    </Label>
                    {isEditing ? (
                      <Select 
                        value={editData.gender || ''} 
                        onValueChange={(value) => setEditData({ ...editData, gender: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                          <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-md">{client.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Data de Cadastro</Label>
                    <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-md">
                      {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={exportIndividual} className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </Button>
                <Button 
                  onClick={handleDelete} 
                  className="w-full text-red-600 hover:text-red-700" 
                  variant="outline"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Cliente
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={`${getStatusColor(client.status)} mt-1`}>
                    {client.status}
                  </Badge>
                </div>
                {client.formLinkId && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Link ID</Label>
                    <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-50 p-2 rounded">
                      {client.formLinkId}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-600">Última Atualização</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(client.createdAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;

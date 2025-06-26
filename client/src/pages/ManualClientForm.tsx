
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, X, User, Calendar, FileText, Heart, Users } from 'lucide-react';

const ManualClientForm = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    cpf: '',
    maritalStatus: '',
    gender: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addClient({
        ...formData,
        status: 'Editado'
      });
      
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: "O cliente foi adicionado à sua lista.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Cliente Manualmente</h1>
            <p className="text-gray-600">Adicione um novo cliente ao seu sistema</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Dados do Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Nome Completo</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o nome completo do cliente"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Data de Nascimento</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>CPF</span>
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  maxLength={14}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Estado Civil</span>
                </Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    <SelectItem value="União Estável">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Gênero</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                    <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 h-12 corretor-gradient hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Cliente"}
                </Button>
                <Link to="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full h-12">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Todos os campos são obrigatórios. Certifique-se de que as informações 
                estejam corretas antes de salvar, pois elas poderão ser editadas posteriormente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualClientForm;

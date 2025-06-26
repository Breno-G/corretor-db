
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Calendar, FileText, Heart, Users } from 'lucide-react';

const ClientForm = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { submitFormData } = useClients();
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
      if (!linkId) {
        throw new Error('Link inválido');
      }

      submitFormData(linkId, formData);
      
      toast({
        title: "Dados enviados com sucesso!",
        description: "Seus dados foram recebidos pelo corretor.",
      });
      
      navigate('/form-success');
    } catch (error) {
      toast({
        title: "Erro ao enviar dados",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formulário de Cadastro</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Preencha seus dados com segurança. Todas as informações são criptografadas e 
            enviadas diretamente para seu corretor de seguros.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Dados Pessoais</span>
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
                    placeholder="Digite seu nome completo"
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
                      <SelectValue placeholder="Selecione seu estado civil" />
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
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                      <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 corretor-gradient hover:opacity-90 transition-opacity text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando dados..." : "Enviar Dados"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Seus dados estão seguros</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Utilizamos criptografia de ponta para proteger suas informações pessoais.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;

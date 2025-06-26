
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Shield, ArrowLeft } from 'lucide-react';

const ClientFormSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-0">
            <CardContent className="p-12">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Dados Enviados com Sucesso! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Obrigado! Seus dados foram enviados com sucesso ao seu corretor de seguros.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-3 text-green-700">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Dados protegidos por criptografia</span>
                </div>
                <p className="text-gray-600">
                  Seu corretor entrará em contato em breve para dar continuidade ao processo.
                  Todas as suas informações foram transmitidas de forma segura.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">O que acontece agora?</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Seu corretor recebeu seus dados automaticamente</li>
                  <li>• As informações estão sendo processadas</li>
                  <li>• Você será contatado em breve com as opções de seguro</li>
                  <li>• Mantenha seus documentos em mãos para agilizar o processo</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Esta página pode ser fechada com segurança.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao início
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientFormSuccess;

export interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  servico: string;
  data: string;
  horario: string;
  observacoes?: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  criadoEm: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'admin';
}
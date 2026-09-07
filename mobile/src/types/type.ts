export interface MonoStatement {
  id: string;
  time: number;
  description: string;
  mcc: number;
  originalMcc: number;
  hold: boolean;
  amount: number; // Сумма в копейках (напр. -599 = -5.99 UAH)
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment?: string;
  receiptId?: string;
}
export interface UserAccount {
    name: string;
    email: string;
    login: string;
    type: string;
    id: string;
}
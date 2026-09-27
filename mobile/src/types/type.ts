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
export type MonoCardProps = {
  variant: "MONOBANK_SUM";
  id: string;
  monoDataFromStore?: MonoData;

  balance: number;
  currencyCode: number;
  maskedPan: string[];
};
export type BankNotification = {
  id: string;
  packageName: string;
  title: string | null;
  text: string | null;
  timestamp: number;
};
export type OtherCardProps = {
  variant: "OTHER";
  id: string;
  balance: number;
  provider: string;
  currency: string;

  displayNumber: string | null;
  displayExpiry: string | null;
};
export interface MonoAccount {
  id?: string;
  balance: number;
  currencyCode: number;
  maskedPan: string[];
  iban: string;
  type: string;
  sendId: string;
  clientId: string;
  monoDataFromStore?: string
  // ... інші поля за потреби
}
export interface BankAccount {
  id: string;
  type?: string
  name: string;
  provider: string;
  amount?: string
  date?: string
  balance: string | number; // Prisma Decimal приходит как строка
  currency: string;
description?:string
  bankAccountId: string;

  displayNumber: string | null;
  displayExpiry: string | null;
  last4: string | null;

  userId: string;
}
export interface MonoData {
  clientId?: string;
  name?: string;
  accounts: MonoAccount[];
}
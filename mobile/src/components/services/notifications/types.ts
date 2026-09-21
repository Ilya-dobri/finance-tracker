export type BankNotification = {
  packageName: string;
  title: string | null;
  text: string | null;
  timestamp: number;
};

export type ParsedTransaction = {
  amount: number;
  type: "expense" | "income";
  description: string;
  date: string;
};
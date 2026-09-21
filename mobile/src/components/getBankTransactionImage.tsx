import React from "react";
import {
  BanknoteArrowUp,
  CreditCard,
  CreditCardPlus,
} from "lucide-react-native";

type TransactionType = "income" | "expense";

type GetBankTransactionIconProps = {
  description: string;
  type: TransactionType;
};

export const getBankTransactionIcon = ({
  description,
  type,
}: GetBankTransactionIconProps): React.ReactElement => {
  const text = description.toLowerCase();

  if (text.includes("зарахування") || type === "income") {
    return (
      <CreditCardPlus
        width={28}
        height={28}
        color="white"
      />
    );
  }

  if (text.includes("переказ") || type === "expense") {
    return (
      <BanknoteArrowUp
        width={28}
        height={28}
        color="white"
      />
    );
  }

  return (
    <CreditCard
      width={28}
      height={28}
      color="white"
    />
  );
};
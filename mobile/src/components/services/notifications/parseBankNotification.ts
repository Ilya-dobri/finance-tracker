import {
  BankNotification,
  ParsedTransaction,
} from "./types";

export const parseBankNotification = (
  notification: BankNotification
): ParsedTransaction | null => {
  const text = notification.text;

  if (!text) {
    return null;
  }

  console.log("🔎 Parsing notification:", text);

  // Берём первую строку:
  // "-5₴ Переказ на Test"
  const firstLine = text.split("\n")[0].trim();

  const amountMatch = firstLine.match(
    /^([+-])\s*(\d+(?:[.,]\d{1,2})?)\s*(?:₴|UAH|грн\.?)/i
  );

  if (!amountMatch) {
    console.log(
      "❌ Amount not found in:",
      firstLine
    );

    return null;
  }

  const sign = amountMatch[1];

  const rawAmount = amountMatch[2]
    .replace(",", ".");

  const amount = Number(rawAmount);

  if (Number.isNaN(amount)) {
    console.log(
      "❌ Invalid amount:",
      rawAmount
    );

    return null;
  }

  const type =
    sign === "+"
      ? "income"
      : "expense";

  // Убираем "+5₴ " / "-5₴ "
  const description = firstLine
    .replace(
      /^([+-])\s*(\d+(?:[.,]\d{1,2})?)\s*(?:₴|UAH|грн\.?)\s*/i,
      ""
    )
    .trim();

  return {
    amount,
    type,
    description:
      description || "PrivatBank transaction",

    date: new Date(
      notification.timestamp
    ).toISOString(),
  };
};
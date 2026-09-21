import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "@/app/auth/login";
import { getNotifications } from "./getNotifications";
import { parseBankNotification } from "./parseBankNotification";

const supportedBanks = [
  "ua.privatbank.ap24",
];

export const syncNotifications = async (
  accountId: string
) => {
  const notifications = await getNotifications();

  if (!notifications.length) return;

  const bankNotifications = notifications.filter(
    (notification) =>
      supportedBanks.includes(notification.packageName) &&
      notification.text
  );

  if (!bankNotifications.length) return;

  console.log(
    "🏦 BANK NOTIFICATIONS:",
    bankNotifications
  );

  const token =
    await AsyncStorage.getItem("session_token");

  if (!token) return;

  for (const notification of bankNotifications) {
    const transaction =
      parseBankNotification(notification);

    if (!transaction) continue;

    console.log(
      "💳 PARSED TRANSACTION:",
      transaction
    );

    console.log(
      "🏦 ACCOUNT ID:",
      accountId
    );

    const response = await fetch(
      `${API_URL}/api/accounts/${accountId}/transactions`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(transaction),
      }
    );

    const data = await response.text();

    if (!response.ok) {
      console.log(
        "❌ transaction error:",
        data
      );

      continue;
    }

    console.log(
      "✅ Transaction created:",
      transaction
    );
  }
};
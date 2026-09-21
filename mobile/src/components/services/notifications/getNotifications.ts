import NotificationReader from "../../../../modules/notification-reader/src/NotificationReaderModule";

import { BankNotification } from "./types";

export const getNotifications = async (): Promise<BankNotification[]> => {
  const notifications =
    await NotificationReader.getPendingNotifications();

  return notifications;
};
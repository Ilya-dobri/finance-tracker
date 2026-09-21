import { NativeModule, requireNativeModule } from "expo";

export type BankNotification = {
  packageName: string;
  title: string | null;
  text: string | null;
  timestamp: number;
};

declare class NotificationReaderModule extends NativeModule<{}> {
  getPendingNotifications(): Promise<BankNotification[]>;
}

export default requireNativeModule<NotificationReaderModule>(
  "NotificationReader"
);
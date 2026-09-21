import { registerWebModule, NativeModule } from 'expo';

class NotificationReaderModule extends NativeModule<{}> {}

export default registerWebModule(NotificationReaderModule, 'NotificationReaderModule');

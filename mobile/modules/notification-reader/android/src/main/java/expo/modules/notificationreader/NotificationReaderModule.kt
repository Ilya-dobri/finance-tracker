package expo.modules.notificationreader

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NotificationReaderModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("NotificationReader")

        AsyncFunction("getPendingNotifications") {
            return@AsyncFunction NotificationReaderService.getNotifications()
        }
    }
}
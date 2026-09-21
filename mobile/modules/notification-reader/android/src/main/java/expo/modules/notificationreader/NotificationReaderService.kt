package expo.modules.notificationreader

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationReaderService :
    NotificationListenerService() {

    companion object {

        private val notifications =
            mutableListOf<Map<String, Any?>>()

        fun getNotifications():
            List<Map<String, Any?>> {

            synchronized(notifications) {

                val result =
                    notifications.toList()

                notifications.clear()

                Log.d(
                    "FinanceTracker",
                    "Returning ${result.size} notifications"
                )

                return result
            }
        }
    }

    override fun onListenerConnected() {
        super.onListenerConnected()

        Log.d(
            "FinanceTracker",
            "✅ Notification listener connected"
        )
    }

    override fun onNotificationPosted(
        sbn: StatusBarNotification
    ) {

        val notification =
            sbn.notification

        val extras =
            notification.extras

        val title =
            extras
                .getCharSequence(
                    Notification.EXTRA_TITLE
                )
                ?.toString()

        val text =
            extras
                .getCharSequence(
                    Notification.EXTRA_TEXT
                )
                ?.toString()

        val packageName =
            sbn.packageName

        val item = mapOf(
            "packageName" to packageName,
            "title" to title,
            "text" to text,
            "timestamp" to sbn.postTime
        )

        synchronized(notifications) {
            notifications.add(item)
        }

        Log.d(
            "FinanceTracker",
            """
            🔔 Notification received
            package=$packageName
            title=$title
            text=$text
            timestamp=${sbn.postTime}
            """.trimIndent()
        )
    }
}
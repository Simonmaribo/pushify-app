import React from 'react'
import * as Notifications from 'expo-notifications'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

export default function NotificationListener() {
	React.useEffect(() => {
		const subscription =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					const url =
						response?.notification?.request?.content?.data?.url
					if (!url) return
					//WebBrowser.openBrowserAsync(url)
					Linking.openURL(url)
				}
			)
		return () => subscription.remove()
	}, [])

	return null
}

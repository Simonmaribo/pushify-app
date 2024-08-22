import { useState } from 'react'
import PButton from '../elements/PButton'
import { getPushToken } from '@/helpers/push-token'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import client from '@/queries/api'
import { useSession } from '@/contexts/SessionContext'

export default function PushTokenButton() {
	const [submitting, setSubmitting] = useState(false)

	const { pushToken, setPushToken } = useSession()

	async function updatePushToken() {
		if (submitting) return
		setSubmitting(true)
		const pushToken = await askForNotificationPermission()
		if (!pushToken) {
			setSubmitting(false)
			return
		}

		await client
			.post(`/device/update`, {
				pushToken,
			})
			.then(() => {
				alert('Push token added!')
				setSubmitting(false)
				setPushToken(pushToken)
			})
			.catch((error) => {
				alert(`Error adding push token: ${error}`)
				setSubmitting(false)
			})
	}

	async function askForNotificationPermission() {
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			})
		}

		if (Device.isDevice) {
			const { status: existingStatus, ios } =
				await Notifications.getPermissionsAsync()

			let granted =
				existingStatus === 'granted' ||
				ios?.status == Notifications.IosAuthorizationStatus.AUTHORIZED

			if (
				Platform.OS == 'ios' &&
				ios &&
				ios.status == Notifications.IosAuthorizationStatus.DENIED
			) {
				alert('Please enable notifications in your settings')
				return null
			} else if (Platform.OS !== 'ios' && existingStatus === 'denied') {
				alert('Please enable notifications in your settings')
				return null
			}

			let finalStatus: Notifications.PermissionStatus = existingStatus
			let finalIosStatus:
				| Notifications.IosAuthorizationStatus
				| undefined = ios?.status
			if (!granted) {
				const { status, ios } =
					await Notifications.requestPermissionsAsync({
						ios: {
							allowAlert: true,
							allowBadge: true,
							allowSound: true,
							allowDisplayInCarPlay: true,
							allowCriticalAlerts: true,
							provideAppNotificationSettings: true,
							//allowProvisional: true,
							allowAnnouncements: true,
						},
					})
				finalStatus = status
				finalIosStatus = ios?.status
			}

			if (
				Platform.OS == 'ios' &&
				finalIosStatus !=
					Notifications.IosAuthorizationStatus.AUTHORIZED
			) {
				alert('Please enable notifications in your settings')
				return null
			} else if (Platform.OS !== 'ios' && finalStatus !== 'granted') {
				alert('Please enable notifications in your settings')
				return null
			}
			try {
				const pushToken = getPushToken()
				return pushToken
			} catch (error) {
				alert(`${error}`)
				return null
			}
		} else {
			alert('Must use physical device for push notifications')
			return null
		}
	}

	if (pushToken) {
		return null
	}

	return (
		<PButton
			label="Add push token"
			type="dark"
			onPress={updatePushToken}
			loading={submitting}
			disabled={submitting}
		/>
	)
}

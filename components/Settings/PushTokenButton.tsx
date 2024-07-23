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

	const { pushToken } = useSession()

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
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync()

			if (existingStatus === 'denied') {
				alert('Please enable Push Notifications in Settings!')
				return null
			}

			let finalStatus: Notifications.PermissionStatus = existingStatus
			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync({
					ios: {
						allowAlert: true,
						allowBadge: true,
						allowSound: true,
						allowDisplayInCarPlay: true,
						allowCriticalAlerts: true,
						provideAppNotificationSettings: true,
						allowProvisional: true,
						allowAnnouncements: true,
					},
				})
				finalStatus = status
			}

			if (finalStatus !== 'granted') {
				alert(
					'Permission not granted to get push token for push notification!'
				)
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

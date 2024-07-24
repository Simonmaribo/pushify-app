import { View, Image, Platform, Alert, ActivityIndicator } from 'react-native'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import PText from '@/components/elements/PText'
import PButton from '@/components/elements/PButton'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { getPushToken } from '@/helpers/push-token'
import client from '@/queries/api'
import getDeviceType from '@/helpers/device-type'
import { useSession } from '@/contexts/SessionContext'
import { useState } from 'react'
import { getDeviceId } from '@/helpers/device-info'

export default function SetupPage() {
	const router = useRouter()

	const { setToken, setPushToken } = useSession()
	const [submitting, setSubmitting] = useState(false)

	async function askForDeviceName() {
		if (Platform.OS === 'ios') {
			Alert.prompt('Device Name', 'Enter a name for this device', [
				{
					text: 'Continue',
					style: 'default',
					onPress: (value) => {
						setupDevice(value)
					},
				},
			])
		} else {
			setupDevice()
		}
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

	async function setupDevice(deviceName?: string) {
		if (submitting) return
		setSubmitting(true)
		const pushToken = await askForNotificationPermission()
		const uniqueDeviceId = await getDeviceId()

		const deviceInfo = {
			deviceName: deviceName ?? Device.deviceName ?? 'Unknown Device',
			deviceType: getDeviceType(),
			devicePlatform: Platform.OS.toUpperCase(),
			deviceYearClass: Device.deviceYearClass,
			deviceManufacturer: Device.manufacturer,
			deviceModelName: Device.modelName,
			deviceOsName: Device.osName,
			deviceOsVersion: Device.osVersion,
			pushToken: pushToken || undefined,
			uniqueDeviceId: uniqueDeviceId,
		}

		console.log('Device Info:', deviceInfo)

		try {
			await client.post('/device', deviceInfo)
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.error ||
				error?.message ||
				error?.error ||
				error ||
				'An unknown error occurred.'
			console.error(errorMessage)
			alert(errorMessage)
			setSubmitting(false)
			return
		}
		try {
			await client.refreshToken(uniqueDeviceId)
			setToken(uniqueDeviceId)
			setPushToken(pushToken)
			router.replace('/(tabs)')
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.error ||
				error?.message ||
				error?.error ||
				error ||
				'An unknown error occurred.'
			console.error(errorMessage)
			alert(errorMessage)
			setSubmitting(false)
			return
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
			{submitting && (
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator />
				</View>
			)}
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Image
					source={require('@/assets/imgs/logo.png')}
					style={{ width: 2958 / 10, height: 1024 / 10 }}
				/>
			</View>
			<View style={{ flex: 1, gap: 12, paddingHorizontal: 28 }}>
				<View style={{ marginBottom: 24 }}>
					<PText size="2xl" weight="semibold">
						Simple Push Notifications
					</PText>
					<PText color={Colors.gray}>
						Setup the device to get started. Allow Push
						Notifications for the best experience.
					</PText>
				</View>
				<PButton
					type="dark"
					trailingContent={
						<Ionicons name="arrow-forward" size={24} />
					}
					label="Setup this device"
					onPress={askForDeviceName}
					disabled={submitting}
					loading={submitting}
				/>
			</View>
		</SafeAreaView>
	)
}

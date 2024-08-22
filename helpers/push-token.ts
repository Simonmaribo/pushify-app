import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

export async function getPushToken() {
	return new Promise<string | null>(async (resolve, reject) => {
		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ??
			Constants?.easConfig?.projectId
		if (!projectId) {
			return reject('Project ID not found. Please try again.')
		}
		try {
			setTimeout(() => {
				reject('Timeout getting push token')
			}, 5000)
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data
			return resolve(pushTokenString)
		} catch (e: unknown) {
			return reject(`${e}`)
		}
	})
}

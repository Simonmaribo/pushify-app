import DeviceInfo from 'react-native-device-info'

export async function getDeviceId(): Promise<string> {
	return new Promise(async (resolve, reject) => {
		let device = await DeviceInfo.getUniqueId()
		while (device === null) {
			console.log('Device ID is null, retrying...')
			device = await DeviceInfo.getUniqueId()
		}

		resolve(device)
	})
}

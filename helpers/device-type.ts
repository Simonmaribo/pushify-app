import * as Device from 'expo-device'

export default function getDeviceType() {
	const type = Device.deviceType
	switch (type) {
		case 1:
			return 'PHONE'
		case 2:
			return 'TABLET'
		case 3:
			return 'DESKTOP'
		case 4:
			return 'TV'
		default:
			return 'Unknown'
	}
}

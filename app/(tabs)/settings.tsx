import PButton from '@/components/elements/PButton'
import { SafeAreaView, Text, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useSession } from '@/contexts/SessionContext'

export default function Settings() {
	const { setToken } = useSession()

	return (
		<View>
			<Text>Settings</Text>
			<PButton
				label="Set push token"
				onPress={() => {
					SecureStore.deleteItemAsync('token')
					setToken(null)
				}}
			/>
		</View>
	)
}

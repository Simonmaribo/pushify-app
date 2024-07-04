import PButton from '@/components/elements/PButton'
import { SafeAreaView, Text, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useSession } from '@/contexts/SessionContext'

export default function HomeScreen() {
	const { setToken } = useSession()
	return (
		<SafeAreaView>
			<Text>Hey</Text>

			<PButton
				label="Set push token"
				onPress={() => {
					SecureStore.deleteItemAsync('token')
					setToken(null)
				}}
			/>
		</SafeAreaView>
	)
}

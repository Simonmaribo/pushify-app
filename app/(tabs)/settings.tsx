import PButton from '@/components/elements/PButton'
import { SafeAreaView, Text, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useSession } from '@/contexts/SessionContext'
import PText from '@/components/elements/PText'

export default function Settings() {
	const { setToken } = useSession()

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
			<View
				style={{
					padding: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<PText size="3xl" weight="semibold">
					Settings
				</PText>
			</View>
			<View style={{ marginTop: 10 }}>
				<View
					style={{ justifyContent: 'center', alignItems: 'center' }}
				>
					<PButton
						label="Reset device"
						type="dark"
						onPress={() => {
							SecureStore.deleteItemAsync('token')
							setToken(null)
						}}
					/>
				</View>
			</View>
		</SafeAreaView>
	)
}

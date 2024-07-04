import { Link, Stack } from 'expo-router'
import { Text, View } from 'react-native'

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View>
				<Link href="/(tabs)">
					<Text>Go to home screen!</Text>
				</Link>
			</View>
		</>
	)
}

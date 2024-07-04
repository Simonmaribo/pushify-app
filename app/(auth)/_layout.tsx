import { useSession } from '@/contexts/SessionContext'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
	const { token } = useSession()

	if (token) {
		return <Redirect href="(tabs)" />
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
		</Stack>
	)
}

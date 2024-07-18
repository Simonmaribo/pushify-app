import { SessionProvider } from '@/contexts/SessionContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import { Asset } from 'expo-asset'
import {
	Poppins_100Thin,
	Poppins_200ExtraLight,
	Poppins_300Light,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	Poppins_800ExtraBold,
	Poppins_900Black,
} from '@expo-google-fonts/poppins'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Notifications from 'expo-notifications'
import NotificationListener from '@/components/NotificationListener'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnMount: false,
			refetchOnReconnect: true,
		},
	},
})

export default function RootLayout() {
	const [isReady, setReady] = useState(false)

	useEffect(() => {
		async function prepare() {
			try {
				// Pre-load fonts, make any API calls you need to do here
				await Font.loadAsync({
					Poppins100: Poppins_100Thin,
					Poppins200: Poppins_200ExtraLight,
					Poppins300: Poppins_300Light,
					Poppins400: Poppins_400Regular,
					Poppins500: Poppins_500Medium,
					Poppins600: Poppins_600SemiBold,
					Poppins700: Poppins_700Bold,
					Poppins800: Poppins_800ExtraBold,
					Poppins900: Poppins_900Black,
				})

				const images: string[] = [
					/*require('../assets/icon.png')*/
				]
				images.map(async (image) => {
					await Asset.fromModule(image).downloadAsync()
				})
			} catch (e) {
				console.warn(e)
				throw e
			} finally {
				setReady(true)
			}
		}

		prepare()
	}, [isReady])

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
		}),
	})

	if (!isReady) {
		return null
	}

	return (
		<GestureHandlerRootView>
			<NotificationListener />
			<StatusBar style="dark" />
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="(auth)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="+not-found" />
					</Stack>
				</SessionProvider>
			</QueryClientProvider>
		</GestureHandlerRootView>
	)
}

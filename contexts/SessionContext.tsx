import React, { useEffect } from 'react'
import { useStorageState } from '@/hooks/useStorageState'
import { SplashScreen } from 'expo-router'

type AuthContextType = {
	setToken: (token: string | null) => void
	setPushToken: (pushToken: string | null) => void
	pushToken?: string | null
	token?: string | null
	isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType>({
	setToken: () => {},
	setPushToken: () => {},
	token: null,
	pushToken: null,
	isLoading: true,
})

// This hook can be used to access the user info.
export function useSession() {
	const value = React.useContext(AuthContext)
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error(
				'useSession must be wrapped in a <SessionProvider />'
			)
		}
	}
	return value
}

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isTokenLoading, token], setToken] = useStorageState('token')
	const [[isPushTokenLoading, pushToken], setPushToken] =
		useStorageState('pushToken')

	const isLoading = isTokenLoading || isPushTokenLoading

	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hideAsync()
		}
	}, [isLoading])

	if (isLoading) {
		return null
	}

	return (
		<AuthContext.Provider
			value={{
				setToken,
				setPushToken,
				token,
				pushToken,
				isLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

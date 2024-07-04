import React, { useEffect } from 'react'
import { useStorageState } from '@/hooks/useStorageState'
import { SplashScreen } from 'expo-router'

type AuthContextType = {
	setToken: (token: string | null) => void
	token?: string | null
	isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType>({
	setToken: () => {},
	token: null,
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
	const [[isLoading, token], setToken] = useStorageState('token')

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
				token,
				isLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

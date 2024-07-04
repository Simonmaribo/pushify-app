import { Redirect, Tabs } from 'expo-router'
import React from 'react'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import Colors from '@/constants/Colors'
import { useSession } from '@/contexts/SessionContext'

export default function TabLayout() {
	const { token, isLoading } = useSession()

	if (!token) {
		return <Redirect href="(auth)" />
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary,
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'home' : 'home-outline'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: 'Explore',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'code-slash' : 'code-slash-outline'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	)
}

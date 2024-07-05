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
					title: 'Channels',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={
								focused
									? 'file-tray-full'
									: 'file-tray-full-outline'
							}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="messages"
				options={{
					title: 'Messages',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={
								focused
									? 'chatbox-ellipses'
									: 'chatbox-ellipses-outline'
							}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'settings' : 'settings-outline'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	)
}

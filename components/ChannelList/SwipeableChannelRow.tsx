import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { FlatList, RectButton } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import PText from '../elements/PText'
import { FontAwesome5 } from '@expo/vector-icons'
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow'
import unsubscribe from '@/queries/channels/unsubscribe'
import { useQueryClient } from '@tanstack/react-query'
import { timeDifferenceShort } from '@/helpers/date'

type SwipeableChannelRowProps = {
	id: string
	name: string
	lastMessage: Date | null
}

export default function SwipeableChannelRow({
	item,
}: {
	item: SwipeableChannelRowProps
}) {
	const queryClient = useQueryClient()

	async function handleUnsubscribe() {
		console.log('Unsubscribing from channel', item.id)
		await unsubscribe({
			subscriptionId: item.id,
		})
			.then(() => {
				queryClient.invalidateQueries({
					queryKey: ['channels'],
				})
				alert('Successfully unsubscribed from channel')
			})
			.catch((error) => alert(error))
	}

	return (
		<AppleStyleSwipeableRow
			actions={[
				{
					text: 'Delete',
					icon: 'trash',
					color: '#f43f5e',
					onClick: handleUnsubscribe,
				},
			]}
		>
			<View
				style={{
					flex: 1,
					paddingVertical: 10,
					paddingHorizontal: 20,
					gap: 18,
					alignItems: 'center',
					flexDirection: 'row',
					backgroundColor: '#fafafa',
				}}
			>
				<View
					style={{
						padding: 12,
						backgroundColor: Colors.dimmed,
						borderRadius: 8,
					}}
				>
					<FontAwesome5 name="hashtag" size={24} />
				</View>
				<View>
					<PText weight="semibold" size="lg">
						{item.name}
					</PText>
					<PText color={'#6b7280'}>
						{item.lastMessage
							? `Last message received ${timeDifferenceShort(
									new Date(),
									item.lastMessage
							  )} ago`
							: 'No messages yet'}
					</PText>
				</View>
			</View>
		</AppleStyleSwipeableRow>
	)
}

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { FlatList, RectButton } from 'react-native-gesture-handler'

import Colors from '@/constants/Colors'
import PText from '../elements/PText'
import { FontAwesome5 } from '@expo/vector-icons'
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow'

type SwipeableChannelRowProps = {
	name: string
}
function Row({ item }: { item: SwipeableChannelRowProps }) {
	return (
		<RectButton
			style={{
				flex: 1,
				paddingVertical: 10,
				paddingHorizontal: 20,
				gap: 18,
				alignItems: 'center',
				flexDirection: 'row',
				backgroundColor: Colors.background,
			}}
			onPress={() => window.alert(item.name)}
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
				<PText color={'#6b7280'}>Last message received 5d ago</PText>
			</View>
		</RectButton>
	)
}

export default function SwipeableChannelRow({
	item,
}: {
	item: SwipeableChannelRowProps
}) {
	return (
		<AppleStyleSwipeableRow>
			<Row item={item} />
		</AppleStyleSwipeableRow>
	)
}

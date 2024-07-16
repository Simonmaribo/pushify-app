import {
	ActivityIndicator,
	Button,
	FlatList,
	RefreshControl,
	SafeAreaView,
	View,
} from 'react-native'
import PText from '@/components/elements/PText'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import getChannels from '@/queries/channels/getChannels'
import Colors from '@/constants/Colors'
import React, { useState } from 'react'
import Dialog from 'react-native-dialog'
import subscribeToChannel from '@/queries/channels/subscribeToChannel'
import SwipeableChannelRow from '@/components/ChannelList/SwipeableChannelRow'
import PButton from '@/components/elements/PButton'

export default function HomeScreen() {
	const [showDialog, setShowDialog] = useState(false)
	const [channelCode, setChannelCode] = useState('')
	const queryClient = useQueryClient()

	const { data, isLoading, isError, error, isRefetching, refetch } = useQuery(
		{
			queryKey: ['channels'],
			queryFn: async () => await getChannels(),
		}
	)

	function openDialog() {
		setShowDialog(true)
		setChannelCode('')
	}

	async function handleSubmit() {
		if (!channelCode) return alert('Please enter a channel code')

		await subscribeToChannel({
			code: channelCode,
		})
			.then(() => {
				setShowDialog(false)
				queryClient.invalidateQueries({
					queryKey: ['channels'],
				})
				alert('Successfully subscribed to channel')
			})
			.catch((error) => alert(error))
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
			{isLoading ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator />
				</View>
			) : isError || !data ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<PText size="2xl" weight="medium" color={Colors.error}>
						Error
					</PText>
					<PText color={Colors.error}>{`${
						error || 'An error occurred'
					}`}</PText>
				</View>
			) : (
				<React.Fragment>
					<View
						style={{
							padding: 16,
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}
					>
						<PText size="3xl" weight="semibold">
							Channels
						</PText>
						<Button title="Add channel" onPress={openDialog} />
					</View>
					{data.length > 0 ? (
						<FlatList
							data={data}
							renderItem={({ item }) => (
								<SwipeableChannelRow item={item} />
							)}
							keyExtractor={(item) => item.id}
							refreshControl={
								<RefreshControl
									refreshing={isRefetching}
									onRefresh={refetch}
								/>
							}
							ItemSeparatorComponent={() => (
								<View
									style={{
										height: 1,
										backgroundColor: '#e5e5e5',
									}}
								/>
							)}
						/>
					) : (
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								paddingHorizontal: 16,
							}}
						>
							<PText size="xl" weight="medium">
								No channels found.
							</PText>
							<PText
								color={Colors.gray}
								style={{ textAlign: 'center' }}
							>
								Click{' '}
								<PText color={Colors.primary}>
									"Add channel"
								</PText>{' '}
								to subscribe to a channel and start receiving
								messages.
							</PText>
							<View style={{ marginTop: 24 }}>
								<Button
									title="Add your first channel"
									onPress={openDialog}
								/>
							</View>
						</View>
					)}
					<View>
						<Dialog.Container
							visible={showDialog}
							onBackdropPress={() => setShowDialog(false)}
						>
							<Dialog.Title>Subscribe to channel</Dialog.Title>
							<Dialog.Description>
								Enter the channel code to subscribe to messages
								from the channel.
							</Dialog.Description>
							<Dialog.Input
								autoFocus={true}
								//codeLength={8}
								keyboardType="number-pad"
								onChangeText={(text) => setChannelCode(text)}
							/>
							<Dialog.Button
								label="Cancel"
								onPress={() => setShowDialog(false)}
							/>
							<Dialog.Button
								label="Connect"
								bold
								onPress={handleSubmit}
							/>
						</Dialog.Container>
					</View>
				</React.Fragment>
			)}
		</SafeAreaView>
	)
}

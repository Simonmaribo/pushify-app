import PText from '@/components/elements/PText'
import MessageRow from '@/components/MessageList/MessageRow'
import Colors from '@/constants/Colors'
import getMessages from '@/queries/messages/getMessages'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React from 'react'
import {
	View,
	SafeAreaView,
	RefreshControl,
	FlatList,
	ActivityIndicator,
	Button,
} from 'react-native'

export default function Messages() {
	const { data, isLoading, isError, error, isRefetching, refetch } = useQuery(
		{
			queryKey: ['messages'],
			queryFn: async () => await getMessages(),
		}
	)
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
							Messages
						</PText>
					</View>
					{data.length > 0 ? (
						<FlatList
							data={data}
							renderItem={({ item }) => (
								<MessageRow message={item} />
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
								No messages received
							</PText>
							<PText
								color={Colors.gray}
								style={{ textAlign: 'center' }}
							>
								You have not received any messages yet. Start by
								adding a channel.
							</PText>
							<View style={{ marginTop: 24 }}>
								<Button
									title="Go to channels"
									onPress={() => {
										router.replace(`/(tabs)`)
									}}
								/>
							</View>
						</View>
					)}
				</React.Fragment>
			)}
		</SafeAreaView>
	)
}

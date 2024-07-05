import Colors from '@/constants/Colors'
import { FontAwesome5 } from '@expo/vector-icons'
import React, { Component, PropsWithChildren } from 'react'
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native'

import { RectButton, Swipeable } from 'react-native-gesture-handler'

export default class AppleStyleSwipeableRow extends Component<
	PropsWithChildren<unknown>
> {
	private renderRightAction = (
		text: string,
		icon: string,
		color: string,
		x: number,
		progress: Animated.AnimatedInterpolation<number>
	) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [x, 0],
		})
		const pressHandler = () => {
			this.close()
			// eslint-disable-next-line no-alert
			window.alert(text)
		}

		return (
			<Animated.View
				style={{ flex: 1, transform: [{ translateX: trans }] }}
			>
				<RectButton
					style={[styles.rightAction, { backgroundColor: color }]}
					onPress={pressHandler}
				>
					<FontAwesome5 name={icon} size={18} color="white" />
					<Text style={styles.actionText}>{text}</Text>
				</RectButton>
			</Animated.View>
		)
	}

	private renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		_dragAnimatedValue: Animated.AnimatedInterpolation<number>
	) => (
		<View
			style={{
				width: 192,
				flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
			}}
		>
			{this.renderRightAction(
				'Delete',
				'trash',
				Colors.error,
				64,
				progress
			)}
		</View>
	)

	private swipeableRow?: Swipeable

	private updateRef = (ref: Swipeable) => {
		this.swipeableRow = ref
	}
	private close = () => {
		this.swipeableRow?.close()
	}
	render() {
		const { children } = this.props
		return (
			<Swipeable
				ref={this.updateRef}
				friction={2}
				enableTrackpadTwoFingerGesture
				leftThreshold={30}
				rightThreshold={40}
				renderRightActions={this.renderRightActions}
				onSwipeableOpen={(direction) => {
					console.log(`Opening swipeable from the ${direction}`)
				}}
				onSwipeableClose={(direction) => {
					console.log(`Closing swipeable to the ${direction}`)
				}}
			>
				{children}
			</Swipeable>
		)
	}
}

const styles = StyleSheet.create({
	leftAction: {
		flex: 1,
		backgroundColor: '#497AFC',
		justifyContent: 'center',
	},
	actionText: {
		color: 'white',
		fontSize: 14,
		backgroundColor: 'transparent',
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
})

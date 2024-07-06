import Colors from '@/constants/Colors'
import { FontAwesome5 } from '@expo/vector-icons'
import React, { ComponentProps, useRef } from 'react'
import { Animated, Text, View, I18nManager } from 'react-native'

import { RectButton, Swipeable } from 'react-native-gesture-handler'
import PText from '../elements/PText'
import unsubscribe from '@/queries/channels/unsubscribe'
import { IconProps } from '@expo/vector-icons/build/createIconSet'

type Action = {
	text: string
	icon: ComponentProps<typeof FontAwesome5>['name']
	color: string
	onClick: () => void
}

type AppleStyleSwipeableRowProps = {
	children: React.ReactNode
	actions?: Action[]
}

export default function AppleStyleSwipeableRow({
	children,
	actions,
}: AppleStyleSwipeableRowProps) {
	const swipeableRowRef = useRef<Swipeable>(null)

	const renderRightAction = (
		action: Action,
		x: number,
		progress: Animated.AnimatedInterpolation<number>
	) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [x, 0],
		})
		const pressHandler = async () => {
			close()
			action?.onClick()
		}

		return (
			<Animated.View
				key={action.text}
				style={{ flex: 1, transform: [{ translateX: trans }] }}
			>
				<RectButton
					style={{
						alignItems: 'center',
						flex: 1,
						justifyContent: 'center',
						backgroundColor: action.color,
					}}
					onPress={pressHandler}
				>
					<FontAwesome5 name={action.icon} size={18} color="white" />
					<PText color="white" weight="medium">
						{action.text}
					</PText>
				</RectButton>
			</Animated.View>
		)
	}

	const renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		_dragAnimatedValue: Animated.AnimatedInterpolation<number>
	) => (
		<View
			style={{
				width: 192,
				flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
			}}
		>
			{actions?.map((action, index) =>
				renderRightAction(action, 64 * (index + 1), progress)
			)}
		</View>
	)

	const close = () => {
		swipeableRowRef.current?.close()
	}

	return (
		<Swipeable
			ref={swipeableRowRef}
			friction={2}
			enableTrackpadTwoFingerGesture
			leftThreshold={30}
			rightThreshold={40}
			renderRightActions={renderRightActions}
			key={1}
		>
			{children}
		</Swipeable>
	)
}

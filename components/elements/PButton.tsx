import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import PText from '../elements/PText'
import Colors from '@/constants/Colors'

export type PButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
	label?: string
	leadingContent?: React.ReactNode
	trailingContent?: React.ReactNode
	loading?: boolean
	size?: 'sm' | 'md' | 'lg'
	type?: 'primary' | 'secondary' | 'ghost' | 'dark'
	iconOnly?: boolean
}

export default function PButton({
	label,
	type = 'primary',
	leadingContent,
	trailingContent,
	size = 'md',
	...props
}: PButtonProps) {
	return (
		<TouchableOpacity
			disabled={props.loading || props.disabled}
			activeOpacity={props.loading ? 0.5 : 0.5}
			{...props}
			style={[
				PButtonStyles.base,
				PButtonStyles.padding[size],
				PButtonStyles[type],
				props.disabled && PButtonStyles.disabled,
				props.iconOnly && {
					width: PButtonStyles['iconOnly'][size],
					height: PButtonStyles['iconOnly'][size],
					padding: 0,
				},
				props.loading && { opacity: 0.5 },
				props.style,
			]}
		>
			{props.loading ? (
				<ActivityIndicator color={PButtonStyles[type].color} />
			) : (
				<React.Fragment>
					{leadingContent && (
						<Text style={{ color: PButtonStyles[type].color }}>
							{leadingContent}
						</Text>
					)}
					{label && (
						<PText
							size={size}
							color={PButtonStyles[type].color}
							weight="medium"
						>
							{label}
						</PText>
					)}
					{trailingContent && (
						<Text style={{ color: PButtonStyles[type].color }}>
							{trailingContent}
						</Text>
					)}
				</React.Fragment>
			)}
		</TouchableOpacity>
	)
}

export const PButtonStyles: Record<string, any> = {
	base: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		borderRadius: 32,
	},
	padding: {
		sm: { padding: 8 },
		md: { padding: 12 },
		lg: { padding: 16 },
	},
	iconOnly: {
		sm: 32,
		md: 48,
		lg: 64,
	},
	primary: {
		backgroundColor: Colors.primary,
		color: Colors.black,
	},
	secondary: {
		backgroundColor: Colors.white,
		color: Colors.black,
		borderWidth: 2,
		borderColor: Colors.dimmed,
	},
	ghost: {
		color: Colors.black,
	},
	dark: {
		backgroundColor: Colors.black,
		color: Colors.white,
	},
	disabled: {
		opacity: 0.5,
	},
}

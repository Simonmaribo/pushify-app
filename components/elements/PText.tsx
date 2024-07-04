import { Text } from 'react-native'

export type PTextProps = {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
	weight?: 'normal' | 'medium' | 'semibold' | 'bold'
	color?: string
} & React.ComponentProps<typeof Text>

const sizes = {
	xs: {
		fontSize: 12,
		lineHeight: 16,
	},
	sm: {
		fontSize: 14,
		lineHeight: 20,
	},
	md: {
		fontSize: 16,
		lineHeight: 24,
	},
	lg: {
		fontSize: 18,
		lineHeight: 24,
	},
	xl: {
		fontSize: 20,
		lineHeight: 28,
	},
	'2xl': {
		fontSize: 24,
		lineHeight: 32,
	},
	'3xl': {
		fontSize: 30,
		lineHeight: 40,
	},
}

const font = {
	normal: 'Poppins400',
	medium: 'Poppins500',
	semibold: 'Poppins600',
	bold: 'Poppins700',
}

export default function PText({
	size = 'md',
	weight = 'normal',
	color = '#0D0E0F',
	style,
	...props
}: PTextProps) {
	return (
		<Text
			{...props}
			style={[
				{
					fontSize: sizes[size].fontSize,
					lineHeight: sizes[size].lineHeight,
					color,
					fontFamily: font[weight],
				},
				style,
			]}
		/>
	)
}

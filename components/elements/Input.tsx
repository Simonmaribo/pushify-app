import { forwardRef } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import { useFormField } from '@/components/elements/Form'
import PText from '@/components/elements/PText'

export interface InputProps extends TextInputProps {
	label?: string
	description?: string
	error?: string
	required?: boolean
	leadingContent?: React.ReactNode
}

const BaseInput = forwardRef<TextInput, InputProps>(
	({ label, description, error, required, ...props }, ref) => {
		return (
			<View
				style={[
					{
						gap: 8,
					},
					props.style,
				]}
			>
				{label || description ? (
					<View>
						{label && (
							<PText size="md" weight="medium">
								{label}
							</PText>
						)}
						{description ? (
							<PText size="sm" style={{ color: '#888888' }}>
								{description}
							</PText>
						) : null}
					</View>
				) : null}
				<View
					style={[
						{
							borderRadius: 16,
							paddingHorizontal: 20,
							paddingVertical: 12,
							backgroundColor: '#f0f0f0',
							borderWidth: 1,
							borderColor: '#e0e0e0',
						},
						error
							? {
									borderColor: '#ff0000',
							  }
							: null,
					]}
				>
					<TextInput
						{...props}
						ref={ref}
						style={{
							fontSize: 16,
							fontFamily: 'Inter500',
						}}
						placeholderTextColor={'#888888'}
					/>
				</View>
				{error ? (
					<PText size="sm" style={{ color: '#ff0000' }}>
						{error}
					</PText>
				) : null}
			</View>
		)
	}
)

const FormInput = forwardRef<TextInput, InputProps>(({ ...props }, ref) => {
	const { error } = useFormField()

	return (
		<BaseInput ref={ref} error={error?.message || undefined} {...props} />
	)
})

BaseInput.displayName = 'BaseInput'
FormInput.displayName = 'FormInput'

export { BaseInput, FormInput }

import Colors from '@/constants/Colors'
import { Message } from '@/queries/messages/getMessages'
import { TouchableOpacity, View } from 'react-native'
import PText from '../elements/PText'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'

export default function MessageRow({ message }: { message: Message }) {
	return (
		<TouchableOpacity
			style={{
				flexDirection: 'row',
				padding: 12,
				gap: 12,
			}}
		>
			<View>
				<View
					style={{
						padding: 12,
						backgroundColor: Colors.primary,
						borderRadius: 8,
					}}
				>
					<MaterialCommunityIcons
						name="message-badge-outline"
						size={24}
						color={Colors.white}
					/>
				</View>
			</View>
			<View style={{ flexShrink: 1 }}>
				{/* TODO: Add truncation when seperate message page is created */}
				<PText
					weight="semibold"
					/*numberOfLines={2}*/ ellipsizeMode="tail"
				>
					{message.title} and this has been very very
				</PText>
				<PText /*numberOfLines={5}*/ ellipsizeMode="tail">
					{message.message}
				</PText>
				<PText
					size="sm"
					color={Colors.gray}
					style={{
						marginTop: 12,
					}}
				>
					{message.channel} •{' '}
					{format(
						new Date(message.createdAt),
						'MMM dd hh:mm aaa, yyyy'
					).replace(`, ${new Date().getFullYear()}`, '')}
				</PText>
			</View>
		</TouchableOpacity>
	)
}

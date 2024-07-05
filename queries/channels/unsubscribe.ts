import api, { getError } from '@/queries/api'

type SubscribeToChannelProps = {
	subscriptionId: string
}

export default function unsubscribe({
	subscriptionId,
}: SubscribeToChannelProps): Promise<Response> {
	return new Promise(async (resolve, reject) => {
		await api
			.delete(`/device/channels/${subscriptionId}`)
			.then((response) => resolve(response.data))
			.catch((error) => reject(getError(error)))
	})
}

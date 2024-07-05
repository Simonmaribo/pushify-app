import api, { getError } from '@/queries/api'

type SubscribeToChannelProps = {
	code: string
}

export default function subscribeToChannel({
	code,
}: SubscribeToChannelProps): Promise<Response> {
	return new Promise(async (resolve, reject) => {
		await api
			.post(`/device/channels/${code}`)
			.then((response) => resolve(response.data))
			.catch((error) => reject(getError(error)))
	})
}

import api, { getError } from '@/queries/api'

type Channel = {
	id: string
	name: string
	createdAt: Date
}

export default function getChannels(): Promise<Channel[]> {
	return new Promise(async (resolve, reject) => {
		await api
			.get(`/device/channels`)
			.then((response) => resolve(response.data))
			.catch((error) => reject(getError(error)))
	})
}

import api, { getError } from '@/queries/api'

export type Message = {
	id: string
	title: string | null
	message: string | null
	channel: string
	createdAt: Date
}

export default function getMessages(): Promise<Message[]> {
	return new Promise(async (resolve, reject) => {
		await api
			.get(`/device/messages`)
			.then((response) => resolve(response.data))
			.catch((error) => reject(getError(error)))
	})
}

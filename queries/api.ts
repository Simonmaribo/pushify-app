import { getPushToken } from '@/helpers/push-token'
import axios, { AxiosInstance } from 'axios'
import * as SecureStore from 'expo-secure-store'

interface AxiosClient extends AxiosInstance {
	setToken: (token: string) => void
	getAuthHeader: () => string | null
	removeToken: () => void
	refreshToken: (pushToken?: string | null) => Promise<void>
}

const client = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	timeout: 20000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}) as AxiosClient

client.setToken = (token: string) => {
	client.defaults.headers['Authorization'] = `Bearer ${token}`
}
client.getAuthHeader = () => {
	return client.defaults.headers['Authorization']?.toString() || null
}

client.removeToken = () => {
	delete client.defaults.headers['Authorization']
}

client.refreshToken = async (pushToken) => {
	try {
		if (!pushToken) pushToken = await getPushToken()
		const response = await client.post('/device/auth/refresh', {
			pushToken,
		})
		const token = response.data.token
		if (!token) {
			throw new Error('Token not found')
		}

		SecureStore.setItemAsync('token', token)

		client.setToken(token)
	} catch (error) {
		SecureStore.deleteItemAsync('token')
	}
}

// If error is 401, try to refresh the token and retry the request
client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (error?.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			await client
				.refreshToken()
				.then(() => client(originalRequest))
				.catch((error) => Promise.reject(error))
		}
		return Promise.reject(error)
	}
)

export default client

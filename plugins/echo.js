import Echo from 'laravel-echo';
// eslint-disable-next-line no-unused-vars
import Pusher from 'pusher-js/with-encryption';

export default (_, inject) => {
	const echo = new Echo({
		broadcaster: 'pusher',
		key: process.env.PUSHER_ID,
		cluster: process.env.PUSHER_CLUSTER,
		authEndpoint: process.env.API_URL + 'broadcasting/auth',
		auth: {
			headers: {
				Authorization:
					localStorage.getItem('auth._token.local') !== null ? localStorage.getItem('auth._token.local') : ''
			}
		}
	});

	inject('echo', echo);
};

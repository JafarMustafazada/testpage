export const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getRdmChar() {
	const randomIndex = Math.floor(Math.random() * characters.length);
	return characters[randomIndex];
}

export function encode64(data) {
	return btoa(data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
}

export function decode64(data) {
	return atob(data.replace(/_/g, '/').replace(/-/g, '+')).padEnd((data.length + 3) % 4, '=');
}
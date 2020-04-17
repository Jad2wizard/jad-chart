export const delay = (timeout = 2000): Promise<string> =>
	new Promise(resolve => setTimeout(resolve, timeout))

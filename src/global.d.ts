declare module 'memoize' {
	export default function memoize<
		T extends (...args: any[]) => ReturnType<T>
	>(fn: T): T
}

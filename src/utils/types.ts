import {is} from 'jadwizard-lib'

export class Vector2 {
	public x: number
	public y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
	public length(x: number, y: number): number {
		return Math.pow(x ** 2 + y ** 2, 0.5)
	}
	public multiply(scale: number): Vector2 {
		this.x *= scale
		this.y *= scale
		return this
	}
	public add(v: Vector2): Vector2 {
		this.x += v.x
		this.y += v.y
		return this
	}
	public subtract(v: Vector2): Vector2 {
		this.x -= v.x
		this.y -= v.y
		return this
	}
}

export class RGB {
	public r: number
	public g: number
	public b: number
	constructor(r: number, g: number, b: number) {
		this.r = r
		this.g = g
		this.b = b
	}
	get RGB() {
		return `rgb(${this.r}, ${this.g}, ${this.b})`
	}
	setValue({r, g, b}: {r: number; g: number; b: number}): void {
		if (is.defined(r)) this.r = r
		if (is.defined(g)) this.g = g
		if (is.defined(b)) this.b = b
	}
	transformToHex(): number {
		return (this.r << 16) + (this.g << 8) + this.b
	}
	transformToHexStr(): string {
		const hex = this.transformToHex()
		let res = '#'
		if (hex < 100) res += '0000'
		else if (hex < 0x10000) res += '00'
		return res + hex.toString(16)
	}
}

export class RGBA extends RGB {
	public a: number
	constructor(r: number, g: number, b: number, a: number) {
		super(r, g, b)
		this.a = a
	}
	get RGBA() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
	}
	get RGB() {
		return super.RGB
	}
	setValue({
		r,
		g,
		b,
		a
	}: {
		r: number
		g: number
		b: number
		a?: number
	}): void {
		super.setValue({r, g, b})
		this.a = a || 0
	}
	transformToHex(): number {
		return Number(this.transformToHexStr().replace('#', ''))
	}
	transformToHexStr(): string {
		const {r, g, b, a} = this
		let res = '#'
		res += r.toString(16)
		res += g.toString(16)
		res += b.toString(16)
		res += a.toString(16)
		return res
	}
}

export class Color {
	private _rgb: RGB
	private _rgba: RGBA
	private _hex: number
	private _hexStr: string

	constructor(value?: RGB | RGBA | number | string) {
		if (value instanceof RGBA) this.rgba = value
		else if (value instanceof RGB)
			this.rgba = new RGBA(value.r, value.g, value.b, 255)
		else if (typeof value === 'number') this.hex = value
		else if (typeof value === 'string') this.hexStr = value
		else this.rgba = new RGBA(0, 0, 0, 255)
	}

	get RGB() {
		return this._rgba.RGB
	}

	get RGBA() {
		return this._rgba.RGBA
	}

	get rgba() {
		return this._rgba
	}
	set rgba(value: RGBA | RGB) {
		if (!is.defined(this._rgba)) this._rgba = new RGBA(0, 0, 0, 255)
		else this._rgba.setValue(value)
		this._hex = value.transformToHex()
		this._hexStr = value.transformToHexStr()
	}
	get hex() {
		return this._hex
	}
	set hex(value) {
		this._hex = value
		this._hexStr = this.transformFromHexToHexStr(value)
		this._rgba = this.transformFromHexToRGBA(value)
	}
	get hexStr() {
		return this._hexStr
	}
	set hexStr(value) {
		this._hexStr = value
		this._hex = this.transformFromHexStrToHex(value)
		this._rgba = this.transformFromHexToRGBA(this._hexStr)
	}

	transformFromHexToHexStr(hex: number): string {
		return '#' + hex.toString(16)
	}

	transformFromHexStrToHex(hexStr: string): number {
		return +hexStr.replace('#', '0x')
	}

	transformFromHexToRGBA(hex: any): RGBA {
		if (!is.defined(hex)) hex = this.hex
		if (is.string(hex)) hex = this.transformFromHexStrToHex(hex)

		let rgba: RGBA
		if (hex <= 0xffffff)
			rgba = new RGBA(
				hex >> 16,
				(hex & 0x00ff00) >> 8,
				hex & 0x0000ff,
				255
			)
		else
			rgba = new RGBA(
				hex >> 24,
				(hex & 0x00ff0000) >> 16,
				(hex & 0x0000ff00) >> 8,
				hex & 0x000000ff
			)
		return rgba
	}
}

export type func = (...args: any[]) => any

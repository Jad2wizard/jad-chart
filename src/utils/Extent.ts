export type NumStr = number | string

export class Extent {
	private _top: NumStr
	private _right: NumStr
	private _bottom: NumStr
	private _left: NumStr
	private _outterWidth: number
	private _outterHeight: number
	private _xSplitNumber = 8
	private _ySplitNumber = 8

	public innerWidth: number
	public innerHeight: number
	public xStep: number
	public yStep: number

	constructor(
		top: NumStr,
		right: NumStr,
		bottom: NumStr,
		left: NumStr,
		outterWidth: number,
		outterHeight: number,
		xSplitNumber?: number,
		ySplitNumber?: number
	) {
		this._outterWidth = outterWidth
		this._outterHeight = outterHeight
		this._top = this.parse('top', top)
		this._right = this.parse('right', right)
		this._bottom = this.parse('bottom', bottom)
		this._left = this.parse('left', left)
		if (xSplitNumber) this._xSplitNumber = xSplitNumber
		if (ySplitNumber) this._ySplitNumber = ySplitNumber
		this.calcInnerRect()
	}

	get top() {
		return this._top as number
	}
	set top(value: NumStr) {
		this._top = this.parse('top', value)
		this.calcInnerRect()
	}

	get right() {
		return this._right as number
	}
	set right(value: NumStr) {
		this._right = this.parse('right', value)
		this.calcInnerRect()
	}

	get bottom() {
		return this._bottom as number
	}
	set bottom(value: NumStr) {
		this._bottom = this.parse('bottom', value)
		this.calcInnerRect()
	}

	get left() {
		return this._left as number
	}
	set left(value: NumStr) {
		this._left = this.parse('left', value)
		this.calcInnerRect()
	}

	get outterWidth() {
		return this._outterWidth
	}
	set outterWidth(value) {
		this._outterWidth = value
		this.calcInnerRect()
	}

	get outterHeight() {
		return this._outterHeight
	}
	set outterHeight(value) {
		this._outterHeight = value
		this.calcInnerRect()
	}

	get xSplitNumber() {
		return this._xSplitNumber
	}
	set xSplitNumber(value) {
		this._xSplitNumber = value
		this.calcInnerRect()
	}

	get ySplitNumber() {
		return this._ySplitNumber
	}
	set ySplitNumber(value) {
		this._ySplitNumber = value
		this.calcInnerRect()
	}

	private parse(type: 'top' | 'right' | 'bottom' | 'left', value: NumStr) {
		const {_outterWidth, _outterHeight} = this
		let res: number
		if (typeof value === 'string') {
			if (type === 'top' || type === 'bottom')
				res =
					(Number(value.slice(0, value.length - 1)) / 100) *
					_outterHeight
			else
				res =
					(Number(value.slice(0, value.length - 1)) / 100) *
					_outterWidth
		} else res = value

		return Math.floor(res)
	}

	private calcInnerRect = () => {
		let {
			top,
			right,
			bottom,
			left,
			outterWidth,
			outterHeight,
			xSplitNumber,
			ySplitNumber
		} = this
		top = top as number
		right = right as number
		bottom = bottom as number
		left = left as number

		this.xStep = Math.floor((outterWidth - right - left) / xSplitNumber)
		this.yStep = Math.floor((outterHeight - top - bottom) / ySplitNumber)
		this.innerWidth = xSplitNumber * this.xStep
		this.innerHeight = ySplitNumber * this.yStep
	}

	public setParams(params: {
		top?: NumStr
		right?: NumStr
		bottom?: NumStr
		left?: NumStr
		outterWidth?: number
		outterHeight?: number
	}) {
		for (let k in params) {
			if (params[k]) this['_' + k] = params[k]
		}
		this.calcInnerRect()
	}

	public [Symbol.iterator]() {
		let _index = 0
		const keys = ['top', 'right', 'bottom', 'left']
		const that = this
		return {
			next: function() {
				if (_index < 4) {
					return {
						value: that[keys[_index++]],
						done: false
					}
				} else {
					return {value: undefined, done: true}
				}
			}
		}
	}
}

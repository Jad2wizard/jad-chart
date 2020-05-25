import {ICanvasRenderLine} from './index'

class Axis {
	public type: 'category' | 'value' = 'value'
	public min: number = 0
	public max: number = 100

	//the _*renderDatas are used to store the data to be drawn directly,
	//for avoiding the redundant computing in rendering periodically
	protected _axisRenderData: ICanvasRenderLine //存放坐标轴在canvas上的坐标信息
	protected _ticksRenderData: ICanvasRenderLine[] = [] //存放坐标轴上ticks在canvas上的坐标信息
	protected _labelRenderData: (string | number)[] //存放坐标轴的渲染数据

	constructor() {}

	public setRenderData(
		axisRenderData: ICanvasRenderLine,
		ticksRenderData: ICanvasRenderLine[]
	) {
		this._axisRenderData = axisRenderData
		this._ticksRenderData = ticksRenderData
	}

	public get axisRenderData() {
		return this._axisRenderData
	}

	public get ticksRenderData() {
		return this._ticksRenderData
	}

	public get labelRenderData() {
		return this._labelRenderData
	}
}

export default Axis

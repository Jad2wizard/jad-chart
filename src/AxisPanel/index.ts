import Main from '../index'
import View from '../View'
import XAxis from './XAxis'
import YAxis from './YAxis'
import {Color, func} from '../utils/types'

const DEFAULT_STYLE = {
	grid: {
		color: new Color('#e9e9e9'),
		lineWidth: 1,
		lineSeg: [3, 5]
	},
	axis: {
		color: new Color('#000000'),
		lineWidth: 1
	},
	ticks: {
		color: new Color('#000000'),
		lineWidth: 1,
		length: 5
	}
}

export interface ICanvasRenderLine {
	startCoord: [number, number]
	endCoord: [number, number]
	label?: {
		text: string | func
		textAlign: string
	}
}

/**
 * 负责:
 * 	1. 渲染横轴纵轴、
 *  2. 绘制画布网格、
 *  3. 根据传入的 xAxisData 和 yAxisData 以及 grid 绘制横轴和纵轴上的刻度以及标签
 * 	4. 提供计算渲染数据的 canvas 坐标的方法
 */
class AxisPanel {
	public main: Main
	public view: View
	public xAxis: XAxis
	public yAxis: YAxis
	public style = DEFAULT_STYLE
	public horizontalGridLines: ICanvasRenderLine[] = []
	public verticalGridLines: ICanvasRenderLine[] = []

	constructor(main: Main) {
		this.main = main
		this.view = main.view
		this.xAxis = new XAxis()
		this.yAxis = new YAxis()
		this.bindEvent()
	}

	private bindEvent() {
		this.view.on('change', this.handleViewChange)
		this.handleViewChange()
	}

	/**
	 * View 改变之后，重新计算坐标轴的渲染元素的位置
	 */
	private handleViewChange = () => {
		const {origin, chartZone} = this.view
		const {top, innerWidth, innerHeight, xStep, yStep} = chartZone
		const {x, y} = origin
		const endX = x + innerWidth
		const endY = y - innerHeight
		const tickLen = this.style.ticks.length

		let currTop = Math.floor(y)
		let currLeft = Math.floor(x)

		//calc x render pos
		const xAxisRenderData: ICanvasRenderLine = {
			startCoord: [x, currTop + 0.5],
			endCoord: [endX, currTop + 0.5]
		}

		//calc y render pos
		const yAxisRenderData: ICanvasRenderLine = {
			startCoord: [currLeft + 0.5, y],
			endCoord: [currLeft + 0.5, endY]
		}

		currLeft += xStep
		this.horizontalGridLines = []
		this.verticalGridLines = []
		const xAxisTicksRenderData: ICanvasRenderLine[] = [
			{
				startCoord: [x + 0.5, y],
				endCoord: [x + 0.5, y + tickLen]
			}
		]
		const yAxisTicksRenderData: ICanvasRenderLine[] = [
			{
				startCoord: [x, y + 0.5],
				endCoord: [x - tickLen, y + 0.5]
			}
		]
		currTop -= yStep
		while (currTop >= (top as number)) {
			//calc horizontal grid
			this.horizontalGridLines.push({
				startCoord: [x, currTop + 0.5],
				endCoord: [endX, currTop + 0.5]
			})
			//draw Y tick
			yAxisTicksRenderData.push({
				startCoord: [x, currTop + 0.5],
				endCoord: [x - tickLen, currTop + 0.5]
			})
			currTop -= yStep
		}

		while (currLeft <= endX) {
			//calc vertical grid
			this.verticalGridLines.push({
				startCoord: [currLeft + 0.5, y],
				endCoord: [currLeft + 0.5, endY]
			})
			//calc X tick
			xAxisTicksRenderData.push({
				startCoord: [currLeft + 0.5, y],
				endCoord: [currLeft + 0.5, y + tickLen]
			})
			currLeft += xStep
		}

		this.xAxis &&
			this.xAxis.setRenderData(xAxisRenderData, xAxisTicksRenderData)
		this.yAxis &&
			this.yAxis.setRenderData(yAxisRenderData, yAxisTicksRenderData)
	}
}

export default AxisPanel

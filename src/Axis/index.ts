import Main from './../index'
import View from './../View'
import {Color, Vector2} from '../utils/someTypes'

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

interface ICanvasRenderLine {
	startCoord: [number, number]
	endCoord: [number, number]
}
/**
 * 负责:
 * 	1. 渲染横轴纵轴、
 *  2. 绘制画布网格、
 *  3. 根据传入的 xAxisData 和 yAxisData 以及 grid 绘制横轴和纵轴上的刻度以及标签
 * 	4. 提供计算渲染数据的 canvas 坐标的方法
 */
class Axis {
	public ctx: CanvasRenderingContext2D | null
	public canvas: HTMLCanvasElement
	public main: Main
	public view: View

	private style = DEFAULT_STYLE
	private xAxis: ICanvasRenderLine
	private yAxis: ICanvasRenderLine
	private horizontalGridLines: ICanvasRenderLine[]
	private verticalGridLines: ICanvasRenderLine[]
	private xAxisTicks: ICanvasRenderLine[]
	private yAxisTicks: ICanvasRenderLine[]

	constructor(main: Main) {
		this.main = main
		this.view = main.view
		const canvas = document.createElement('canvas')
		canvas.width = this.view.width
		canvas.height = this.view.height
		canvas.setAttribute(
			'style',
			'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 9'
		)
		main.container.appendChild(canvas)

		this.ctx = canvas.getContext('2d')

		this.canvas = canvas

		this.horizontalGridLines = []
		this.verticalGridLines = []
		this.xAxisTicks = []
		this.yAxisTicks = []

		this.render = this.render.bind(this)

		this.bindEvent()
	}

	private bindEvent() {
		this.view.on('resize', this.handleResize)
		this.view.on('change', this.handleViewChange)
		this.handleViewChange()
	}

	private handleResize = () => {
		const {canvas} = this
		canvas.width = this.view.width
		canvas.height = this.view.height
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
		this.xAxis = {
			startCoord: [x, currTop + 0.5],
			endCoord: [endX, currTop + 0.5]
		}

		this.horizontalGridLines = []
		this.verticalGridLines = []
		this.xAxisTicks = [
			{
				startCoord: [x + 0.5, y],
				endCoord: [x + 0.5, y + tickLen]
			}
		]
		this.yAxisTicks = [
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
			this.yAxisTicks.push({
				startCoord: [x, currTop + 0.5],
				endCoord: [x - tickLen, currTop + 0.5]
			})
			currTop -= yStep
		}

		//calc y render pos
		this.yAxis = {
			startCoord: [currLeft + 0.5, y],
			endCoord: [currLeft + 0.5, endY]
		}

		currLeft += xStep
		while (currLeft <= endX) {
			//calc vertical grid
			this.verticalGridLines.push({
				startCoord: [currLeft + 0.5, y],
				endCoord: [currLeft + 0.5, endY]
			})
			//calc X tick
			this.xAxisTicks.push({
				startCoord: [currLeft + 0.5, y],
				endCoord: [currLeft + 0.5, y + tickLen]
			})
			currLeft += xStep
		}
	}

	private drawXAxis(ctx: CanvasRenderingContext2D) {
		//draw X axis
		const {style} = this
		const {startCoord, endCoord} = this.xAxis
		ctx.beginPath()
		ctx.lineWidth = style.axis.lineWidth
		ctx.strokeStyle = style.axis.color.hexStr
		ctx.moveTo(...startCoord)
		ctx.lineTo(...endCoord)
		ctx.stroke()
	}

	private drawGrids(ctx: CanvasRenderingContext2D) {
		//draw horizontal grid
		const {style} = this
		ctx.beginPath()
		ctx.lineWidth = style.grid.lineWidth
		ctx.strokeStyle = style.grid.color.hexStr
		if (style.grid.lineSeg) ctx.setLineDash(style.grid.lineSeg)
		for (let item of this.horizontalGridLines) {
			ctx.moveTo(...item.startCoord)
			ctx.lineTo(...item.endCoord)
			ctx.stroke()
		}
		for (let item of this.verticalGridLines) {
			ctx.moveTo(...item.startCoord)
			ctx.lineTo(...item.endCoord)
			ctx.stroke()
		}
		ctx.setLineDash([])
	}

	private drawTicks(ctx: CanvasRenderingContext2D) {
		const {style} = this
		ctx.beginPath()
		ctx.lineWidth = style.ticks.lineWidth
		ctx.strokeStyle = style.ticks.color.hexStr
		for (let item of this.xAxisTicks) {
			ctx.moveTo(...item.startCoord)
			ctx.lineTo(...item.endCoord)
			ctx.stroke()
		}
		for (let item of this.yAxisTicks) {
			ctx.moveTo(...item.startCoord)
			ctx.lineTo(...item.endCoord)
			ctx.stroke()
		}
	}

	private drawYAxis(ctx: CanvasRenderingContext2D) {
		//draw Y axis
		const {style} = this
		const {startCoord, endCoord} = this.yAxis
		ctx.beginPath()
		ctx.lineWidth = style.axis.lineWidth
		ctx.strokeStyle = style.axis.color.hexStr
		ctx.moveTo(...startCoord)
		ctx.lineTo(...endCoord)
		ctx.stroke()
	}

	public render() {
		const {ctx, canvas} = this
		if (!ctx) return
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		this.xAxis && this.drawXAxis(ctx)
		this.yAxis && this.drawYAxis(ctx)
		this.drawGrids(ctx)
		this.drawTicks(ctx)
	}
}

export default Axis

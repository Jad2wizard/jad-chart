import Chart from './../index'
import Axis from '../AxisPanel/Axis'

class AxisRenderer {
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D | null

	constructor(public chart: Chart) {
		const canvas = document.createElement('canvas')
		canvas.width = chart.view.width
		canvas.height = chart.view.height
		canvas.setAttribute(
			'style',
			'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 9'
		)
		chart.container.appendChild(canvas)

		this.ctx = canvas.getContext('2d')
		this.canvas = canvas

		chart.view.on('resize', this.handleResize)
	}

	private handleResize = () => {
		const {canvas, chart} = this
		canvas.width = chart.view.width
		canvas.height = chart.view.height
	}

	public render() {
		const {ctx, canvas} = this
		const {xAxis, yAxis, style} = this.chart.axisPanel

		if (!ctx) return
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		if (xAxis) {
			this.drawAxis(xAxis, style)
			this.drawTicks(xAxis, style)
		}
		if (yAxis) {
			this.drawAxis(yAxis, style)
			this.drawTicks(yAxis, style)
		}
		this.drawGrids(style)
	}

	private drawAxis(axis: Axis, style: any) {
		const {startCoord, endCoord} = axis.axisRenderData
		const {ctx} = this
		if (ctx) {
			ctx.beginPath()
			ctx.lineWidth = style.axis.lineWidth
			ctx.strokeStyle = style.axis.color.hexStr
			ctx.moveTo(...startCoord)
			ctx.lineTo(...endCoord)
			ctx.stroke()
		}
	}

	private drawTicks(axis: Axis, style: any) {
		const {ctx} = this
		if (ctx) {
			ctx.beginPath()
			ctx.lineWidth = style.ticks.lineWidth
			ctx.strokeStyle = style.ticks.color.hexStr
			for (let item of axis.ticksRenderData) {
				ctx.moveTo(...item.startCoord)
				ctx.lineTo(...item.endCoord)
				ctx.stroke()
			}
		}
	}

	private drawGrids(style: any) {
		//draw horizontal grid
		const {ctx} = this
		const {horizontalGridLines, verticalGridLines} = this.chart.axisPanel
		if (ctx) {
			ctx.beginPath()
			ctx.lineWidth = style.grid.lineWidth
			ctx.strokeStyle = style.grid.color.hexStr
			if (style.grid.lineSeg) ctx.setLineDash(style.grid.lineSeg)
			for (let item of horizontalGridLines) {
				ctx.moveTo(...item.startCoord)
				ctx.lineTo(...item.endCoord)
				ctx.stroke()
			}
			for (let item of verticalGridLines) {
				ctx.moveTo(...item.startCoord)
				ctx.lineTo(...item.endCoord)
				ctx.stroke()
			}
			ctx.setLineDash([])
		}
	}
}

export default AxisRenderer

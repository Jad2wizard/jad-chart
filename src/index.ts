import Axis from './Axis'
import View from './View'

interface ISeries {
	type: string
	data: any[]
	style?: object
}

interface IOption {
	title?: string
	padding?: (number | string)[]
	series: ISeries[]
}

class Main {
	public container: HTMLElement
	public title: string
	public series: ISeries[]
	public axisCanvas: Axis //坐标轴画布对象
	public view: View

	constructor(container: HTMLElement, option?: IOption) {
		this.container = container

		this.parseOption(option)

		this.view = new View(this, option ? option.padding : undefined)
		this.axisCanvas = new Axis(this)

		this.animate = this.animate.bind(this)
		this.animate()
	}

	private init(option?: IOption) {}

	public setOption(option: IOption) {
		this.parseOption(option)
	}

	public animate() {
		requestAnimationFrame(this.animate)
		this.render()
	}

	private parseOption(option?: IOption) {
		if (!option) return

		if (option.title) this.title = option.title

		if (option.padding) {
			this.view.setChartZone(option.padding)
		}

		if (option.series) {
			this.series = option.series.slice()
		}
	}

	private render() {
		this.axisCanvas.render()
	}
}

export default Main

import AxisPanel from './AxisPanel'
import View from './View'
import Renderer from './Renderer'

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
	public axisPanel: AxisPanel //坐标轴画布对象
	public view: View
	public renderer: Renderer

	constructor(container: HTMLElement, option?: IOption) {
		this.container = container

		this.parseOption(option)

		this.view = new View(this, option ? option.padding : undefined)

		this.axisPanel = new AxisPanel(this)

		this.renderer = new Renderer(this)
	}

	private init(option?: IOption) {}

	public setOption(option: IOption) {
		this.parseOption(option)
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
}

export default Main

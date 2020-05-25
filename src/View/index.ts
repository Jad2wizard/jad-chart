import {utils} from 'jadwizard-lib'
import * as elementResizeEvent from 'element-resize-event'
import * as EventEmitter from 'event-emitter'
import Main from '../index'
import {Extent, NumStr} from '../utils/Extent'
import {Vector2} from '../utils/types'

class View {
	public width: number //容器和画布的宽度
	public height: number
	public chartCanvas: any //图表画布对象
	public origin: Vector2 //坐标轴原点所在的 canvas 坐标
	public chartZone: Extent //图表绘制区域
	public on: any
	public emit: any

	constructor(public main: Main, padding?: NumStr[]) {
		this.width = main.container.clientWidth
		this.height = main.container.clientHeight
		EventEmitter(this)

		this.chartZone = new Extent(
			'10%',
			'5%',
			'10%',
			'10%',
			this.width,
			this.height
		)
		if (padding) this.setChartZone(padding)

		this.calcOrigin()

		this.onResize = this.onResize.bind(this)

		this.bindEvent()
	}

	private bindEvent() {
		const {container} = this.main
		elementResizeEvent(container, this.onResize)
	}

	private onResize = utils.debounce(() => {
		this.width = this.main.container.clientWidth
		this.height = this.main.container.clientHeight

		this.chartZone.setParams({
			outterWidth: this.width,
			outterHeight: this.height
		})

		this._emit('resize')
		this._emit('change')
	}, 20)

	private _emit = (eventType: string, ...args: any[]) => {
		setTimeout(() => {
			this.emit(eventType, args)
		})
	}

	private calcOrigin() {
		const {bottom, left} = this.chartZone
		this.origin = new Vector2(
			left as number,
			this.height - (bottom as number)
		)
	}

	public setChartZone(padding: NumStr[]) {
		const [top, right, bottom, left] = padding
		if (!this.chartZone) {
			this.chartZone = new Extent(
				top,
				right,
				bottom,
				left,
				this.width,
				this.height
			)
		} else {
			this.chartZone.setParams({top, right, bottom, left})
		}
	}
}

export default View

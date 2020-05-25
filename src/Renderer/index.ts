import Chart from './../index'
import AxisRenderer from './Axis'

class Renderer {
	public axisRenderer: AxisRenderer

	constructor(public chart: Chart) {
		this.axisRenderer = new AxisRenderer(chart)
		this.animate = this.animate.bind(this)
		this.animate()
	}

	public animate() {
		requestAnimationFrame(this.animate)
		this.render()
	}

	private render() {
		this.axisRenderer.render()
	}
}

export default Renderer

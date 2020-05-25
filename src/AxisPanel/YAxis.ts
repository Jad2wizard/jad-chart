import Axis from './Axis'

const DEFAULT_TYPE = 'value'
class YAxis extends Axis {
	constructor() {
		super()
		this.type = DEFAULT_TYPE
	}
}

export default YAxis

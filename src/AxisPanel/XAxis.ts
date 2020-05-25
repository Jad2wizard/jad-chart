import Axis from './Axis'

const DEFAULT_TYPE = 'category'
class XAxis extends Axis {
	constructor() {
		super()
		this.type = DEFAULT_TYPE
	}
}

export default XAxis

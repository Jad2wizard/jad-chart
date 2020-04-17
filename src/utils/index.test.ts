import {delay} from './index'
import * as moment from 'moment'

describe('Test utils', () => {
	test('Test delay promise', async () => {
		const start = moment().valueOf()
		await delay(3000)
		const d = moment().valueOf() - start
		expect(d).toBeGreaterThanOrEqual(3000)
	})
})

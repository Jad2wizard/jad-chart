import {Extent} from './Extent'

describe('test the Class Extent', () => {
	const e = new Extent('10%', '5%', '10%', '10%', 500, 400)
	test('test instance creating', () => {
		const {
			top,
			right,
			bottom,
			left,
			innerWidth,
			innerHeight,
			xStep,
			yStep
		} = e
		expect(top).toEqual(40)
		expect(right).toEqual(25)
		expect(bottom).toEqual(40)
		expect(left).toEqual(50)
		expect(innerWidth).toEqual(420)
		expect(innerHeight).toEqual(318)
		expect(xStep).toEqual(70)
		expect(yStep).toEqual(53)
	})

	test('test updating params', () => {
		e.right = 30
		expect(e.right).toEqual(30)
		expect(e.xStep).toEqual(70)
		expect(e.innerWidth).toEqual(420)
		e.right = 45
		expect(e.xStep).toEqual(67)
		expect(e.innerWidth).toEqual(402)

		e.setParams({outterHeight: 500})
		expect(e.yStep).toEqual(70)
		expect(e.innerHeight).toEqual(420)
	})
})

import {Extent} from './Extent'

describe('test the Class Extent', () => {
	const e = new Extent('10%', '5%', '10%', '10%', 500, 400, 16, 16)
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
		expect(innerWidth).toEqual(416)
		expect(innerHeight).toEqual(320)
		expect(xStep).toEqual(26)
		expect(yStep).toEqual(20)
	})

	test('test updating params', () => {
		e.right = 30
		expect(e.right).toEqual(30)
		expect(e.xStep).toEqual(26)
		expect(e.innerWidth).toEqual(416)
		e.right = 45
		expect(e.xStep).toEqual(25)
		expect(e.innerWidth).toEqual(400)

		e.setParams({outterHeight: 500})
		expect(e.yStep).toEqual(26)
		expect(e.innerHeight).toEqual(416)
	})
})

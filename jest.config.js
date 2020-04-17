module.exports = {
	setupFiles: [],
	transform: {
		'^.+\\.js?$': 'babel-jest',
		'^.+\\.ts[x]?$': 'ts-jest'
	},
	testPathIgnorePatterns: ['<rootDir>/lib', '<rootDir>/typings'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	moduleNameMapper: {
		'^utils(.*)$': '<rootDir>/src/utils$1',
		'\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/file.js'
	}
}

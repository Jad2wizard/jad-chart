/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const {TsConfigPathsPlugin} = require('awesome-typescript-loader')

// prettier-ignore
module.exports = (env, argv) => {
	const isDev = argv.mode === 'development'
	const config = {
		entry: {
			main: isDev
				? ['./demo/index.ts']
				: ['./src/index.ts']
		},
		output: {},
		devServer: {
			hot: true,
			host: '0.0.0.0',
			historyApiFallback: {index: './demo/index.html'}
		},
		resolve: {
			extensions: ['.ts', '.js'],
			plugins: [
				new TsConfigPathsPlugin('./tsconfig.json')
			]
		},
		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader'
					}
				}
			]
		},
		plugins: []
	}

	if (isDev) {
		config.mode = 'development'
		config.devtool = 'inline-source-map'
		config.output.filename = 'demo.js'
		config.output = {
			filename: 'demo.js',
			path: path.resolve(__dirname, './demo'),
			library: 'JadChart',
			libraryTarget: 'umd',
			libraryExport: 'default'
		}
	} else {
		config.mode = 'production'
		config.devtool = 'source-map'
		config.output = {
			filename: 'jad-chart.js',
			path: path.resolve(__dirname, './dist'),
			library: 'JadChart',
			libraryTarget: 'umd',
			libraryExport: 'default'
		}
	}
	return config
}

// rollup.config.mjs
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';

export default {
	input: './src/app.js',
	output: [
		{
			file: './build/app.js',
			format: 'es'
		},
		{
			file: './minimized_example/app.min.js',
			format: 'es',
			name: 'version',
			plugins: [terser()]
		}
	],
	plugins: [
		json(),
		scss({
			output: 'minimized_example/style.min.css',
			outputStyle: "compressed",
			failOnError: true
		})
	]
};
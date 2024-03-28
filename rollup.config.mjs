// rollup.config.mjs
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
	input: './src/importExport.js',
	output: [
		{
			file: './build/importExport.js',
			format: 'es'
		},
		{
			file: './minimized/importExport.min.js',
			format: 'es',
			name: 'version',
			plugins: [terser()]
		},
		{
			file: './example/importExport.min.js',
			format: 'es',
			name: 'version',
			plugins: [terser()]
		}
	],
	plugins: [json()]
};
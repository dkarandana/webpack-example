const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const EntryList = require('./weback.entrylist');

const IS_PROD = (process.env.NODE_ENV === 'prod') ? true : false;

/* output path */
const OUT_DIR_ABS = path.resolve('./dist');

const CSS_FILENAME_OUTPUT_PATTERN = `./css/[name].min.css`;
const extractSass = new ExtractTextPlugin(CSS_FILENAME_OUTPUT_PATTERN);

const GENERATE_SOURCE_MAPS = false;
const CSS_MINIFY = IS_PROD;

module.exports = [{
	name: 'js-all',
	watch: !IS_PROD,
	context: path.resolve(__dirname, 'src'),
	entry: EntryList('./src/js', '.js'),
	output: {
		path: OUT_DIR_ABS,
		filename: './js/[name].bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				"presets": [
					["env", {
						"targets": {
							"ie": "9"
						}
					}]
				],
				"plugins": [
					["transform-runtime", {
						"helpers": false,
						"polyfill": false,
						"regenerator": true,
						"moduleName": "babel-runtime"
					}], "transform-object-assign", "transform-function-bind"
				]
			}
		}]
	},
	resolve: {
		alias: {}
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1
		})
	]
}, {
	name: 'css-all',
	context: path.resolve(__dirname, 'src'),
	entry: EntryList('./src/scss', '.scss'),
	output: {
		path: OUT_DIR_ABS,
		filename: './css/[name].min.css'
	},
	module: {
		rules: [{
			test: /\.scss$/,
			use: ExtractTextPlugin.extract({
				use: [{
					loader: "css-loader",
					options: {
						minimize: CSS_MINIFY,
						sourceMap: GENERATE_SOURCE_MAPS
					}
				}, {
					loader: "sass-loader",
					options: {
						minimize: CSS_MINIFY,
						sourceMap: GENERATE_SOURCE_MAPS,
						includePaths: ['./node_modules']
					}
				}],
				fallback: "style-loader"
			})
		}, {
			test: /\.(woff2|ttf|eot|svg|png|jpg|gif)$/,
			use: [{
				loader: "file-loader"
			}]
		}]
	},
	plugins: [
		extractSass
	]
}];
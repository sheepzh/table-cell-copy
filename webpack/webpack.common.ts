import path from "path"
import GenerateJsonPlugin from "generate-json-webpack-plugin"
import webpack from "webpack"
// Generate json files 
import manifest from "../src/manifest"
import tsConfig from '../tsconfig.json'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"

const tsPathAlias = tsConfig.compilerOptions.paths

const generateJsonPlugins = [
    new GenerateJsonPlugin('manifest.json', manifest) as unknown as webpack.WebpackPluginInstance
]

// Process the alias of typescript modules
const resolveAlias: { [index: string]: string | false | string[] } = {}
const aliasPattern = /^(@.*)\/\*$/
const sourcePattern = /^(src(\/.*)?)\/\*$/
Object.entries(tsPathAlias).forEach(([alias, sourceArr]) => {
    // Only process the alias starts with '@'
    if (!aliasPattern.test(alias)) {
        return
    }
    if (!sourceArr.length) {
        return
    }
    const index = alias.match(aliasPattern)[1]
    const webpackSourceArr = sourceArr
        .filter(source => sourcePattern.test(source))
        // Only set alias which is in /src folder
        .map(source => source.match(sourcePattern)[1])
        .map(folder => path.resolve(__dirname, '..', folder))
    resolveAlias[index] = webpackSourceArr
})
console.log("Alias of typescript: ")
console.log(resolveAlias)

type EntryConfig = {
    name: string
    path: string
}

const entryConfigs: EntryConfig[] = [
    {
        name: "service_worker",
        path: './src/service-worker',
    }
]

const staticOptions: webpack.Configuration = {
    entry() {
        const entry = {}
        entryConfigs.forEach(({ name, path }) => entry[name] = path)
        return entry
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /^(node_modules|test|script)/,
                use: ['ts-loader']
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }, {
                test: /\.sc|ass$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }, {
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                use: ['url-loader']
            }, {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', ".js", '.css', '.scss', '.sass'],
        alias: resolveAlias,
    },
}

const optionGenerator = (outputPath: string, manifestHooker?: (manifest: copier.Manifest) => void) => {
    manifestHooker?.(manifest)
    const plugins = [
        ...generateJsonPlugins,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '..', 'public', 'images'),
                    to: path.join(outputPath, 'static', 'images'),
                }
            ]
        }),
        new MiniCssExtractPlugin(),
    ]
    return {
        ...staticOptions,
        plugins
    } as webpack.Configuration
}

export default optionGenerator
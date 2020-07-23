var path = require('path');

function srcPath(subdir) {
    return path.join(__dirname, "./", subdir);
}

module.exports = {
    // Change to your "entry-point".
    mode: 'production',
    optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
    entry: {
        background: './src/background/index.ts',
        content: './src/content/content.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        alias: {
            '@algosigner/common': srcPath('../common/src'),
            '@algosigner/crypto': srcPath('../crypto'),
            '@algosigner/storage': srcPath('../storage'),
            '@algosigner/ui': srcPath('../ui')
        },
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    presets: ['@babel/preset-typescript'],
                    plugins: ['@babel/plugin-transform-runtime', "@babel/plugin-proposal-nullish-coalescing-operator", "@babel/plugin-proposal-optional-chaining"]     
                }
            }
        }],
    }
};

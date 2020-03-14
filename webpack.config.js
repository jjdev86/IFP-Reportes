const path = require('path');
const SRC_DIR = path.join(__dirname,'/client/src');
const DIST_DIR = path.join(__dirname,'/client/dist');
// entry: `${SRC_DIR}/App.jsx` // changed to have index.js be entry
module.exports = {
  entry: `${SRC_DIR}/index.js`,
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: SRC_DIR,
        use: {
          loader: 'babel-loader',
           options: {
            "presets": [
              "@babel/preset-env",
              "@babel/preset-react"
            ]
           }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader","css-loader"]
      }
    ]
  }
};
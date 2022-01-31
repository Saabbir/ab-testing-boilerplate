const fs = require("fs");
const path = require("path");
const entry = require("webpack-glob-entry");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");

module.exports = (env, argv) => {
  const jsConfig = {
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
    },
  };

  const cssConfig = {
    test: /\.(scss|css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
        },
      },
      "postcss-loader",
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
          sassOptions: {
            outputStyle: argv.mode === "production" ? "expanded" : "compressed",
          },
        },
      },
    ],
  };

  // Global config
  const config = {
    entry: entry("./src/**/*.js"),
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    module: {
      rules: [cssConfig],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new LiveReloadPlugin({
        protocol: "http",
        port: 35729,
        applyCSSLive: true,
      }),
    ],
  };

  // Dev specific config
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  // Prod specific config
  if (argv.mode === "production") {
    config.module.rules.unshift(jsConfig);
    config.optimization = {
      minimize: false,
    };
  }

  return config;
};

import { Configuration } from "webpack";
import path from "path";

const mode = process.env.mode === "dev" ? "development" : "production";

const config: Configuration = {
  mode,
  cache: true,
  // entry: path.resolve(__dirname, "./src/script.ts"),
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(process.cwd(), "./dist"),
  },
  devtool: "source-map",
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "public", "index.html"),
    //   minify: true,
    // }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;

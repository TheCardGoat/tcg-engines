import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import glslify from "rollup-plugin-glslify";
import { fileURLToPath } from "node:url";
import copy from "rollup-plugin-copy";
import alias from "@rollup/plugin-alias";
import path from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  input: "src/main.ts",
  output: {
    file: "./dist/bundle.js",
    name: "PhaserTemplate",
    format: "iife",
    indent: false,
    sourcemap: true,
    minifyInternalExports: false,
  },
  plugins: [
    url({
      emitFiles: true,
    }),
    typescript(),
    alias({
      entries: [
        {
          find: "phaser",
          replacement: path.resolve(__dirname, "../node_modules/phaser/dist/phaser.min.js"),
        },
      ],
    }),

    glslify(),
    nodeResolve({
      extensions: ["ts", "tsx"],
    }),
    commonjs({
      include: ["node_modules/eventemitter3/**", "node_modules/phaser/**"],
      exclude: [
        "node_modules/phaser/src/polyfills/requestAnimationFrame.js",
        "node_modules/phaser/src/phaser-esm.js",
      ],
      sourceMap: true,
      ignoreGlobal: false,
    }),
    serve({
      open: true,
      contentBase: ["public", "dist"],
      host: "localhost",
      port: 8080,
      verbose: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }),
    livereload({
      watch: "dist",
    }),
    del({
      targets: "dist/*",
      runOnce: true,
    }),
    copy({
      targets: [
        { src: "index.html", dest: "dist/" },
        { src: "public/*", dest: "dist/" },
      ],
      copyOnce: true,
    }),
  ],
};

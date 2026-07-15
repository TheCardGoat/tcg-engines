import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compile, compileModule } from "svelte/compiler";

const SVELTE_SONNER_SHIM_PATH = fileURLToPath(new URL("./shims/svelte-sonner.ts", import.meta.url));

function compileSvelteComponent(source: string, filename: string): string {
  const { js } = compile(source, {
    filename,
    generate: "server",
  });

  return js.code;
}

function compileSvelteModule(source: string, filename: string): string {
  const jsSource = filename.endsWith(".ts")
    ? new Bun.Transpiler({ loader: "ts" }).transformSync(source)
    : source;
  const { js } = compileModule(jsSource, {
    filename,
    generate: "server",
  });

  return js.code;
}

Bun.plugin({
  name: "lorcana-simulator-svelte-test-loader",
  setup(build) {
    build.onResolve({ filter: /^svelte-sonner$/ }, () => ({
      path: SVELTE_SONNER_SHIM_PATH,
    }));

    build.onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await Bun.file(args.path).text();

      return {
        contents: compileSvelteComponent(source, args.path),
        loader: "js",
        resolveDir: dirname(args.path),
      };
    });

    build.onLoad({ filter: /\.svelte\.[jt]s$/ }, async (args) => {
      const source = await Bun.file(args.path).text();

      return {
        contents: compileSvelteModule(source, args.path),
        loader: "js",
        resolveDir: dirname(args.path),
      };
    });
  },
});

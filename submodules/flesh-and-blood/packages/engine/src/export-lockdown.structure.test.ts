import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vite-plus/test";

const engineRoot = resolve(import.meta.dirname);
const repositoryRoot = resolve(engineRoot, "../../../../..");
const packageRoot = resolve(engineRoot, "..");
const packageName = "@tcg/flesh-and-blood-engine";
const nonSourceDirectories = new Set([".git", "dist", "node_modules"]);

function sourceFiles(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return nonSourceDirectories.has(entry.name) ? [] : sourceFiles(path);
    }
    return entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

function isTestSource(path: string): boolean {
  return (
    /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path) || path.endsWith("/rules/effect-leaf-contracts.ts")
  );
}

function importsOf(path: string): readonly string[] {
  let source: string;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return [
    ...source.matchAll(/(?:import|export)\s+(?:type\s+)?(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g),
  ].map((match) => match[1]!);
}

describe("ARCH-011 package export and dependency lockdown", () => {
  it("makes the package exports the external allowlist", () => {
    const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8")) as {
      exports: Record<string, unknown>;
    };
    expect(Object.keys(packageJson.exports).sort()).toEqual([
      "./automation",
      "./catalog",
      "./deck-validation",
      "./deck-validation-card",
      "./legal-commands",
      "./log",
      "./package.json",
      "./runtime",
      "./simulator",
      "./testing",
    ]);
  });

  it("has no consumer of the removed root package entrypoint", () => {
    const forbidden = sourceFiles(resolve(repositoryRoot, "submodules"))
      .filter((path) => !path.startsWith(packageRoot))
      .flatMap((path) =>
        importsOf(path)
          .filter((specifier) => specifier === packageName)
          .map(() => relative(repositoryRoot, path)),
      );
    expect(forbidden).toEqual([]);
  }, 120000); // Whole-`submodules`-tree import scan; needs headroom under full-suite load.

  it("keeps production engine modules independent from test and practice helpers", () => {
    const forbidden = sourceFiles(engineRoot)
      .filter((path) => {
        const fromRoot = relative(engineRoot, path);
        return (
          !isTestSource(path) &&
          fromRoot !== "index.ts" &&
          fromRoot !== "simulator-api.ts" &&
          !fromRoot.startsWith("testing/") &&
          !fromRoot.startsWith("automation/") &&
          !fromRoot.startsWith("acceptance/") &&
          !fromRoot.startsWith("performance/")
        );
      })
      .flatMap((path) =>
        importsOf(path)
          .filter((specifier) => /(?:^|\/)\.{1,2}\/(?:testing|automation)\//.test(specifier))
          .map((specifier) => `${relative(engineRoot, path)} -> ${specifier}`),
      );
    expect(forbidden).toEqual([]);
  });

  it("prevents domain and projection modules from reaching outward to runtime API or mutation", () => {
    const forbidden = sourceFiles(engineRoot)
      .filter((path) => {
        const fromRoot = relative(engineRoot, path);
        return (
          /^(?:game|rules|procedures|kernel|cards|projection)\//.test(fromRoot) &&
          !isTestSource(path)
        );
      })
      .flatMap((path) => {
        const fromRoot = relative(engineRoot, path);
        return importsOf(path)
          .filter((specifier) => {
            if (/runtime-api|@tcg\/.*(?:adapter|protocol)/.test(specifier)) return true;
            return (
              fromRoot.startsWith("projection/") &&
              /(?:rules\/(?:reducers|transaction-kernel|kernel\/transaction)|kernel\/(?:transaction-kernel|transaction))/.test(
                specifier,
              )
            );
          })
          .map((specifier) => `${fromRoot} -> ${specifier}`);
      });
    expect(forbidden).toEqual([]);
  });

  it("keeps raw match state off the host runtime entrypoint", () => {
    const runtimeApi = readFileSync(join(engineRoot, "runtime-api.ts"), "utf8");
    const simulatorApi = readFileSync(join(engineRoot, "simulator-api.ts"), "utf8");
    expect(runtimeApi).not.toMatch(/export \* from ["']\.\/state\.ts["']/);
    expect(runtimeApi).not.toMatch(/export \* from ["']\.\/moves\.ts["']/);
    expect(runtimeApi).not.toMatch(/FabMatchState/);
    expect(runtimeApi).not.toMatch(/FabRulesSnapshot/);
    expect(runtimeApi).not.toMatch(/FabCommandResult|FabCommandSuccess/);
    expect(runtimeApi).toMatch(/readFabWaitState/);
    expect(runtimeApi).toMatch(/projectFabViewerResources/);
    expect(simulatorApi).not.toMatch(/export \* from ["']\.\/testing/);
  });
});

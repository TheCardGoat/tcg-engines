import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = import.meta.dirname;
const runtimePath = join(srcRoot, "runtime.ts");
const commandsRoot = join(srcRoot, "commands");
const handlersRoot = join(commandsRoot, "handlers");

const handlerNames = [
  "activate",
  "answer-decision",
  "begin-play",
  "concede",
  "defend",
  "end-turn",
  "pass",
] as const;

function productionTypeScriptFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return productionTypeScriptFiles(path);
    return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

function relativeImports(path: string): string[] {
  const source = readFileSync(path, "utf8");
  return [...source.matchAll(/(?:from|import)\s*["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith("."))
    .flatMap((specifier) => {
      const exact = resolve(dirname(path), specifier);
      const candidates = [exact, `${exact}.ts`, join(exact, "index.ts")];
      const resolved = candidates.find(existsSync);
      return resolved ? [resolved] : [];
    });
}

function targetCycles(): string[][] {
  const files = productionTypeScriptFiles(srcRoot);
  const fileSet = new Set(files);
  const graph = new Map(
    files.map((path) => [
      path,
      relativeImports(path).filter((dependency) => fileSet.has(dependency)),
    ]),
  );
  const targets = new Set(
    files.filter((path) => path === runtimePath || path.startsWith(`${commandsRoot}/`)),
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];
  const cycles = new Map<string, string[]>();

  const visit = (path: string): void => {
    if (visited.has(path)) return;
    visiting.add(path);
    stack.push(path);
    for (const dependency of graph.get(path) ?? []) {
      if (visiting.has(dependency)) {
        const start = stack.indexOf(dependency);
        const cycle = [...stack.slice(start), dependency];
        if (cycle.some((entry) => targets.has(entry))) {
          const display = cycle.map((entry) => relative(srcRoot, entry));
          cycles.set(display.join(" -> "), display);
        }
      } else {
        visit(dependency);
      }
    }
    stack.pop();
    visiting.delete(path);
    visited.add(path);
  };

  for (const path of [...targets, ...files.filter((file) => !targets.has(file))]) visit(path);
  return [...cycles.values()];
}

describe("FAB runtime decomposition structure", () => {
  it("keeps match ownership in runtime and command behavior in real handler modules", () => {
    const runtimeSource = readFileSync(runtimePath, "utf8");
    const runtimeLines = runtimeSource.split("\n").filter((line) => line.trim().length > 0);

    expect(runtimeLines.length).toBeLessThan(700);
    expect(runtimeSource).toMatch(/createFabCommandHandlers\(commandHandlerContext\)/);
    expect(runtimeSource).not.toMatch(
      /private (?:apply|resolveTopRulesStackLayer|advanceCombatStep)/,
    );
    expect(runtimeSource).not.toMatch(
      /beginFab(?:Play|Activation|LayerResolution|Combat|EndTurn)|declareFabDefenders|closeFabCombatChain/,
    );

    for (const name of handlerNames) {
      const path = join(handlersRoot, `${name}.ts`);
      const source = readFileSync(path, "utf8");
      const lines = source.split("\n").filter((line) => line.trim().length > 0);
      expect(lines.length, name).toBeGreaterThan(name === "concede" ? 10 : 15);
      expect(source, name).toMatch(/export function handle/);
      expect(source, name).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
      if (name === "concede") {
        expect(source).toContain("../../procedures/game-end/concede.ts");
      }
    }
  });

  it("limits handlers to explicit match-owner capabilities", () => {
    const contextSource = readFileSync(join(commandsRoot, "handler-context.ts"), "utf8");
    expect(contextSource).toContain("readonly state");
    expect(contextSource).toContain("transactionOptions");
    // The command candidate is the only mutable document: handlers mutate it
    // in place and there is no publish-back/replace capability to misuse.
    expect(contextSource).not.toContain("replaceState");
    expect(contextSource).not.toMatch(/FabMatchRuntime|runtime\.ts/);
  });

  it("keeps pass-cycle advance in the advance procedure, not the pass handler", () => {
    const passSource = readFileSync(join(handlersRoot, "pass.ts"), "utf8");
    expect(passSource).toContain("procedures/advance");
    expect(passSource).not.toMatch(
      /procedures\/(?:combat|layer-resolution|turn)\b|beginFabEndTurnProcedure|beginFabLayerResolution|closeFabCombatChain|advanceFabCombatStep|resolveFabCombatDamage/,
    );

    const advanceSource = readFileSync(
      join(srcRoot, "procedures", "advance", "pass-cycle.ts"),
      "utf8",
    );
    expect(advanceSource).toContain("export function advanceFabPassCycle");
    expect(advanceSource).toMatch(
      /beginFabLayerResolution|closeFabCombatChain|beginFabEndTurnProcedure/,
    );
  });

  it("has no import cycle containing runtime or command modules", () => {
    expect(targetCycles()).toEqual([]);
  });
});

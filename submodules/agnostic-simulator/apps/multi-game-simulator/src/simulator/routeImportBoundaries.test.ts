import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

describe("simulator route import boundaries", () => {
  it("keeps game implementations and the combined testing hub behind lazy imports", async () => {
    const source = await readFile(
      path.resolve(process.cwd(), "src/simulator/routeRegistry.tsx"),
      "utf8",
    );
    const staticImports = [...source.matchAll(/^import[^;]+from\s+["']([^"']+)["'];/gm)].map(
      (match) => match[1],
    );

    expect(staticImports.filter((specifier) => specifier.includes("../games/"))).toEqual([]);
    expect(staticImports).not.toContain("./testingHub");
  });

  it("does not statically import game fixture catalogs from the tester hub", async () => {
    const source = await readFile(
      path.resolve(process.cwd(), "src/simulator/testingHub.tsx"),
      "utf8",
    );
    const staticImports = [...source.matchAll(/^import[^;]+from\s+["']([^"']+)["'];/gm)].map(
      (match) => match[1],
    );

    expect(staticImports.filter((specifier) => specifier.includes("../games/"))).toEqual([]);
    expect(source).toContain("../games/flesh-and-blood/fixtures");
    expect(source).toContain("../games/cyberpunk/engine");
  });

  it("does not import the complete FAB card package from fixture scenarios", async () => {
    const scenarioDirectory = path.resolve(
      process.cwd(),
      "src/games/flesh-and-blood/engine-scenarios",
    );
    const scenarioFiles = (await readdir(scenarioDirectory)).filter(
      (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
    );
    const source = (
      await Promise.all(
        scenarioFiles.map((file) => readFile(path.join(scenarioDirectory, file), "utf8")),
      )
    ).join("\n");

    expect(source).not.toMatch(/from ["']@tcg\/flesh-and-blood-cards["']/);
    expect(source).toContain("@tcg/flesh-and-blood-cards/simulator-scenario-cards");
  });

  it("uses the interaction-only FAB adapter entrypoint on the fixture play surface", async () => {
    const source = await readFile(
      path.resolve(process.cwd(), "src/games/flesh-and-blood/Practice.page.tsx"),
      "utf8",
    );

    expect(source).toContain("@tcg/flesh-and-blood-server-adapter/interaction");
    expect(source).toContain("@tcg/flesh-and-blood-server-adapter/animation");
    expect(source).not.toMatch(/from ["']@tcg\/flesh-and-blood-server-adapter["']/);
  });

  it("keeps the test-fixture server route independent of the game registry", async () => {
    const source = await readFile(
      path.resolve(process.cwd(), "src/routes/simulator-test-fixture.tsx"),
      "utf8",
    );
    const loaderSource = await readFile(
      path.resolve(process.cwd(), "src/routes/simulator-route-loader.ts"),
      "utf8",
    );

    expect(source).toContain('import("./simulator-test-fixture-client")');
    expect(source).not.toMatch(/from ["']\.\/simulator-route-module["']/);
    expect(loaderSource).not.toContain("routeRegistry");
    expect(loaderSource).not.toMatch(/(?:import|export)[^;]+from\s+["'][^"']*games\//);
  });

  it("does not globally import another game's styles or auth implementation", async () => {
    const rootSource = await readFile(path.resolve(process.cwd(), "src/root.tsx"), "utf8");
    const routeModuleSource = await readFile(
      path.resolve(process.cwd(), "src/routes/simulator-route-module.tsx"),
      "utf8",
    );

    expect(rootSource).not.toMatch(/games\/naruto\/.+\.css/);
    expect(routeModuleSource).toContain(
      'import("../games/cyberpunk/auth/ServerAuthSessionHydrator")',
    );
    expect(routeModuleSource).not.toMatch(
      /from ["']\.\.\/games\/cyberpunk\/auth\/ServerAuthSessionHydrator["']/,
    );
  });
});

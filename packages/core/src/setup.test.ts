import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("Project Setup", () => {
  const packageRoot = join(__dirname, "..");
  const packageJsonPath = join(packageRoot, "package.json");
  const tsconfigPath = join(packageRoot, "tsconfig.json");
  // Biome config is at monorepo root
  const biomeConfigPath = join(packageRoot, "../../biome.json");

  describe("package.json", () => {
    it("should exist", () => {
      expect(existsSync(packageJsonPath)).toBe(true);
    });

    it("should have correct name", () => {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.name).toBe("@tcg/core");
    });

    it("should have required dependencies", () => {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      expect(deps.immer).toBeDefined();
      // xstate removed in Task 9 - using simple explicit state machine instead
      expect(deps.zod).toBeDefined();
      expect(deps.seedrandom).toBeDefined();
      expect(deps.nanoid).toBeDefined();
    });

    it("should have required scripts", () => {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      const scripts = packageJson.scripts;

      expect(scripts.test).toBeDefined();
      expect(scripts["check-types"]).toBeDefined();
      expect(scripts.lint).toBeDefined();
      expect(scripts.format).toBeDefined();
      expect(scripts.build).toBeDefined();
    });

    it("should be marked as private", () => {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.private).toBe(true);
    });

    it("should have correct main and types paths", () => {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.main).toBe("./src/index.ts");
      expect(packageJson.types).toBe("./src/index.d.ts");
    });
  });

  describe("tsconfig.json", () => {
    it("should exist", () => {
      expect(existsSync(tsconfigPath)).toBe(true);
    });

    it("should have strict mode enabled", () => {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it("should target ES2022", () => {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.compilerOptions.target).toBe("ES2022");
    });

    it("should use ESNext module system", () => {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.compilerOptions.module).toBe("ESNext");
    });

    it("should include src directory", () => {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.include).toContain("src/**/*");
    });

    it("should exclude node_modules", () => {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.exclude).toContain("node_modules");
    });
  });

  describe("biome.json", () => {
    it("should exist at root level", () => {
      expect(existsSync(biomeConfigPath)).toBe(true);
    });

    it("should have valid configuration at root level", () => {
      const biomeConfig = JSON.parse(readFileSync(biomeConfigPath, "utf-8"));
      expect(biomeConfig.$schema).toBeDefined();
    });
  });
});

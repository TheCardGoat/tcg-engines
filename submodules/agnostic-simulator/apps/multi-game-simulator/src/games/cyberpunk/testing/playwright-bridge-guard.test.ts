import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const APP_ROOT = resolve(__dirname, "../../../../");
const BANNED = ["__cyberpunkEngine", "dispatchEngine", "evalEngine"];

describe("Cyberpunk Playwright bridge boundary", () => {
  it("keeps Playwright files off direct engine bridges", () => {
    const files = collectTsFiles(resolve(APP_ROOT, "e2e"));

    const offenders = files.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return BANNED.filter((token) => source.includes(token)).map(
        (token) => `${relative(APP_ROOT, file)} contains ${token}`,
      );
    });

    expect(offenders).toEqual([]);
  });
});

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      return collectTsFiles(path);
    }
    return path.endsWith(".ts") || path.endsWith(".tsx") ? [path] : [];
  });
}

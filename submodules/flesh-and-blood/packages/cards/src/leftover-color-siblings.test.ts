import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Corpus hygiene: an unsuffixed card module that sits next to color-suffixed
 * siblings of the same {SET}{NNN} stem is a leftover duplicate of one color
 * printing. Those duplicates shared a canonicalId with the live sibling and
 * were removed wholesale; this test keeps them from coming back.
 */
describe("leftover unsuffixed color-sibling modules", () => {
  it("finds none", () => {
    const root = new URL("./cards/", import.meta.url);
    const files = readdirSync(root, { recursive: true, encoding: "utf8" })
      .map((f) => String(f).replace(/\\/g, "/"))
      .filter(
        (f) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !f.endsWith(".i18n.ts") &&
          f.split("/").length > 1 &&
          !f.split("/").includes("shared") &&
          !["index.ts", "metadata.ts", "legalities.ts"].includes(f.slice(f.lastIndexOf("/") + 1)),
      );
    const byDir = new Map<string, string[]>();
    for (const f of files) {
      const dir = f.slice(0, f.lastIndexOf("/"));
      byDir.set(dir, [...(byDir.get(dir) ?? []), f]);
    }
    const leftovers: string[] = [];
    for (const f of files) {
      const name = f.slice(f.lastIndexOf("/") + 1);
      const m = /^([A-Z]{3})(\d+)-(.+)\.ts$/.exec(name);
      if (!m) continue;
      const [, setCode, num, slug] = m;
      if (/-(red|yellow|blue|purple)$/.test(slug)) continue;
      const dir = f.slice(0, f.lastIndexOf("/"));
      const siblings = (byDir.get(dir) ?? []).filter((other) =>
        new RegExp(`^${setCode}${num}-.+-(red|yellow|blue|purple)\\.ts$`).test(
          other.slice(other.lastIndexOf("/") + 1),
        ),
      );
      if (siblings.length > 0) {
        leftovers.push(`${f} (sibling ${siblings[0]})`);
      }
    }
    expect(leftovers).toEqual([]);
  });
});

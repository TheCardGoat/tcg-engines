import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Canonical authoring constraints that complement the source-derived audit. */
describe("card authoring mandate", () => {
  const modules = ["cards"].flatMap((sourceRoot) => {
    const root = new URL(`./${sourceRoot}/`, import.meta.url);
    return readdirSync(root, { recursive: true, encoding: "utf8" })
      .map((f) => String(f).replace(/\\/g, "/"))
      .filter(
        (f) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !f.endsWith(".i18n.ts") &&
          f.split("/").length > 1 &&
          !f.split("/").includes("shared") &&
          !["index.ts", "metadata.ts", "legalities.ts"].includes(f.slice(f.lastIndexOf("/") + 1)),
      )
      .map((f) => ({
        file: `${sourceRoot}/${f}`,
        sourceRoot,
        text: readFileSync(new URL(`./${sourceRoot}/${f}`, import.meta.url), "utf8"),
      }));
  });
  const authoredDefinitions = (text: string): readonly string[] =>
    text.split(/(?=export\s+const\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=)/).slice(1);

  it("color/pitch pairs agree with the CR 2.1 table", () => {
    const table: Record<string, string> = { Red: "1", Yellow: "2", Blue: "3", Purple: "4" };
    const violations: string[] = [];
    for (const { file, text } of modules) {
      const m = /color:\s*"(Red|Yellow|Blue|Purple)",\s*\n\s*pitch:\s*"([1-4])"/.exec(text);
      if (m && m[2] !== table[m[1]]) {
        violations.push(`${file}: color ${m[1]} with pitch ${m[2]}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not inline the exact attack-action type box", () => {
    const violations: string[] = [];
    const re = /typeBox:\s*\{\s*types:\s*\["Action"\],\s*subtypes:\s*\["Attack"\]\s*,?\s*\}/;
    for (const { file, text } of modules) {
      if (re.test(text)) violations.push(`${file}: inline AAC typeBox (use attackActionFilter)`);
    }
    expect(violations).toEqual([]);
  });

  it("does not inline keyword objects that have shared consts", () => {
    const violations: string[] = [];
    const sharedNames = ["reload", "go-again", "fusion"];
    for (const { file, text } of modules) {
      for (const kw of sharedNames) {
        if (text.includes(`{ name: "${kw}" }`) || text.includes(`{ name: "${kw}",`)) {
          violations.push(`${file}: inline ${kw} keyword (import from shared/keywords.ts)`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not author conditional.instead (self-replacement replaces it)", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      const codeOnly = text
        .split("\n")
        .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
        .join("\n");
      if (/instead:\s*true/.test(codeOnly)) {
        violations.push(`${file}: instead:true (encode self-replacement per CR 6.4.7)`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not author the until-end-of-turn duration alias", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      if (text.includes('"until-end-of-turn"')) {
        violations.push(`${file}: until-end-of-turn (use this-turn)`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("crush-labeled abilities use crushAbility", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      if (/\bname:\s*"crush"/.test(text) && !text.includes("crushAbility(")) {
        violations.push(`${file}: hand-copied crush trigger (use crushAbility)`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("combo last-attack gates use combo helpers (play-statics exempt)", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      if (!text.includes("last-attack-this-combat-chain") && !/\bname:\s*"combo"/.test(text)) {
        continue;
      }
      const hasHelper =
        text.includes("comboResolution(") ||
        text.includes("comboStatic(") ||
        text.includes("comboAbility(");
      const hasResolutionOrContinuousCombo =
        /kind:\s*"resolution"[\s\S]{0,600}?name:\s*"combo"/.test(text) ||
        /staticKind:\s*"continuous"[\s\S]{0,600}?name:\s*"combo"/.test(text);
      if (hasResolutionOrContinuousCombo && !hasHelper) {
        violations.push(`${file}: combo last-attack rider without combo helper`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not author event-deck as a zone or filter primitive", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      const codeOnly = text
        .split("\n")
        .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
        .join("\n");
      if (/zone(?:s)?:\s*(?:\[\s*)?"event-deck"/.test(codeOnly)) {
        violations.push(`${file}: event-deck zone (out of 1v1 scope)`);
      }
    }
    expect(violations).toEqual([]);
  });

  const DERIVED_STATUS =
    /(?:status|hasStatus):\s*"(?:[^"]*(?:this-turn|this-way|in-your-party)[^"]*|\d+-or-more-[^"]*|[^"]*-or-more-[^"]*)"/g;
  const TYPE_BOX_NAMES = [
    "Attack Action Card",
    "Guardian Attack Action",
    "Aura Token",
    "Draconic Attack",
    "Mechanologist Item",
  ];

  it("does not author derived has-status slugs", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      const codeOnly = text
        .split("\n")
        .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
        .join("\n");
      const matches = codeOnly.match(DERIVED_STATUS) ?? [];
      for (const match of matches) {
        violations.push(`${file}: ${match}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not use type-box phrases as filter names", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      for (const phrase of TYPE_BOX_NAMES) {
        if (text.includes(`name: "${phrase}"`)) {
          violations.push(`${file}: name: "${phrase}" (use typeBox / attackActionFilter)`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not put conditional go again on keywords (grant-property instead)", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      for (const definition of authoredDefinitions(text)) {
        if (
          /kind:\s*"resolution"[\s\S]{0,800}keywords:\s*\[goAgain\]/.test(definition) ||
          /kind:\s*"resolution"[\s\S]{0,800}keywords:\s*\[\s*\{[\s\S]{0,80}name:\s*"go-again"/.test(
            definition,
          )
        ) {
          violations.push(`${file}: ability-level keywords goAgain (use grantKeyword)`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("pitch-first modules do not also author color (except purple / Chi override)", () => {
    const violations: string[] = [];
    for (const { file, text } of modules) {
      for (const definition of authoredDefinitions(text)) {
        if (!/^[ \t]*pitch:\s*"/m.test(definition)) continue;
        if (/color:\s*"Purple"/.test(definition)) continue;
        if (/^[ \t]*color:\s*"(Red|Yellow|Blue)"/m.test(definition)) {
          violations.push(`${file}: authors color alongside pitch (derive color from pitch)`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});

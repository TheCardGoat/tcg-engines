import { describe, expect, it } from "vitest";
import { ruleUnits } from "./rules-audit-units.mjs";

describe("rules review identity", () => {
  it("invalidates review when prose changes under the same heading", () => {
    const before = ruleUnits("rules.md", "# Rules\n1. Draw one card.")[0];
    const after = ruleUnits("rules.md", "# Rules\n1. Draw two cards.")[0];
    expect(after.key).toBe(before.key);
    expect(after.fingerprint).not.toBe(before.fingerprint);
  });
  it("uses the named heading and ignores image host changes", () => {
    const make = (image) =>
      `# Mastery\n#### Shifting Currents\n#### ![](${image})\n1. Choose a direction.`;
    const before = ruleUnits("rules.md", make("/files/old"));
    const after = ruleUnits("rules.md", make("https://cdn.example/new.png"));
    expect(after).toEqual(before);
    expect(after.map((unit) => unit.key)).toEqual(["rules.md#shifting-currents"]);
  });
  it("discovers new numbered sections independently", () => {
    const units = ruleUnits("rules.md", "# Rules\n## First\n1. Draw.\n## New\n1. Discard.");
    expect(units.map((unit) => unit.key)).toEqual(["rules.md#first", "rules.md#new"]);
  });
});

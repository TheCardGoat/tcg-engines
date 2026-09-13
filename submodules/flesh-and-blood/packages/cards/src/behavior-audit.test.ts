import { describe, expect, it } from "vitest";

import { auditCardBehaviors, defaultCardSourceDirectories } from "../scripts/behavior-audit.ts";

describe("card behavior inventory", () => {
  it("discovers the complete structured card source tree", async () => {
    const inventory = await auditCardBehaviors(defaultCardSourceDirectories());

    expect(inventory.generatedAt).toBe("source-derived");
    expect(inventory.cardModules).toBeGreaterThan(4_000);
    // 59 committed events: the synthetic `enter-or-leave-arena` name was
    // removed in favor of explicit `any-of` enter/leave-arena patterns.
    expect(inventory.canonicalTriggerNames).toHaveLength(59);
    expect(inventory.behaviorOccurrences.length).toBeGreaterThan(5_000);
    expect(inventory.behaviorKeys.length).toBeGreaterThan(100);
  }, 60_000);

  it("registers every ability, nested effect, trigger, and keyword occurrence", async () => {
    const inventory = await auditCardBehaviors(defaultCardSourceDirectories());
    const keys = new Set(inventory.behaviorKeys);
    const routeMetadata = inventory.behaviorOccurrences.find((item) =>
      item.cardPath.endsWith("actions/timesnap-potion.ts"),
    );

    expect(inventory.behaviorOccurrences).not.toHaveLength(0);
    expect(routeMetadata).toMatchObject({
      cardPath: "actions/timesnap-potion.ts",
    });
    for (const occurrence of inventory.behaviorOccurrences) {
      expect(keys.has(occurrence.behaviorKey), occurrence.sourceId).toBe(true);
      expect(occurrence.cardPath).toMatch(/\.ts$/);
      expect(occurrence.sourceId).toContain(occurrence.cardPath);
    }
    expect(inventory.behaviorOccurrences.some((item) => item.kind === "ability")).toBe(true);
    expect(inventory.behaviorOccurrences.some((item) => item.kind === "effect")).toBe(true);
    expect(inventory.behaviorOccurrences.some((item) => item.kind === "trigger")).toBe(true);
    expect(inventory.behaviorOccurrences.some((item) => item.kind === "keyword")).toBe(true);
    expect(
      inventory.behaviorOccurrences.some(
        (item) => item.cardPath === "actions/snatch.ts" && item.kind === "ability",
      ),
    ).toBe(true);
    for (const trigger of inventory.canonicalTriggerNames) {
      expect(keys.has(`trigger:${trigger}`), trigger).toBe(true);
    }
  }, 60_000);

  it("deduplicates equivalent printed behavior while retaining all source occurrences", async () => {
    const inventory = await auditCardBehaviors(defaultCardSourceDirectories());
    const abilities = inventory.behaviorOccurrences.filter((item) => item.kind === "ability");
    const distinctAbilityKeys = new Set(abilities.map((item) => item.behaviorKey));

    expect(abilities.length).toBeGreaterThan(distinctAbilityKeys.size);
    expect(
      inventory.behaviorKeys.every((key) => /^(ability|effect|trigger|keyword):/.test(key)),
    ).toBe(true);
  }, 60_000);
});

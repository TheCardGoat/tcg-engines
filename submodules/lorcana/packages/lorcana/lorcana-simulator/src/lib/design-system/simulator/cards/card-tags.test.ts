import { describe, expect, it } from "bun:test";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import { getLorcanaCardTagGroups, getLorcanaCardTags } from "./card-tags.js";

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: "card-1",
    definitionId: "def-card-1",
    facePresentation: "faceUp",
    isMasked: false,
    label: "The Queen - Commanding Presence",
    ownerId: "player-one",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "character",
    strength: 4,
    baseStrength: 4,
    willpower: 3,
    baseWillpower: 3,
    loreValue: 2,
    baseLoreValue: 2,
    readyState: "ready",
    damage: 0,
    ...overrides,
  };
}

describe("card tags", () => {
  it("separates stat modifiers from generic tags while keeping hover ordering", () => {
    const card = createCardSnapshot({
      isDrying: true,
      damage: 2,
      strength: 8,
      willpower: 1,
      loreValue: 3,
      readyState: "exerted",
      keywords: ["Rush"],
    });

    const groups = getLorcanaCardTagGroups(card);

    expect(groups.statModifiers.map((modifier) => modifier.id)).toEqual([
      "lore-bonus",
      "strength-bonus",
      "willpower-bonus",
    ]);
    expect(groups.statModifiers.map((modifier) => modifier.signedValue)).toEqual([
      "+1",
      "+4",
      "-2",
    ]);
    expect(groups.statModifiers.map((modifier) => modifier.tone)).toEqual([
      "success",
      "success",
      "warning",
    ]);

    expect(groups.tags.map((tag) => tag.id)).toEqual(["fresh-ink", "damage", "exerted", "rush"]);
    expect(getLorcanaCardTags(card).map((tag) => tag.id)).toEqual([
      "fresh-ink",
      "damage",
      "lore-bonus",
      "strength-bonus",
      "willpower-bonus",
      "exerted",
      "rush",
    ]);
  });

  it("omits stat modifiers when values match their base stats", () => {
    const groups = getLorcanaCardTagGroups(
      createCardSnapshot({
        damage: 3,
        readyState: "exerted",
      }),
    );

    expect(groups.statModifiers).toHaveLength(0);
    expect(groups.tags.map((tag) => tag.id)).toEqual(["damage", "exerted"]);
  });

  it("hides stat badges when all stats match their base values", () => {
    const groups = getLorcanaCardTagGroups(createCardSnapshot());

    expect(groups.statBadges).toHaveLength(0);
  });

  it("shows all stat badges when any stat is modified", () => {
    const groups = getLorcanaCardTagGroups(createCardSnapshot({ strength: 6 }));

    expect(groups.statBadges.map((b) => b.id)).toEqual(["strength", "willpower", "lore"]);
    expect(groups.statBadges.map((b) => b.currentValue)).toEqual([6, 3, 2]);
    expect(groups.statBadges.map((b) => b.tone)).toEqual(["success", "neutral", "neutral"]);
  });

  it("colors stat badges based on modifier direction", () => {
    const groups = getLorcanaCardTagGroups(
      createCardSnapshot({
        strength: 8,
        willpower: 1,
        loreValue: 3,
      }),
    );

    expect(groups.statBadges.map((b) => b.tone)).toEqual(["success", "warning", "success"]);
    expect(groups.statBadges.map((b) => b.currentValue)).toEqual([8, 1, 3]);
  });

  it("produces willpower and lore badges for locations (no strength) when modified", () => {
    const groups = getLorcanaCardTagGroups(
      createCardSnapshot({
        cardType: "location",
        strength: undefined,
        baseStrength: undefined,
        willpower: 7,
        baseWillpower: 5,
        loreValue: 1,
        baseLoreValue: 1,
      }),
    );

    expect(groups.statBadges.map((b) => b.id)).toEqual(["willpower", "lore"]);
    expect(groups.statBadges.map((b) => b.currentValue)).toEqual([7, 1]);
    expect(groups.statBadges.map((b) => b.tone)).toEqual(["success", "neutral"]);
  });

  it("always produces a lore badge for locations even without modifiers", () => {
    const groups = getLorcanaCardTagGroups(
      createCardSnapshot({
        cardType: "location",
        strength: undefined,
        baseStrength: undefined,
        willpower: 5,
        baseWillpower: 5,
        loreValue: 2,
        baseLoreValue: 2,
      }),
    );

    expect(groups.statBadges.map((b) => b.id)).toEqual(["lore"]);
    expect(groups.statBadges.map((b) => b.currentValue)).toEqual([2]);
    expect(groups.statBadges.map((b) => b.tone)).toEqual(["neutral"]);
  });

  it("produces no stat badges for items or actions", () => {
    const itemGroups = getLorcanaCardTagGroups(createCardSnapshot({ cardType: "item" }));
    expect(itemGroups.statBadges).toHaveLength(0);

    const actionGroups = getLorcanaCardTagGroups(createCardSnapshot({ cardType: "action" }));
    expect(actionGroups.statBadges).toHaveLength(0);
  });

  it("shows the Shift tag only while the card is in hand", () => {
    const handGroups = getLorcanaCardTagGroups(
      createCardSnapshot({
        zoneId: "hand",
        keywords: ["Shift"],
        textEntries: [{ title: "Shift 4", description: "" }],
      }),
    );

    const playGroups = getLorcanaCardTagGroups(
      createCardSnapshot({
        zoneId: "play",
        keywords: ["Shift"],
        textEntries: [{ title: "Shift 4", description: "" }],
      }),
    );

    expect(handGroups.tags.map((tag) => tag.id)).toContain("shift");
    expect(handGroups.tags.find((tag) => tag.id === "shift")?.label).toBe("Shift 4");
    expect(playGroups.tags.map((tag) => tag.id)).not.toContain("shift");
  });

  it("does not treat discard-cost Shift entries as numeric Shift values", () => {
    const groups = getLorcanaCardTagGroups(
      createCardSnapshot({
        zoneId: "hand",
        keywords: ["Shift"],
        textEntries: [{ title: "Shift: Discard 2 cards", description: "" }],
      }),
    );

    expect(groups.tags.find((tag) => tag.id === "shift")?.label).toBe("Shift");
  });
});

import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { mickeyMouseArtfulRogue } from "../../../../lorcana-cards/src/cards/001/characters/088-mickey-mouse-artful-rogue";
import { getShiftRules, resolveShiftTargetCandidates, validateBasicCost } from "./play-card-rules";

describe("getShiftRules", () => {
  it("ignores unrelated non-keyword ability text when resolving bare Shift name targets", () => {
    expect(getShiftRules(mickeyMouseArtfulRogue)?.targetMode).toEqual({
      type: "name",
      name: "Mickey Mouse",
    });
  });

  it("lets advanced mimicry satisfy classification-based Shift targets", () => {
    const morph = "morph" as CardInstanceId;
    const ordinaryAlly = "ordinary-ally" as CardInstanceId;
    const definitions = {
      [morph]: {
        id: "morph",
        cardType: "character",
        name: "Morph",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        inkable: true,
        classifications: ["Storyborn", "Ally", "Alien"],
        abilities: [
          {
            type: "static",
            name: "ADVANCED MIMICRY",
            text: "ADVANCED MIMICRY You can shift any character on top of this character.",
            effect: {
              chooser: "CONTROLLER",
              effect: {
                from: "hand",
                type: "play-card",
              },
              type: "optional",
            },
          },
        ],
      },
      [ordinaryAlly]: {
        id: "ordinary-ally",
        cardType: "character",
        name: "Ordinary Ally",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        inkable: true,
        classifications: ["Storyborn", "Ally"],
      },
    };

    expect(
      resolveShiftTargetCandidates(
        { targetMode: { type: "classification", classification: "Madrigal" }, inkCost: 3 },
        [morph, ordinaryAlly],
        (id) => definitions[id] as LorcanaCardDefinition | undefined,
      ),
    ).toEqual([morph]);
  });

  it("lets advanced mimicry satisfy an item-only Shift target", () => {
    const morph = "morph" as CardInstanceId;
    const potato = "potato" as CardInstanceId;
    const definitions = {
      [morph]: {
        id: "morph",
        cardType: "character",
        name: "Morph",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        inkable: true,
        classifications: ["Storyborn", "Ally", "Alien"],
        abilities: [
          {
            type: "static",
            name: "ADVANCED MIMICRY",
            text: "ADVANCED MIMICRY You can shift any character on top of this character.",
            effect: {
              chooser: "CONTROLLER",
              effect: { from: "hand", type: "play-card" },
              type: "optional",
            },
          },
        ],
      },
      [potato]: {
        id: "potato",
        cardType: "item",
        name: "Potato",
        cost: 1,
        inkable: true,
        abilities: [],
      },
    };

    expect(
      resolveShiftTargetCandidates(
        {
          targetMode: { type: "name", name: "Potato" },
          targetCardType: "item",
          inkCost: 5,
        },
        [morph, potato],
        (id) => definitions[id] as LorcanaCardDefinition | undefined,
      ),
    ).toEqual([morph, potato]);
  });
});

describe("validateBasicCost ink-drop payments", () => {
  const playerId = "payment-player" as Parameters<typeof validateBasicCost>[0]["playerId"];
  const makeContext = (opts: { dropsHeld?: number; readyInkCards?: number } = {}) => {
    const readyInkCards = Array.from({ length: opts.readyInkCards ?? 0 }, (_, i) => `ink-${i}`);
    const cards = { require: () => ({ meta: { state: "ready" as const } }) };
    return {
      G: { inkDrops: { [playerId]: opts.dropsHeld ?? 0 } },
      framework: {
        state: {},
        zones: {
          getCards: ({ zone }: { zone: string; playerId: string }) =>
            zone === "inkwell" ? readyInkCards : [],
        },
        cards,
      },
      cards,
      playerId,
    };
  };

  it("rejects a claimed ink-drop payment the payer cannot back, even with enough ready ink", () => {
    const result = validateBasicCost(
      makeContext({ dropsHeld: 0, readyInkCards: 3 }),
      { ink: 2 },
      {
        inkDrops: 1,
      },
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errorCode).toBe("INSUFFICIENT_INK_DROPS");
    }
  });

  it("still lets claimed drops cover the ready-ink shortfall", () => {
    const result = validateBasicCost(
      makeContext({ dropsHeld: 2, readyInkCards: 1 }),
      { ink: 3 },
      { inkDrops: 2 },
    );
    expect(result.valid).toBe(true);
  });

  it("keeps validating plain ink costs when no drops are claimed", () => {
    expect(validateBasicCost(makeContext({ readyInkCards: 2 }), { ink: 2 }).valid).toBe(true);
    expect(validateBasicCost(makeContext({ readyInkCards: 1 }), { ink: 2 }).valid).toBe(false);
  });
});

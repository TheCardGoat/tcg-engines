import { describe, expect, it } from "bun:test";
import { deriveCardEffectDamageResult } from "./card-effect-animations.js";
import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";

function createPlayCardSnapshot(
  overrides: Partial<CardSnapshotMap[string]> = {},
): CardSnapshotMap[string] {
  return {
    cardId: "card-1",
    definitionId: "def-card-1",
    isMasked: false,
    label: "Test Character",
    ownerId: "player-1",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "character",
    facePresentation: "faceUp",
    ...overrides,
  };
}

describe("deriveCardEffectDamageResult", () => {
  it("returns positive damage added while the card remains in play", () => {
    expect(
      deriveCardEffectDamageResult(
        createPlayCardSnapshot({ damage: 1, willpower: 5 }),
        createPlayCardSnapshot({ damage: 3, willpower: 5 }),
      ),
    ).toEqual({
      amount: 2,
      wasBanished: false,
    });
  });

  it("uses remaining willpower as finishing damage when a card is banished", () => {
    expect(
      deriveCardEffectDamageResult(
        createPlayCardSnapshot({ damage: 2, willpower: 5 }),
        createPlayCardSnapshot({ damage: 2, zoneId: "discard" }),
      ),
    ).toEqual({
      amount: 3,
      wasBanished: true,
    });
  });

  it("falls back to one finishing damage when willpower is unknown", () => {
    expect(
      deriveCardEffectDamageResult(
        createPlayCardSnapshot({ damage: 2 }),
        createPlayCardSnapshot({ damage: 2, zoneId: "discard" }),
      ),
    ).toEqual({
      amount: 1,
      wasBanished: true,
    });
  });
});

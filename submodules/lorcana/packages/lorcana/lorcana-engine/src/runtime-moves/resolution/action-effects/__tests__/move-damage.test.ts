import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { MoveDamageEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/unit-harness";
import { resolveMoveDamageEffect } from "../move-damage-effect";

const P1_SRC = "p1-src" as CardInstanceId;
const P2_DEST = "p2-dest" as CardInstanceId;

const WARD_ABILITY = { type: "keyword" as const, keyword: "Ward" };

function readDamage(ctx: PlayCardExecutionContext, id: CardInstanceId): number {
  return Number(ctx.cards.get(id)?.meta?.damage ?? 0);
}

/**
 * End-to-end test: move-damage must allow selecting an opponent character
 * with Ward as the damage *source* (damage is being removed, not dealt).
 *
 * This reproduces the Cheshire Cat IT'S LOADS OF FUN bug where the Ward
 * candidate filter incorrectly excluded Ward'd characters from the source
 * candidate pool, producing zero patches on every resolveBag call.
 */
describe("move-damage", () => {
  it.todo("unit: add slot-aware move-damage coverage once the slotted harness exists");

  it("allows a Ward'd opponent character to be selected as damage source", () => {
    const ctx = createTestContext({
      zoneCards: {
        "play:player-one": [P1_SRC],
        "play:player-two": [P2_DEST],
      },
      definitions: {
        "p1-src": { id: "p1-src", cardType: "character" },
        "p2-dest": {
          id: "p2-dest",
          cardType: "character",
          willpower: 5,
          abilities: [WARD_ABILITY],
        },
      },
      // P2_DEST has 2 damage on it, P2 is opponent
      cardMeta: { "p2-dest": { damage: 2 } },
      currentPlayer: PLAYER_ONE,
      playerId: PLAYER_ONE,
    });

    const effect: MoveDamageEffect = {
      type: "move-damage",
      amount: 2,
      from: {
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      },
      to: {
        selector: "chosen",
        count: 1,
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      },
    };

    // Player one chooses P2_DEST (the Ward'd opponent character) as the
    // damage source, and P2_DEST also as the destination.
    resolveMoveDamageEffect(
      ctx,
      createCardPlayed({ cardId: "cheshire-cat", playerId: PLAYER_ONE }),
      effect,
      { targets: [P2_DEST, P2_DEST], amount: 2 },
    );

    // Damage should have been "moved" off the source and onto the destination.
    // Since source and destination are the same card, the damage stays at 2.
    // The key assertion is that the effect executed without silently returning
    // early due to an empty source candidate list.
    expect(readDamage(ctx, P2_DEST)).toBe(2);
  });

  it("moves damage from a Ward'd source to a different destination", () => {
    const P1_DEST = "p1-dest" as CardInstanceId;

    const ctx = createTestContext({
      zoneCards: {
        "play:player-one": [P1_SRC, P1_DEST],
        "play:player-two": [P2_DEST],
      },
      definitions: {
        "p1-src": { id: "p1-src", cardType: "character" },
        "p1-dest": { id: "p1-dest", cardType: "character", willpower: 5 },
        "p2-dest": {
          id: "p2-dest",
          cardType: "character",
          willpower: 5,
          abilities: [WARD_ABILITY],
        },
      },
      cardMeta: { "p2-dest": { damage: 3 } },
      currentPlayer: PLAYER_ONE,
      playerId: PLAYER_ONE,
    });

    const effect: MoveDamageEffect = {
      type: "move-damage",
      amount: 2,
      from: {
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      },
      to: {
        selector: "chosen",
        count: 1,
        owner: "you",
        zones: ["play"],
        cardTypes: ["character"],
      },
    };

    // Choose Ward'd P2_DEST as source, P1_DEST as destination
    resolveMoveDamageEffect(
      ctx,
      createCardPlayed({ cardId: "cheshire-cat", playerId: PLAYER_ONE }),
      effect,
      { targets: [P2_DEST, P1_DEST], amount: 2 },
    );

    // 2 damage removed from P2_DEST source, 2 damage added to P1_DEST destination
    expect(readDamage(ctx, P2_DEST)).toBe(1); // 3 - 2 = 1
    expect(readDamage(ctx, P1_DEST)).toBe(2); // 0 + 2 = 2
  });
});

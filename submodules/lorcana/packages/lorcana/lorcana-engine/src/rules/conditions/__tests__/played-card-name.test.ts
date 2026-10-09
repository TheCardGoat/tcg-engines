import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const playedCard = { id: "played-1", cardType: "item" as const, name: "Signature Lute" };
const sameNameCard = { id: "same-1", cardType: "item" as const, name: "Signature Lute" };
const otherCard = { id: "other-1", cardType: "item" as const, name: "Other Prop" };

describe("played-card-name", () => {
  it("matches a card with the played card's name in the controller's discard", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": playedCard,
        "discard-1": sameNameCard,
      },
      zoneCards: { [`discard:${PLAYER_ONE}`]: ["discard-1"], [`play:${PLAYER_ONE}`]: [] },
    });
    const condition: Condition = { type: "played-card-name", zone: "discard" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("requireAbsent flips the match for in-play uniqueness checks", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": playedCard,
        "play-1": otherCard,
      },
      zoneCards: { [`play:${PLAYER_ONE}`]: ["played-1", "play-1"], [`discard:${PLAYER_ONE}`]: [] },
    });
    const condition: Condition = {
      type: "played-card-name",
      zone: "play",
      cardTypes: ["item"],
      excludeSelf: true,
      requireAbsent: true,
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("fails requireAbsent when another in-play item shares the name", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": playedCard,
        "play-1": sameNameCard,
      },
      zoneCards: { [`play:${PLAYER_ONE}`]: ["played-1", "play-1"], [`discard:${PLAYER_ONE}`]: [] },
    });
    const condition: Condition = {
      type: "played-card-name",
      zone: "play",
      cardTypes: ["item"],
      excludeSelf: true,
      requireAbsent: true,
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });
});

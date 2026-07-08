import { describe, expect, it } from "bun:test";
import type { CountEffect } from "@tcg/lorcana-types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveCountEffect } from "../count-effect";

describe("count", () => {
  it("records the number of distinct ink types across revealed cards", () => {
    const ctx = createTestContext({
      definitions: {
        r1: { id: "r1", cardType: "character" },
        r2: { id: "r2", cardType: "character" },
      },
    });
    // Stamp inkType onto the definitions (harness doesn't model it but the
    // resolver reads via getDefinition → structural cast).
    (ctx.cards.getDefinition("r1") as unknown as { inkType: string[] }).inkType = ["Amber", "Ruby"];
    (ctx.cards.getDefinition("r2") as unknown as { inkType: string[] }).inkType = ["Amber"];

    const effect: CountEffect = { type: "count", what: "distinct-revealed-ink-types" };
    const resolutionInput = { eventSnapshot: { revealedCardIds: ["r1", "r2"] } } as const;

    resolveCountEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      resolutionInput as never,
    );

    expect(
      (resolutionInput as { eventSnapshot: { triggerAmount?: number } }).eventSnapshot
        .triggerAmount,
    ).toBe(2);
  });

  it("records the number of distinct ink types among your characters in play", () => {
    const ctx = createTestContext({
      definitions: {
        amber: { id: "amber", cardType: "character", inkType: ["amber"] },
        rubySteel: { id: "ruby-steel", cardType: "character", inkType: ["ruby", "steel"] },
        item: { id: "item", cardType: "item", inkType: ["emerald"] },
        duplicateAmber: { id: "duplicate-amber", cardType: "character", inkType: ["amber"] },
      },
      zoneCards: {
        "play:player-one": ["amber", "rubySteel", "item"],
        "play:player-two": ["duplicateAmber"],
      },
    });
    const effect: CountEffect = {
      type: "count",
      what: "distinct-character-ink-types",
      controller: "you",
    };
    const resolutionInput = { eventSnapshot: {} } as const;

    resolveCountEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      resolutionInput as never,
    );

    expect(
      (resolutionInput as { eventSnapshot: { triggerAmount?: number } }).eventSnapshot
        .triggerAmount,
    ).toBe(3);
  });

  it("counts discarded action cards", () => {
    const ctx = createTestContext({
      definitions: {
        a1: { id: "a1", cardType: "action" },
        c1: { id: "c1", cardType: "character" },
      },
    });
    const effect: CountEffect = { type: "count", what: "discarded-action-cards" };
    const resolutionInput = { eventSnapshot: { discardedCardIds: ["a1", "c1"] } } as const;

    resolveCountEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      resolutionInput as never,
    );

    expect(
      (resolutionInput as { eventSnapshot: { triggerAmount?: number } }).eventSnapshot
        .triggerAmount,
    ).toBe(1);
  });

  it("counts discarded item cards", () => {
    const ctx = createTestContext({
      definitions: {
        i1: { id: "i1", cardType: "item" },
        c1: { id: "c1", cardType: "character" },
      },
    });
    const effect: CountEffect = { type: "count", what: "discarded-item-cards" };
    const resolutionInput = { eventSnapshot: { discardedCardIds: ["i1", "c1"] } } as const;

    resolveCountEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      resolutionInput as never,
    );

    expect(
      (resolutionInput as { eventSnapshot: { triggerAmount?: number } }).eventSnapshot
        .triggerAmount,
    ).toBe(1);
  });
});

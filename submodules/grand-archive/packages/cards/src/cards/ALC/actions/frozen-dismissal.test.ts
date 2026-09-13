import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "./reposition.ts";
import { frozenDismissal } from "./frozen-dismissal.ts";

/** @covers 8qgr2drym1-a1 */
describe("frozen-dismissal — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: frozenDismissal,
    discount: 1,
    preparation: "stack-target",
  });
});

/** @covers 8qgr2drym1-a2 */
describe("Frozen Dismissal — ally activation payment or banishment", () => {
  for (const pays of [false, true]) {
    it(`the ally activation's controller pays four=${pays}`, () => {
      const champion = createClassBonusTestChampion(frozenDismissal, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { hand: [frozenDismissal, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion,
          zones: { hand: Array.from({ length: 5 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const targetCard = opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      opponent.activate(targetCard);
      const targetActivation = game.state.stack.at(-1);
      if (targetActivation?.kind !== "card-activation")
        throw new Error("Expected ally card activation");
      opponent.pass();
      player.activate(frozenDismissal, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
        targets: { "target-stack-item": [targetActivation.id] },
      });
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({
        kind: "resolve-effect-payment",
        playerId: opponent.id,
      });
      const payment = opponent.cards(woodlandSquirrels, { zone: "hand" });
      if (pays) {
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-effect-payment", {
            reservePayment: payment.slice(0, 3).map((card) => ({
              kind: "card" as const,
              cardId: card.objectId,
            })),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(game, "resolve-effect-payment", {
          reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
        });
      } else answerDecision(game, "resolve-effect-payment", false);
      passEffectsStack(game);

      expect(opponent.cards(targetCard, { zone: pays ? "field" : "banishment" })).toHaveLength(1);
      expect(opponent.zone("memory")).toHaveLength(pays ? 4 : 0);
      expect(game.state.stack).toHaveLength(0);
    });
  }

  it("rejects a non-Ally card activation atomically", () => {
    const champion = createClassBonusTestChampion(frozenDismissal, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { hand: [frozenDismissal, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [reposition, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = opponent.card(woodlandSquirrels, { zone: "field" });
    const payment = opponent.card(woodlandSquirrels, { zone: "hand" });
    opponent.activate(reposition, {
      reservePayment: [{ kind: "card", cardId: payment.objectId }],
      targets: { "target-1": [ally.objectId] },
    });
    const actionActivation = game.state.stack.at(-1);
    if (actionActivation?.kind !== "card-activation")
      throw new Error("Expected action card activation");
    opponent.pass();
    const before = game.state;
    expect(() =>
      player.activate(frozenDismissal, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
        targets: { "target-stack-item": [actionActivation.id] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

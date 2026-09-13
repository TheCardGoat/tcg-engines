import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "./reposition.ts";
import { flashFreeze } from "./flash-freeze.ts";

/** @covers w3rrii17fz-a1 */
describe("flash-freeze — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: flashFreeze,
    discount: 2,
    preparation: "stack-target",
  });
});

function clericChampion(level: 0 | 1 | 2) {
  const base = lineageTestChampion("Flash Freeze", level);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        typeLine: {
          ...base.layout.face.typeLine,
          classes: ["CLERIC"],
          subtypes: ["CLERIC"],
        },
        elements: ["NORM", "WATER"] as const,
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

/** @covers w3rrii17fz-a2 */
describe("Flash Freeze — level payment or banishment", () => {
  for (const level of [1, 2] as const) {
    for (const pays of [false, true]) {
      it(`level ${level}, activation controller pays=${pays}`, () => {
        const starter = clericChampion(0);
        const opponentChampion = lineageTestChampion("Flash Freeze opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: Array.from({ length: level }, (_, index) =>
              clericChampion((index + 1) as 1 | 2),
            ),
            zones: { hand: [flashFreeze, woodlandSquirrels, woodlandSquirrels] },
          },
          playerTwo: {
            champion: opponentChampion,
            zones: { hand: Array.from({ length: level + 1 }, () => woodlandSquirrels) },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const targetCard = opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        opponent.activate(targetCard);
        const targetActivation = game.state.stack.at(-1);
        if (targetActivation?.kind !== "card-activation")
          throw new Error("Expected card activation");
        opponent.pass();
        player.activate(flashFreeze, {
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
          if (level === 2) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-payment", {
                reservePayment: [{ kind: "card", cardId: payment[0]!.objectId }],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-payment", {
            reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
          });
        } else answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);

        expect(opponent.cards(targetCard, { zone: pays ? "field" : "banishment" })).toHaveLength(1);
        expect(opponent.zone("memory")).toHaveLength(pays ? level : 0);
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }

  it("can negate and banish a non-Ally action activation", () => {
    const champion = clericChampion(0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        lineage: [clericChampion(1)],
        zones: { hand: [flashFreeze, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [reposition, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const targetCard = opponent.card(reposition, { zone: "hand" });
    const ally = opponent.card(woodlandSquirrels, { zone: "field" });
    const actionPayment = opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!;
    opponent.activate(targetCard, {
      reservePayment: [{ kind: "card", cardId: actionPayment.objectId }],
      targets: { "target-1": [ally.objectId] },
    });
    const targetActivation = game.state.stack.at(-1);
    if (targetActivation?.kind !== "card-activation") throw new Error("Expected action activation");
    opponent.pass();
    player.activate(flashFreeze, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-stack-item": [targetActivation.id] },
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    expect(opponent.cards(targetCard, { zone: "banishment" })).toHaveLength(1);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
  });
});

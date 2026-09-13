import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { assassinsMantle } from "../../P24/items/assassins-mantle.ts";
import { tetherInFlames } from "./tether-in-flames.ts";

/** @covers 215upufyoz-a1 */
describe("tether-in-flames — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: tetherInFlames,
    discount: 2,
    preparation: "stack-target",
  });
});

function clericChampion(level: 0 | 1 | 2) {
  const base = lineageTestChampion("Tether", level);
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
        elements: ["NORM", "FIRE"] as const,
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

/** @covers 215upufyoz-a2 */
describe("Tether in Flames — damage-or-negation choice", () => {
  for (const level of [0, 2] as const) {
    for (const acceptDamage of [false, true]) {
      it(`level ${level}, activation controller accepts damage=${acceptDamage}`, () => {
        const starter = clericChampion(0);
        const opponentChampion = lineageTestChampion("Tether opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: Array.from({ length: level }, (_, index) =>
              clericChampion((index + 1) as 1 | 2),
            ),
            zones: { hand: [tetherInFlames, woodlandSquirrels] },
          },
          playerTwo: {
            champion: opponentChampion,
            zones: { field: [assassinsMantle], hand: [woodlandSquirrels] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const targetCard = opponent.card(woodlandSquirrels, { zone: "hand" });
        opponent.activate(targetCard);
        const targetActivation = game.state.stack.at(-1);
        if (targetActivation?.kind !== "card-activation")
          throw new Error("Expected target card activation");
        opponent.pass();
        const payment = player.card(woodlandSquirrels, { zone: "hand" });
        player.activate(tetherInFlames, {
          reservePayment: [{ kind: "card", cardId: payment.objectId }],
          targets: { "target-stack-item": [targetActivation.id] },
        });
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-optional-effect",
          playerId: opponent.id,
        });
        answerDecision(game, "resolve-optional-effect", acceptDamage);
        passEffectsStack(game);

        const targetChampion = opponent.card(opponentChampion);
        if (acceptDamage) {
          expect(game.state.decision?.kind).toBe("choose-replacement");
          answerDecision(game, "choose-replacement", true);
          passEffectsStack(game);
          expect(game.state.objects[targetChampion.objectId]!.damage).toBe(1 + level);
          expect(opponent.cards(assassinsMantle, { zone: "banishment" })).toHaveLength(1);
          expect(opponent.cards(targetCard, { zone: "field" })).toHaveLength(1);
        } else {
          expect(game.state.objects[targetChampion.objectId]!.damage).toBe(0);
          expect(opponent.cards(assassinsMantle, { zone: "field" })).toHaveLength(1);
          expect(opponent.cards(targetCard, { zone: "graveyard" })).toHaveLength(1);
        }
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }
});

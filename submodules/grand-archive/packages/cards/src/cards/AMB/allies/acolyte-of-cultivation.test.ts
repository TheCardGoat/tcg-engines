import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { umbraSight } from "../../ALC/actions/umbra-sight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { acolyteOfCultivation } from "./acolyte-of-cultivation.ts";

function championFor(matching: boolean) {
  const champion = createClassBonusTestChampion(
    acolyteOfCultivation,
    matching,
    "activation-discount",
  );
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        elements: ["NORM", "FIRE", "WATER", "WIND", "LUXEM", "UMBRA"] as const,
      },
    },
  };
}

/** @covers nsowyyn6jt-a1 */
describe("Acolyte of Cultivation — Class Bonus Spell discount", () => {
  for (const classBonus of [false, true]) {
    for (const spellThisTurn of [false, true]) {
      it(`classBonus=${classBonus}, activated a Spell this turn=${spellThisTurn}`, () => {
        const champion = championFor(classBonus);
        const cost = classBonus && spellThisTurn ? 1 : 4;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                acolyteOfCultivation,
                umbraSight,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        if (spellThisTurn) {
          player.activate(umbraSight);
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", false);
          }
          passEffectsStack(game);
        }
        const payment = player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        const before = game.state;
        expect(() =>
          player.activate(acolyteOfCultivation, { reservePayment: payment.slice(0, cost - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        player.activate(acolyteOfCultivation, { reservePayment: payment });
        player.pass();
        game.player("player-two").pass();
        expect(player.cards(acolyteOfCultivation, { zone: "field" })).toHaveLength(1);
      });
    }
  }
});

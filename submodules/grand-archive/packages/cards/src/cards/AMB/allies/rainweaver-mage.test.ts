import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ordinaryHorse } from "./ordinary-horse.ts";
import { rainweaverMage } from "./rainweaver-mage.ts";

/** @covers qb6zhphtw6-a1 */
describe("Rainweaver Mage — Class Bonus On Enter empower", () => {
  for (const classBonus of [false, true]) {
    for (const accept of [false, true]) {
      it(`classBonus=${classBonus}, banish floating memory=${accept}`, () => {
        const champion = createClassBonusTestChampion(
          rainweaverMage,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [rainweaverMage, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              graveyard: [ordinaryHorse, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(rainweaverMage, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "qb6zhphtw6-a1",
          ),
        ).toBe(classBonus);
        const floating = player.card(ordinaryHorse, { zone: "graveyard" });
        const filler = player.card(woodlandSquirrels, { zone: "graveyard" });
        passEffectsStack(game);
        if (classBonus) {
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) {
            if (game.state.decision?.kind === "resolve-effect-choice") {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [filler.objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-effect-choice", [floating.objectId]);
            }
            passEffectsStack(game);
            expect(game.state.objects[floating.objectId]!.zone).toBe("banishment");
          } else passEffectsStack(game);
        }
        expect(game.state.players[player.id]!.states.empower ?? 0).toBe(
          classBonus && accept ? 4 : 0,
        );
      });
    }
  }
});

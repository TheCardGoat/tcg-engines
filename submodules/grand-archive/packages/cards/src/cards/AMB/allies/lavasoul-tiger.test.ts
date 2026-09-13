import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { wanderingGlaivier } from "./wandering-glaivier.ts";
import { pupilOfSacredFlames } from "./pupil-of-sacred-flames.ts";
import { lavasoulTiger } from "./lavasoul-tiger.ts";

/** @covers zq0dvl1m3z-a1 */
describe("Lavasoul Tiger — Pride 3", () => {
  provePrideAlly({ card: lavasoulTiger, pride: 3, power: 5 });
});

/** @covers zq0dvl1m3z-a2 */
describe("Lavasoul Tiger — Class Bonus lose Pride", () => {
  for (const classBonus of [false, true]) {
    for (const accept of [false, true]) {
      it(`classBonus=${classBonus}, banish two fire=${accept}`, () => {
        const champion = createClassBonusTestChampion(
          lavasoulTiger,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [lavasoulTiger, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              graveyard: [wanderingGlaivier, pupilOfSacredFlames, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(lavasoulTiger, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "zq0dvl1m3z-a2",
          ),
        ).toBe(classBonus);
        const fire = [
          player.card(wanderingGlaivier, { zone: "graveyard" }),
          player.card(pupilOfSacredFlames, { zone: "graveyard" }),
        ];
        const filler = player.card(woodlandSquirrels, { zone: "graveyard" });
        passEffectsStack(game);
        if (classBonus) {
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) {
            if (game.state.decision?.kind === "resolve-effect-choice") {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [fire[0]!.objectId, filler.objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(
                game,
                "resolve-effect-choice",
                fire.map((card) => card.objectId),
              );
            }
            passEffectsStack(game);
            expect(game.state.objects[fire[0]!.objectId]!.zone).toBe("banishment");
            expect(game.state.objects[fire[1]!.objectId]!.zone).toBe("banishment");
          } else passEffectsStack(game);
        }
        const ally = player.card(lavasoulTiger, { zone: "field" });
        const target = opponent.card(champion, { zone: "field" });
        if (classBonus && accept) {
          player.declareAttack(ally, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(5);
        } else {
          const before = game.state;
          expect(() => player.declareAttack(ally, target)).toThrow(
            /disobedient|cannot declare an attack/i,
          );
          expect(game.state).toEqual(before);
        }
      });
    }
  }
});

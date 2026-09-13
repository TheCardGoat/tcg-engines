import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  passEffectsStack,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { rendingFlames } from "./rending-flames.ts";
import { fireball } from "../actions/fireball.ts";
/** @covers soO3hjaVfN-a1 */
describe("Rending Flames doubles only its attack after a class-gated exact fire payment", () => {
  for (const bonus of [false, true])
    for (const accept of [false, true])
      for (const amount of [2, 4])
        it(`class=${bonus}, accept=${accept}, grave fire=${amount}`, () => {
          const champion = createClassBonusTestChampion(
            rendingFlames,
            bonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [rendingFlames, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
                graveyard: [...Array.from({ length: amount }, () => fireball), woodlandSquirrels],
                field: [woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { graveyard: [fireball] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion);
          p.activate(rendingFlames, {
            attackAttackerId: hero.objectId,
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, foe.objectId, "Rending Flames attack");
          passEffectsStack(game);
          if (bonus && game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
          }
          const paid = bonus && accept && amount >= 3;
          if (paid) {
            const chosen = p
              .cards(fireball, { zone: "graveyard" })
              .slice(0, 3)
              .map((c) => c.objectId);
            for (const invalid of [
              chosen.slice(0, 2),
              [...chosen, q.card(fireball).objectId],
              [chosen[0]!, chosen[1]!, p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
            ])
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            answerDecision(game, "resolve-effect-choice", chosen);
            passEffectsStack(game);
          }
          game.resolveCombatWithoutRetaliation();
          expect(p.cards(fireball, { zone: "banishment" })).toHaveLength(paid ? 3 : 0);
          expect(game.state.objects[foe.objectId]!.damage).toBe(paid ? 6 : 3);
          p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), foe);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage).toBe(paid ? 7 : 4);
        });
});

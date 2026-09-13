import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { fireball } from "../actions/fireball.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { embertailSquirrel } from "./embertail-squirrel.ts";
/** @covers W1vZwOXfG3-a1 */
describe("Embertail's optional fire discard on each attack", () => {
  for (const classBonus of [false, true])
    for (const available of [false, true])
      for (const accept of [false, true])
        it(`class=${classBonus}, available=${available}, pay=${accept}`, () => {
          const champion = createClassBonusTestChampion(
              embertailSquirrel,
              classBonus,
              "activation-discount",
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [embertailSquirrel, giantTortoise],
                  hand: [woodlandSquirrels, ...(available ? [fireball, blitzMage] : [])],
                  graveyard: [fireball],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: { hand: [fireball], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = q.card(champion);
          p.declareAttack(giantTortoise, hero);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(1);
          p.declareAttack(embertailSquirrel, hero);
          passEffectsStack(game);
          if (classBonus && available) {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept && available) {
              const before = game.state;
              for (const bad of [
                p.card(woodlandSquirrels, { zone: "hand" }),
                q.card(fireball),
                p.card(fireball, { zone: "graveyard" }),
              ]) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [
                p.card(fireball, { zone: "hand" }).objectId,
              ]);
              passEffectsStack(game);
            }
          }
          game.resolveCombatWithoutRetaliation();
          const damage = classBonus && available && accept ? 4 : 2;
          expect(game.state.objects[hero.objectId]!.damage).toBe(1 + damage);
          expect(p.cards(fireball, { zone: "graveyard" })).toHaveLength(damage === 4 ? 2 : 1);
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
          p.declareAttack(embertailSquirrel, hero);
          passEffectsStack(game);
          if (classBonus && available) {
            answerDecision(game, "resolve-optional-effect", false);
            passEffectsStack(game);
          }
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(3 + damage);
        });
});

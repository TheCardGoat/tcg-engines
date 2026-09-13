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
import { prodigiousBurstmage } from "./prodigious-burstmage.ts";
/** @covers l64yfOVhkp-a1 */
describe("Prodigious Burstmage's death loot", () => {
  for (const classBonus of [false, true])
    for (const discardNew of [false, true])
      it(`class=${classBonus}, discard drawn=${discardNew}`, () => {
        const champion = createClassBonusTestChampion(
            prodigiousBurstmage,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [prodigiousBurstmage],
                hand: [woodlandSquirrels],
                "main-deck": [fireball, giantTortoise],
              },
            },
            playerTwo: { champion, zones: { field: [blitzMage], hand: [fireball] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          old = p.card(woodlandSquirrels),
          top = p.zone("main-deck")[0]!;
        q.declareAttack(blitzMage, p.card(prodigiousBurstmage));
        expect(p.zone("hand")).toEqual([old]);
        advanceCombatToTrigger(game, "l64yfOVhkp-a1");
        expect(p.cards(prodigiousBurstmage, { zone: "graveyard" })).toHaveLength(1);
        expect(p.zone("hand")).toEqual([old]);
        passEffectsStack(game);
        if (classBonus) {
          expect(p.zone("hand")).toEqual([old, top]);
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(fireball).objectId]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [(discardNew ? top : old).objectId]);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(p.zone("hand")).toEqual(classBonus ? [discardNew ? old : top] : [old]);
        expect(p.zone("main-deck")).toHaveLength(classBonus ? 1 : 2);
        expect(q.zone("hand")).toHaveLength(1);
      });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { silvieLovedByAll } from "./silvie-loved-by-all.ts";

/** @covers GKEpAulogu-a1 */
describe("Silvie, Loved by All \u2014 GKEpAulogu-a1", () => {
  proveChampionLineage({ card: silvieLovedByAll, lineageName: "Silvie", level: 3, memoryCost: 3 });
});

/** @covers GKEpAulogu-a2 */
describe("Silvie gives controlled Animals and Beasts life and real interception", () => {
  for (const [ally, life, qualifies] of [
    [woodlandSquirrels, 1, true],
    [grayWolf, 2, true],
    [eagerPage, 3, false],
  ] as const)
    it(`ally=${ally.slug}`, () => {
      const starter = lineageTestChampion("Silvie", 0),
        opponent = lineageTestChampion("Opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          lineage: [
            lineageTestChampion("Silvie", 1),
            lineageTestChampion("Silvie", 2),
            silvieLovedByAll,
          ],
          zones: { field: [ally] },
        },
        playerTwo: { champion: opponent, zones: { field: [woodlandSquirrels, ally] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        unit = p.card(ally),
        hero = p.card(starter);
      const lifeOf = (id: typeof unit.objectId) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(lifeOf(unit.objectId)).toBe(life + (qualifies ? 1 : 0));
      const enemy = q.cards(ally, { zone: "field" })[0]!;
      expect(lifeOf(enemy.objectId)).toBe(life);
      q.declareAttack(q.cards(woodlandSquirrels, { zone: "field" })[0]!, hero);
      passEffectsStack(game);
      if (qualifies) {
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(game.state.combat?.targetIds).toEqual([unit.objectId]);
      }
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[unit.objectId]!.zone).toBe("field");
      expect(game.state.objects[unit.objectId]!.damage).toBe(qualifies ? 1 : 0);
      expect(game.state.objects[hero.objectId]!.damage).toBe(qualifies ? 0 : 1);
    });
});

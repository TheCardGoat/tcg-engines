import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { zanderAlwaysWatching } from "./zander-always-watching.ts";

/** @covers tOK1Gr0N8f-a1 */
describe("Zander, Always Watching \u2014 tOK1Gr0N8f-a1", () => {
  proveChampionLineage({
    card: zanderAlwaysWatching,
    lineageName: "Zander",
    level: 2,
    memoryCost: 2,
  });
});

/** @covers tOK1Gr0N8f-a2 */
describe("Zander Always Watching's inherited rested-target attack bonus", () => {
  for (const position of ["active", "inherited", "material-deck"])
    for (const rested of [false, true])
      it(`${position}, target rested=${rested}`, () => {
        const starter = lineageTestChampion("Zander", 0),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion: starter,
              lineage: [
                lineageTestChampion("Zander", 1),
                ...(position === "material-deck"
                  ? [lineageTestChampion("Zander", 2)]
                  : [zanderAlwaysWatching]),
                ...(position === "inherited" ? [lineageTestChampion("Zander", 3)] : []),
              ],
              zones: {
                "material-deck": position === "material-deck" ? [zanderAlwaysWatching] : [],
                field: [trainingSword, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: starter,
              zones: {
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          target = q.card(giantTortoise);
        if (rested) {
          q.declareAttack(target, hero);
          game.resolveCombatWithoutRetaliation();
        }
        advanceToMain(game, p.id);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(rested);
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        p.declareAttack(hero, target, { weaponIds: [p.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          position !== "material-deck" && rested ? 3 : 2,
        );
        advanceToMain(game, q.id);
        q.declareAttack(target, hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(rested ? 2 : 1);
      });
});

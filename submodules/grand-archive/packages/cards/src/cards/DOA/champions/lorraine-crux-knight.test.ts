import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { hoarfrostSpine } from "../../AMB/weapons/hoarfrost-spine.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { lorraineCruxKnight } from "./lorraine-crux-knight.ts";

/** @covers NfbZ0nouSQ-a1 */
describe("Lorraine, Crux Knight \u2014 NfbZ0nouSQ-a1", () => {
  proveChampionLineage({
    card: lorraineCruxKnight,
    lineageName: "Lorraine",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers NfbZ0nouSQ-a2 */
describe("Lorraine Crux Knight's banished regalia weapons", () => {
  for (const count of [0, 1, 3])
    it(`counts ${count} qualifying cards, then a weapon expended in combat`, () => {
      const starter = lineageTestChampion("Lorraine", 0),
        opponent = createClassBonusTestChampion(trainingSword, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: [
              lineageTestChampion("Lorraine", 1),
              lineageTestChampion("Lorraine", 2),
              lorraineCruxKnight,
            ],
            zones: {
              field: [curvedDagger, trainingSword, woodlandSquirrels],
              banishment: [
                ...Array.from({ length: count }, () => trainingSword),
                hoarfrostSpine,
                jewelOfEnlightenment,
              ],
              graveyard: [trainingSword],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [trainingSword],
              banishment: [trainingSword, trainingSword],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        target = q.card(opponent),
        dagger = p.card(curvedDagger);
      p.declareAttack(hero, target, { weaponIds: [dagger.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(1 + count);
      expect(game.state.objects[dagger.objectId]!.zone).toBe("banishment");
      p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(2 + count);
      advanceToMain(game, q.id);
      q.declareAttack(target, hero, {
        weaponIds: [q.card(trainingSword, { zone: "field" }).objectId],
      });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      p.declareAttack(hero, target, {
        weaponIds: [p.card(trainingSword, { zone: "field" }).objectId],
      });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(4 + 2 * count);
    });
});

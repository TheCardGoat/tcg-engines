import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { galahadCourtKnight } from "./galahad-court-knight.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
/** @covers eO5wsjwRyQ-a2 */
describe("Galahad's class bonus permits only its controller's Sword weapons", () => {
  for (const classBonus of [false, true])
    it(`class=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
          galahadCourtKnight,
          classBonus,
          "activation-discount",
        ),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [galahadCourtKnight, woodlandSquirrels, trainingSword, curvedDagger],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [trainingSword], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        ally = p.card(galahadCourtKnight),
        sword = p.card(trainingSword),
        foe = q.card(champion),
        before = game.state;
      for (const weapon of [q.card(trainingSword), p.card(curvedDagger)]) {
        expect(() => p.declareAttack(ally, foe, { weaponIds: [weapon.objectId] })).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(() =>
        p.declareAttack(p.card(woodlandSquirrels), foe, { weaponIds: [sword.objectId] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (!classBonus) {
        expect(() => p.declareAttack(ally, foe, { weaponIds: [sword.objectId] })).toThrow();
        expect(game.state).toEqual(before);
        p.declareAttack(ally, foe);
      } else p.declareAttack(ally, foe, { weaponIds: [sword.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(classBonus ? 2 : 1);
      expect(game.state.objects[sword.objectId]!.counters.durability).toBe(classBonus ? 1 : 2);
      expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      p.declareAttack(ally, foe, classBonus ? { weaponIds: [sword.objectId] } : {});
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(classBonus ? 4 : 2);
      expect(game.state.objects[sword.objectId]!.zone).toBe(classBonus ? "banishment" : "field");
    });
});

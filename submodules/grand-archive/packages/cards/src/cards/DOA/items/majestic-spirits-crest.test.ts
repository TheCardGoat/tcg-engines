import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { majesticSpiritsCrest } from "./majestic-spirits-crest.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers Tx6iJQNSA6-a1 */
describe("Crest grants the champion a turn of attack draws", () => {
  for (const classBonus of [false, true])
    it(`class=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
          majesticSpiritsCrest,
          classBonus,
          "activation-discount",
        ),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [majesticSpiritsCrest, trainingSword, woodlandSquirrels],
              "main-deck": [giantTortoise, woodlandSquirrels, giantTortoise],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        target = q.card(champion),
        crest = p.card(majesticSpiritsCrest);
      if (!classBonus) {
        const before = game.state;
        expect(() => p.activateAbility(crest, "Tx6iJQNSA6-a1")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activateAbility(crest, "Tx6iJQNSA6-a1");
      expect(p.card(majesticSpiritsCrest, { zone: "banishment" }).objectId).toBe(crest.objectId);
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(() => p.activateAbility(crest, "Tx6iJQNSA6-a1")).toThrow();
      p.declareAttack(woodlandSquirrels, target);
      game.resolveCombatWithoutRetaliation();
      expect(p.zone("hand")).toHaveLength(0);
      const top = p.zone("main-deck")[0]!;
      p.declareAttack(hero, target, { weaponIds: [p.card(trainingSword).objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(p.zone("hand")).toEqual([top]);
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
      advanceToMain(game, q.id);
      q.declareAttack(woodlandSquirrels, hero);
      game.resolveCombatWithoutRetaliation();
      expect(p.zone("hand")).toHaveLength(1);
      advanceToMain(game, p.id);
      const hand = p.zone("hand");
      p.declareAttack(hero, target, { weaponIds: [p.card(trainingSword).objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(p.zone("hand")).toEqual(hand);
    });
});

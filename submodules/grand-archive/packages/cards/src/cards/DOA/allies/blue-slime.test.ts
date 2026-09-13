import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { blitzMage } from "./blitz-mage.ts";
import { enduraScepterOfIgnition } from "../items/endura-scepter-of-ignition.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { blueSlime } from "./blue-slime.ts";

/** @covers 1Sl4Gq2OuV-a1 */
describe("Blue Slime \u2014 1Sl4Gq2OuV-a1", () => {
  provePrideAlly({ card: blueSlime, pride: 4, power: 1 });
});

/** @covers 1Sl4Gq2OuV-a2 */
describe("Blue Slime's damage-event buff counters", () => {
  for (const classBonus of [false, true])
    it(`class=${classBonus}: one counter per damage event, including noncombat`, () => {
      const champion = grantTestChampionLevel(
          createClassBonusTestChampion(blueSlime, classBonus, "activation-discount"),
          4,
        ),
        opponent = createClassBonusTestChampion(
          enduraScepterOfIgnition,
          false,
          "activation-discount",
        ),
        game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: { field: [blueSlime, giantTortoise], "main-deck": [woodlandSquirrels] },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [blitzMage, woodlandSquirrels, enduraScepterOfIgnition, jewelOfEnlightenment],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        slime = p.card(blueSlime),
        other = p.card(giantTortoise);
      q.declareAttack(blitzMage, slime);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[slime.objectId]!.damage).toBe(3);
      expect(game.state.objects[slime.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
      q.declareAttack(woodlandSquirrels, other);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[slime.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
      q.activateAbility(jewelOfEnlightenment, "AKA19OwaCh-a1");
      passEffectsStack(game);
      q.activateAbility(enduraScepterOfIgnition, "SGsDKB9CN5-a1", {
        targets: { "target-1": [classBonus ? slime.objectId : other.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[slime.objectId]!.counters.buff ?? 0).toBe(classBonus ? 2 : 0);
      expect(game.state.objects[other.objectId]!.counters.buff ?? 0).toBe(0);
      advanceToMain(game, p.id);
      expect(game.state.objects[slime.objectId]!.counters.buff ?? 0).toBe(classBonus ? 2 : 0);
      p.declareAttack(slime, q.card(opponent));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(classBonus ? 3 : 1);
    });
});

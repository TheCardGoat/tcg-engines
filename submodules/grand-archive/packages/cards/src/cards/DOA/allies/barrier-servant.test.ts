import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { barrierServant } from "./barrier-servant.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { blitzMage } from "./blitz-mage.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers xW6SZSlJX6-a2 */
describe("Barrier Servant spends its controller's enlighten for one self shield", () => {
  for (const expired of [false, true])
    it(`shield expired=${expired}`, () => {
      const champion = createClassBonusTestChampion(barrierServant, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [barrierServant, barrierServant, jewelOfEnlightenment, jewelOfEnlightenment],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, giantTortoise, blitzMage],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        [source, other] = p.cards(barrierServant);
      if (!source || !other) throw new Error("Two servants required");
      const ability = "xW6SZSlJX6-a2";
      for (const jewel of p.cards(jewelOfEnlightenment)) {
        const before = game.state;
        expect(() => p.activateAbility(source, ability)).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(jewel, "AKA19OwaCh-a1");
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.counters.enlighten).toBe(2);
      if (!expired) {
        advanceToMain(game, q.id);
        q.pass();
      }
      p.activateAbility(source, ability);
      expect(game.state.objects[hero.objectId]!.counters.enlighten).toBe(0);
      passEffectsStack(game);
      if (expired) advanceToMain(game, q.id);
      else {
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
      }
      q.declareAttack(woodlandSquirrels, other);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[other.objectId]!.damage).toBe(1);
      q.declareAttack(blitzMage, source);
      game.resolveCombatWithoutRetaliation();
      if (expired) {
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        return;
      }
      expect(game.state.objects[source.objectId]!.damage).toBe(0);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      q.declareAttack(giantTortoise, source);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[source.objectId]!.damage).toBe(1);
      q.pass();
      const before = game.state;
      expect(() => p.activateAbility(source, ability)).toThrow();
      expect(game.state).toEqual(before);
    });
});

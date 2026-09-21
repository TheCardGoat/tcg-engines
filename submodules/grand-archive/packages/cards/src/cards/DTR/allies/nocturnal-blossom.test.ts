import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { nocturnalBlossom } from "./nocturnal-blossom.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 39srnovht1-a2 */
describe("Nocturnal Blossom — controller's end-phase recovery", () => {
  for (const damage of [0, 1, 3])
    it(`recovers one from ${damage} damage at its controller's end phase`, () => {
      const champion = createClassBonusTestChampion(nocturnalBlossom, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { field: [nocturnalBlossom], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion,
          zones: {
            field: Array.from({ length: damage }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      for (const attacker of q.cards(woodlandSquirrels)) {
        q.declareAttack(attacker, hero);
        game.resolveCombatWithoutRetaliation();
      }
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      advanceToMain(game, p.id);
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      for (let step = 0; step < 32 && !game.state.stack.length; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(
        game.state.stack.some(
          (s) => s.kind === "triggered-ability" && s.ability.id === "39srnovht1-a2",
        ),
      ).toBe(true);
      expect(game.state.turn.phase).toBe("end");
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 1));
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
    });
});

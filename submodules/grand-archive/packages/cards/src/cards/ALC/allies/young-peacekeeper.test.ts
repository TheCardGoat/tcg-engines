import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { youngPeacekeeper } from "./young-peacekeeper.ts";

/** @covers z4pyx8bd7o-a1 @covers z4pyx8bd7o-a2 */
describe("Young Peacekeeper — fostered power and life", () => {
  for (const fostered of [false, true]) {
    it(`deals ${fostered ? 2 : 1} damage and has ${fostered ? 3 : 2} life when fostered=${fostered}`, () => {
      const champion = createClassBonusTestChampion(youngPeacekeeper, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [youngPeacekeeper, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [automatedGardener, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ally = player.card(youngPeacekeeper);
      expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(false);
      if (fostered) {
        advanceToRecollection(game, opponent.id);
        advanceToRecollection(game, player.id);
        passEffectsStack(game);
        for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
      }
      expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(fostered);
      const target = opponent.card(champion);
      player.declareAttack(ally, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(fostered ? 2 : 1);
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== player.id)
        game.player(wait.playerId).pass();
      player.declareAttack(woodlandSquirrels, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(fostered ? 3 : 2);
      advanceToRecollection(game, opponent.id);
      for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
        const next = game.waitState();
        if (next.kind !== "opportunity") throw new Error(`Unexpected ${next.kind}`);
        game.player(next.playerId).pass();
      }
      opponent.declareAttack(automatedGardener, ally);
      game.resolveCombatWithoutRetaliation();
      expect(player.cards(youngPeacekeeper, { zone: "field" })).toHaveLength(fostered ? 1 : 0);
      if (fostered) {
        expect(game.state.objects[ally.objectId]!.damage).toBe(2);
        expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(true);
        const next = game.waitState();
        if (next.kind === "opportunity" && next.playerId !== opponent.id)
          game.player(next.playerId).pass();
        opponent.declareAttack(woodlandSquirrels, ally);
        game.resolveCombatWithoutRetaliation();
      }
      expect(player.zone("graveyard")).toEqual([ally]);
    });
  }
});

/** @covers z4pyx8bd7o-a3 */
describe("Young Peacekeeper — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: youngPeacekeeper });
});

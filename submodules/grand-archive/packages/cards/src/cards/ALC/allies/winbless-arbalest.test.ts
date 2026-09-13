import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { winblessArbalest } from "./winbless-arbalest.ts";

/** @covers m4o98vn1vo-a1 */
describe("winbless-arbalest — Ranged", () => {
  proveRangedAlly({ card: winblessArbalest, power: 2, ranged: 2, classBonus: false });
});

/** @covers m4o98vn1vo-a2 */
describe("Winbless Arbalest — Class Bonus Vigor", () => {
  for (const classBonus of [false, true]) {
    for (const owner of ["player-one", "player-two"] as const) {
      it(`Class Bonus=${classBonus}, controller=${owner}`, () => {
        const champion = createClassBonusTestChampion(
          winblessArbalest,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: owner === "player-one" ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: { field: owner === "player-one" ? [winblessArbalest, woodlandSquirrels] : [] },
          },
          playerTwo: {
            champion,
            zones: { field: owner === "player-two" ? [winblessArbalest, woodlandSquirrels] : [] },
          },
        });
        const player = game.player(owner);
        const opponent = game.player(owner === "player-one" ? "player-two" : "player-one");
        const ally = player.card(winblessArbalest);
        const squirrel = player.card(woodlandSquirrels);
        for (const attacker of [ally, squirrel]) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          player.declareAttack(attacker, opponent.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
        }
        for (let step = 0; game.state.turn.phase !== "end" && step < 16; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("end");
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === "m4o98vn1vo-a2",
          ),
        ).toHaveLength(classBonus ? 1 : 0);
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!classBonus);
        expect(game.state.objects[squirrel.objectId]!.states.has("rested")).toBe(true);
        // This is Vigor, not the next turn's ordinary wake-up action.
        advanceToRecollection(game, opponent.id);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!classBonus);
        expect(game.state.objects[squirrel.objectId]!.states.has("rested")).toBe(true);
      });
    }
  }
});

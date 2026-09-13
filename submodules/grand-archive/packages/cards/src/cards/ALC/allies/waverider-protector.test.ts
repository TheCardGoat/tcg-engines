import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { waveriderProtector } from "./waverider-protector.ts";

/** @covers pufyoz23yf-a2 */
describe("Waverider Protector — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: waveriderProtector });
});

/** @covers pufyoz23yf-a1 */
describe("Waverider Protector — conditional Taunt", () => {
  for (const classBonus of [false, true]) {
    for (const rested of [false, true]) {
      for (const targetKind of ["champion", "ally"] as const) {
        it(`Class Bonus=${classBonus}, rested=${rested}, protected target=${targetKind}`, () => {
          const champion = createClassBonusTestChampion(
            waveriderProtector,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: rested ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [waveriderProtector, woodlandSquirrels],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [automatedGardener, automatedGardener],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const defender = game.player("player-one");
          const attacker = game.player("player-two");
          const protector = defender.card(waveriderProtector);
          const ownChampion = defender.card(champion);
          const otherAlly = defender.card(woodlandSquirrels, { zone: "field" });
          if (rested) {
            defender.declareAttack(protector, attacker.card(champion));
            game.resolveCombatWithoutRetaliation();
            advanceToRecollection(game, attacker.id);
            for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          expect(game.state.objects[protector.objectId]!.states.has("rested")).toBe(rested);
          const target = targetKind === "champion" ? ownChampion : otherAlly;
          const gardeners = attacker.cards(automatedGardener);
          const taunting = classBonus && !rested;
          if (taunting) {
            const before = game.state;
            expect(() => attacker.declareAttack(gardeners[0]!, target)).toThrow();
            expect(game.state).toEqual(before);
          } else {
            attacker.declareAttack(gardeners[0]!, target);
            game.resolveCombatWithoutRetaliation();
            if (targetKind === "champion")
              expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
            else expect(defender.zone("graveyard")).toContainEqual(otherAlly);
          }
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== attacker.id)
            game.player(wait.playerId).pass();
          // Attacking the Protector itself remains legal in every condition.
          attacker.declareAttack(gardeners[taunting ? 0 : 1]!, protector);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[protector.objectId]!.damage).toBe(2);
          expect(defender.cards(waveriderProtector, { zone: "field" })).toEqual([protector]);
          if (taunting) {
            expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
            expect(defender.cards(woodlandSquirrels, { zone: "field" })).toEqual([otherAlly]);
          }
        });
      }
    }
  }
});

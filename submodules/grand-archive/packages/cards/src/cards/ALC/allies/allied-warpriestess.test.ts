import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { alliedWarpriestess } from "./allied-warpriestess.ts";

/** @covers 2tsn0ye3ae-a1 @covers 2tsn0ye3ae-a2 */
describe("Allied Warpriestess — independent Class Bonus and Memory restrictions", () => {
  for (const classBonus of [false, true])
    for (const memoryCount of [3, 4, 5]) {
      for (const curses of [0, 1, 2]) {
        it(`Cleric champion=${classBonus}, memory=${memoryCount}, initial damage=${curses === 2 ? 6 : curses * 2}`, () => {
          // Umbra enables the public self-damage setup; Cleric matches one of Warpriestess's classes.
          const champion = createClassBonusTestChampion(
            umbraSight,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [alliedWarpriestess, alliedWarpriestess, woodlandSquirrels],
                hand: Array.from({ length: curses }, () => umbraSight),
                memory: Array.from({ length: memoryCount - curses }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                memory: Array.from({ length: 5 }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const ownChampion = player.card(champion);
          const target = opponent.card(champion);
          for (let i = 0; i < curses; i++) {
            player.activate(player.cards(umbraSight, { zone: "hand" })[0]!);
            passEffectsStack(game);
            answerDecision(game, "resolve-optional-effect", true);
            passEffectsStack(game);
          }
          let damage = curses === 2 ? 6 : curses * 2;
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
          expect(player.zone("memory")).toHaveLength(memoryCount);
          player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), target);
          expect(game.state.stack).toHaveLength(0);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
          const allies = player.cards(alliedWarpriestess);
          for (const [index, ally] of allies.entries()) {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId !== player.id)
              game.player(wait.playerId).pass();
            player.declareAttack(ally, target);
            expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
            expect(
              game.state.stack.filter(
                (item) => item.kind === "triggered-ability" && item.sourceId === ally.objectId,
              ),
            ).toHaveLength(memoryCount >= 4 ? 1 : 0);
            passEffectsStack(game);
            if (memoryCount >= 4) damage = Math.max(0, damage - 2);
            expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
            expect(game.state.objects[target.objectId]!.damage).toBe(
              1 + index * (classBonus ? 2 : 1),
            );
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[target.objectId]!.damage).toBe(
              1 + (index + 1) * (classBonus ? 2 : 1),
            );
          }
          advanceToRecollection(game, opponent.id);
          advanceToRecollection(game, player.id);
          for (let step = 0; game.state.turn.phase !== "main" && step < 24; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          expect(player.zone("memory")).toHaveLength(0);
          player.declareAttack(allies[0]!, target);
          expect(game.state.stack).toHaveLength(0);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
          expect(game.state.objects[target.objectId]!.damage).toBe(1 + 3 * (classBonus ? 2 : 1));
        });
      }
    }
});

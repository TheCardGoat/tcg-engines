import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { imperialPanzer } from "./imperial-panzer.ts";

function reachPhase(game: GrandArchiveTestEngine, phase: "main" | "end") {
  for (let step = 0; game.state.turn.phase !== phase && step < 24; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.turn.phase).toBe(phase);
}

/** @covers 46neis2lho-a1 @covers 46neis2lho-a2 */
describe("Imperial Panzer — conditional power, life, and Vigor", () => {
  for (const classBonus of [false, true]) {
    for (const fostered of [false, true]) {
      it(`Class Bonus=${classBonus}, fostered=${fostered}`, () => {
        const champion = createClassBonusTestChampion(
          imperialPanzer,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [imperialPanzer, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [automatedGardener, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ally = player.card(imperialPanzer);
        const squirrel = player.card(woodlandSquirrels, { zone: "field" });
        if (fostered) {
          advanceToRecollection(game, opponent.id);
          advanceToRecollection(game, player.id);
          passEffectsStack(game);
          reachPhase(game, "main");
        }
        expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(fostered);
        const active = classBonus && fostered;
        const target = opponent.card(champion);
        for (const attacker of [ally, squirrel]) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          player.declareAttack(attacker, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            (active ? 3 : 2) + (attacker === squirrel ? 1 : 0),
          );
        }
        reachPhase(game, "end");
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.stack.filter((item) => item.kind === "triggered-ability")).toHaveLength(
          active ? 1 : 0,
        );
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!active);
        expect(game.state.objects[squirrel.objectId]!.states.has("rested")).toBe(true);
        advanceToRecollection(game, opponent.id);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!active);
        reachPhase(game, "main");
        opponent.declareAttack(automatedGardener, ally);
        game.resolveCombatWithoutRetaliation();
        expect(player.cards(imperialPanzer, { zone: "field" })).toHaveLength(active ? 1 : 0);
        if (active) {
          expect(game.state.objects[ally.objectId]!.damage).toBe(2);
          const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
          for (const [index, attacker] of attackers.entries()) {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
              game.player(wait.playerId).pass();
            opponent.declareAttack(attacker, ally);
            game.resolveCombatWithoutRetaliation();
            expect(player.cards(imperialPanzer, { zone: "field" })).toHaveLength(
              index === 0 ? 1 : 0,
            );
            if (index === 0) {
              expect(game.state.objects[ally.objectId]!.damage).toBe(3);
              expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(true);
            }
          }
        }
        expect(player.zone("graveyard")).toEqual([ally]);
      });
    }
  }
});

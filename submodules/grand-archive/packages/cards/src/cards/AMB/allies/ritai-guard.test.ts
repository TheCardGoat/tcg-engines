import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { ritaiGuard } from "./ritai-guard.ts";

function passToPlayerMain(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 64; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach main");
}

function passToEnd(game: GrandArchiveTestEngine): void {
  for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.phase).toBe("end");
}

/** @covers jbc30d18ys-a1 */
describe("Ritai Guard — Class Bonus Equestrian Taunt and Vigor", () => {
  for (const classBonus of [false, true]) {
    for (const horse of [false, true]) {
      it(`Class Bonus=${classBonus}, Horse=${horse}`, () => {
        const champion = createClassBonusTestChampion(
          ritaiGuard,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: horse ? [ritaiGuard, galesMare] : [ritaiGuard, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [automatedGardener, automatedGardener],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const guard = player.card(ritaiGuard, { zone: "field" });
        const other = player.card(horse ? galesMare : woodlandSquirrels, { zone: "field" });
        const attackers = opponent.cards(automatedGardener, { zone: "field" });
        const taunting = classBonus && horse;
        if (taunting) {
          const before = game.state;
          expect(() => opponent.declareAttack(attackers[0]!, other)).toThrow();
          expect(game.state).toEqual(before);
        } else {
          opponent.declareAttack(attackers[0]!, player.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(2);
        }
        passToPlayerMain(game, player.id);
        player.declareAttack(guard, opponent.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[guard.objectId]!.states.has("rested")).toBe(true);
        passToEnd(game);
        passEffectsStack(game);
        expect(game.state.objects[guard.objectId]!.states.has("rested")).toBe(
          !(classBonus && horse),
        );
      });
    }
  }
});

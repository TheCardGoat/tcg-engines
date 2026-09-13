import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { supplyDrone } from "./supply-drone.ts";
import { manicZealot } from "./manic-zealot.ts";

/** @covers ttkk39i1f0-a1 */
describe("Manic Zealot — each champion takes death damage", () => {
  for (const owner of ["player-one", "player-two"] as const) {
    for (const dies of [false, true]) {
      it(`owner=${owner}, Zealot itself dies=${dies}`, () => {
        const champion = createClassBonusTestChampion(manicZealot, false, "activation-discount");
        const defenders = [manicZealot, manicZealot, woodlandSquirrels, supplyDrone];
        const attackers = [automatedGardener, automatedGardener, supplyDrone];
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: owner === "player-one" ? "playerTwo" : "playerOne",
          playerOne: { champion, zones: { field: owner === "player-one" ? defenders : attackers } },
          playerTwo: { champion, zones: { field: owner === "player-two" ? defenders : attackers } },
        });
        const defender = game.player(owner);
        const attacker = game.player(owner === "player-one" ? "player-two" : "player-one");
        const champions = [defender.card(champion), attacker.card(champion)];
        const victims = dies ? defender.cards(manicZealot) : [defender.card(woodlandSquirrels)];
        const attackingAllies = attacker.cards(automatedGardener);
        for (const [index, victim] of victims.entries()) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== attacker.id)
            game.player(wait.playerId).pass();
          attacker.declareAttack(attackingAllies[index]!, victim);
          advanceCombatToTrigger(game, "ttkk39i1f0-a1");
          expect(defender.zone("graveyard")).toContainEqual(victim);
          for (const ref of champions)
            expect(game.state.objects[ref.objectId]!.damage).toBe(dies ? index * 2 : 0);
          expect(
            game.state.stack.filter(
              (item) => item.kind === "triggered-ability" && item.ability.id === "ttkk39i1f0-a1",
            ),
          ).toHaveLength(dies ? 1 : 0);
          passEffectsStack(game);
          for (const ref of champions)
            expect(game.state.objects[ref.objectId]!.damage).toBe(dies ? (index + 1) * 2 : 0);
          if (game.state.combat) game.resolveCombatWithoutRetaliation();
          for (const player of [defender, attacker])
            expect(game.state.objects[player.card(supplyDrone).objectId]!.damage).toBe(0);
          for (const ref of attackingAllies)
            expect(game.state.objects[ref.objectId]!.damage).toBe(0);
        }
      });
    }
  }
});

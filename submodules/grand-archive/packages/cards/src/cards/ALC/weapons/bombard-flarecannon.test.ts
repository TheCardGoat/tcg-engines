import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { steelSlug } from "../../MRC/items/steel-slug.ts";
import { incendiaryShot } from "../../P24/items/incendiary-shot.ts";
import { bombardFlarecannon } from "./bombard-flarecannon.ts";

/** @covers oqk1l75tlz-a1 */
describe("Bombard Flarecannon — fire intent and defending player's units", () => {
  for (const polkhawk of [false, true]) {
    for (const fire of [false, true]) {
      for (const targetsChampion of [false, true]) {
        it(`checks Polkhawk ${polkhawk}, fire intent ${fire}, and champion target ${targetsChampion}`, () => {
          const champion = lineageTestChampion(polkhawk ? "Polkhawk" : "Other", 0);
          const opponentChampion = lineageTestChampion("Defender", 0);
          const bullet = fire ? incendiaryShot : steelSlug;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: { champion, zones: { field: [bombardFlarecannon, bullet, supplyDrone] } },
            playerTwo: {
              champion: opponentChampion,
              zones: { field: [supplyDrone, woodlandSquirrels, incendiaryShot] },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const attacker = player.card(champion, { zone: "field" });
          const defender = opponent.card(opponentChampion, { zone: "field" });
          const opposingAlly = opponent.card(supplyDrone, { zone: "field" });
          const squirrel = opponent.card(woodlandSquirrels, { zone: "field" });
          const ownAlly = player.card(supplyDrone, { zone: "field" });
          const opposingItem = opponent.card(incendiaryShot, { zone: "field" });
          const gun = player.card(bombardFlarecannon, { zone: "field" });
          player.activateAbility(bullet, fire ? "3qu7d6sopo-a1" : "ao8bki6fxx-a2", {
            targets: { "target-weapon": [gun.objectId] },
          });
          passEffectsStack(game);
          player.declareAttack(attacker, targetsChampion ? defender : opposingAlly, {
            weaponIds: [gun.objectId],
          });
          advanceCombatToTrigger(game, "oqk1l75tlz-a1");
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "oqk1l75tlz-a1",
            ),
          ).toBe(polkhawk);
          if (!polkhawk) {
            // Combat has completed without a trigger; only its chosen target took damage.
            const untouched = targetsChampion ? opposingAlly : defender;
            expect(game.state.objects[untouched.objectId]!.damage).toBe(0);
            expect(game.state.objects[squirrel.objectId]!.zone).toBe("field");
            for (const ref of [attacker, ownAlly, opposingItem])
              expect(game.state.objects[ref.objectId]!.damage).toBe(0);
            return;
          }
          for (const ref of [defender, opposingAlly, squirrel, attacker, ownAlly, opposingItem])
            expect(game.state.objects[ref.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          for (const ref of [defender, opposingAlly])
            expect(game.state.objects[ref.objectId]!.damage).toBe(fire ? 2 : 0);
          expect(game.state.objects[squirrel.objectId]!.zone).toBe(fire ? "graveyard" : "field");
          for (const ref of [attacker, ownAlly, opposingItem])
            expect(game.state.objects[ref.objectId]!.damage).toBe(0);
          expect(game.state.objects[opposingItem.objectId]!.zone).toBe("field");
        });
      }
    }
  }
});

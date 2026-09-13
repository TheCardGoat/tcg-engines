import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { rustedWarshield } from "./rusted-warshield.ts";

/** @covers fp66pv4n1n-a1 */
describe("Rusted Warshield — shielding prevention and memory draw", () => {
  it("banishes as cost, draws on resolution, and shields only its champion's next two damage", () => {
    const champion = createClassBonusTestChampion(rustedWarshield, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { field: [rustedWarshield, supplyDrone], "main-deck": [woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: { field: [automatedGardener, automatedGardener, automatedGardener] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const shield = player.card(rustedWarshield, { zone: "field" });
    const topCard = player.zone("main-deck")[0]!;
    opponent.pass();
    player.activateAbility(shield, "fp66pv4n1n-a1");
    expect(game.state.objects[shield.objectId]!.zone).toBe("banishment");
    expect(player.zone("memory")).toHaveLength(0);
    passEffectsStack(game);
    expect(player.zone("memory")).toEqual([topCard]);

    const attackers = opponent.cards(automatedGardener, { zone: "field" });
    const ally = player.card(supplyDrone, { zone: "field" });
    const ownChampion = player.card(champion, { zone: "field" });
    opponent.declareAttack(attackers[0]!, ally);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ally.objectId]!.damage).toBe(2);

    opponent.declareAttack(attackers[1]!, ownChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);

    opponent.declareAttack(attackers[2]!, ownChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
  });
});

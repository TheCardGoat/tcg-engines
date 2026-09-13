import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ninjaTabi } from "./ninja-tabi.ts";

/** @covers imcmo3l3th-a1 */
describe("Ninja Tabi — agility 3", () => {
  it("banishes itself to grant agility 3 for this turn", () => {
    const champion = createClassBonusTestChampion(ninjaTabi, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [ninjaTabi],
          memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activateAbility(ninjaTabi, "imcmo3l3th-a1");
    expect(player.cards(ninjaTabi, { zone: "field" })).toHaveLength(0);
    expect(game.state.players[player.id]!.states.agility).not.toBe(true);
    passEffectsStack(game);
    expect(player.card(ninjaTabi, { zone: "banishment" }).definitionId).toBe(ninjaTabi.canonicalId);
    expect(game.state.players[player.id]!.states.agility).toBe(true);
    expect(game.state.players[player.id]!.states["agility-amount"] ?? 3).toBe(3);
  });
});

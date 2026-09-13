import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { bellonasRunestone } from "./bellonas-runestone.ts";

/** @covers clgolelsra-a1 */
describe("Bellona's Runestone — weapon power and durability", () => {
  it("banishes itself to give a controlled weapon +2 POWER and a durability counter", () => {
    const champion = createClassBonusTestChampion(bellonasRunestone, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [bellonasRunestone, trainingSword] } },
      playerTwo: { champion, zones: { field: [trainingSword] } },
    });
    const player = game.player("player-one");
    const weapon = player.card(trainingSword, { zone: "field" });
    const opposing = game.player("player-two").card(trainingSword, { zone: "field" });
    const before = game.state;
    expect(() =>
      player.activateAbility(bellonasRunestone, "clgolelsra-a1", {
        targets: { "target-1": [opposing.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    const powerOf = () =>
      deriveGrandArchiveNumericProperty(game.state.objects[weapon.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      });
    const durability = game.state.objects[weapon.objectId]!.counters.durability ?? 0;
    player.activateAbility(bellonasRunestone, "clgolelsra-a1", {
      targets: { "target-1": [weapon.objectId] },
    });
    expect(player.cards(bellonasRunestone, { zone: "field" })).toHaveLength(0);
    expect(powerOf()).toBe(1);
    expect(game.state.objects[weapon.objectId]!.counters.durability ?? 0).toBe(durability);
    passEffectsStack(game);
    expect(powerOf()).toBe(3);
    expect(game.state.objects[weapon.objectId]!.counters.durability ?? 0).toBe(durability + 1);
  });
});

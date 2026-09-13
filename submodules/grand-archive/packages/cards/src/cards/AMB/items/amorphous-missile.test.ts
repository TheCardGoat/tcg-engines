import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { sojournersHunt } from "../weapons/sojourners-hunt.ts";
import { amorphousMissile } from "./amorphous-missile.ts";

/** @covers 782mm2tq5l-a2 */
describe("Amorphous Missile — load into a Ranger weapon", () => {
  it("pays one, rests, and loads only into an unloaded Ranger weapon you control", () => {
    const champion = createClassBonusTestChampion(amorphousMissile, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [amorphousMissile, sojournersHunt, trainingSword],
          hand: [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [sojournersHunt] } },
    });
    const player = game.player("player-one");
    const missile = player.card(amorphousMissile, { zone: "field" });
    const bow = player.card(sojournersHunt, { zone: "field" });
    const sword = player.card(trainingSword, { zone: "field" });
    const opposing = game.player("player-two").card(sojournersHunt, { zone: "field" });
    const payment = { kind: "card" as const, cardId: player.card(woodlandSquirrels).objectId };

    for (const target of [sword, opposing]) {
      const before = game.state;
      expect(() =>
        player.activateAbility(missile, "782mm2tq5l-a2", {
          targets: { "target-weapon": [target.objectId] },
          reservePayment: [payment],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }

    player.activateAbility(missile, "782mm2tq5l-a2", {
      targets: { "target-weapon": [bow.objectId] },
      reservePayment: [payment],
    });
    expect(game.state.objects[missile.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[missile.objectId]!.zone).toBe("field");
    passEffectsStack(game);
    expect(game.state.objects[missile.objectId]!.zone).toBe("loaded");
    expect(game.state.objects[missile.objectId]!.hostId).toBe(bow.objectId);
  });
});

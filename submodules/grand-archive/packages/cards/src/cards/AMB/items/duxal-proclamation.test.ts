import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { duxalProclamation } from "./duxal-proclamation.ts";

/** @covers 473gyf0w3v-a1 */
describe("Duxal Proclamation — banish for allied power", () => {
  it("gives controlled allies +1 POWER only when no opponent ally is on the field", () => {
    const champion = createClassBonusTestChampion(duxalProclamation, true, "activation-discount");
    const blocked = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [duxalProclamation, woodlandSquirrels] },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const blockedBefore = blocked.state;
    expect(() =>
      blocked.player("player-one").activateAbility(duxalProclamation, "473gyf0w3v-a1"),
    ).toThrow();
    expect(blocked.state).toEqual(blockedBefore);

    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [duxalProclamation, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const own = player.cards(woodlandSquirrels, { zone: "field" });
    const powerOf = (objectId: (typeof own)[number]["objectId"]) =>
      deriveGrandArchiveNumericProperty(game.state.objects[objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      });
    expect(powerOf(own[0]!.objectId)).toBe(1);
    player.activateAbility(duxalProclamation, "473gyf0w3v-a1");
    expect(player.card(duxalProclamation, { zone: "banishment" }).objectId).toBeDefined();
    expect(powerOf(own[0]!.objectId)).toBe(1);
    passEffectsStack(game);
    expect(powerOf(own[0]!.objectId)).toBe(2);
    expect(powerOf(own[1]!.objectId)).toBe(2);
  });
});

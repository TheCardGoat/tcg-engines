import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { gossamerStaff } from "./gossamer-staff.ts";

/** @covers gyk90s0hst-a1 */
describe("Gossamer Staff — Empower 1", () => {
  it("pays reserve and rests, then Empowers 1 only on resolution", () => {
    const champion = createClassBonusTestChampion(gossamerStaff, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [gossamerStaff], hand: [woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const staff = player.card(gossamerStaff, { zone: "field" });
    const beforeUnderpay = game.state;
    expect(() => player.activateAbility(staff, "gyk90s0hst-a1")).toThrow();
    expect(game.state).toEqual(beforeUnderpay);

    player.activateAbility(staff, "gyk90s0hst-a1", {
      reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
    });
    expect(game.state.objects[staff.objectId]!.states.has("rested")).toBe(true);
    expect(player.zone("memory")).toHaveLength(1);
    expect(game.state.players[player.id]!.states.empower).toBeUndefined();
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(1);
    expect(() =>
      player.activateAbility(staff, "gyk90s0hst-a1", {
        reservePayment: [],
      }),
    ).toThrow();
  });
});

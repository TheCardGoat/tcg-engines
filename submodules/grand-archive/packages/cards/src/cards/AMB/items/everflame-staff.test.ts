import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { igniteTheSoul } from "../../DOA/actions/ignite-the-soul.ts";
import { everflameStaff } from "./everflame-staff.ts";

/** @covers nrvth9vyz1-a1 */
describe("Everflame Staff — fire Spell damage", () => {
  it("gains a refinement counter when a fire Spell source deals damage", () => {
    const champion = createClassBonusTestChampion(everflameStaff, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [everflameStaff],
          hand: [igniteTheSoul, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const staff = player.card(everflameStaff, { zone: "field" });
    const target = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
    player.activate(igniteTheSoul, {
      targets: { "target-1": [target.objectId] },
      reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
    });
    expect(game.state.objects[staff.objectId]!.counters["named:refinement"] ?? 0).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[staff.objectId]!.counters["named:refinement"]).toBe(1);
  });
});

/** @covers nrvth9vyz1-a2 */
describe("Everflame Staff — Class Bonus Spell damage", () => {
  it("banishes at three refinement counters to deal 4 as a Spell", () => {
    const champion = createClassBonusTestChampion(everflameStaff, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [everflameStaff],
          hand: [
            igniteTheSoul,
            igniteTheSoul,
            igniteTheSoul,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const staff = player.card(everflameStaff, { zone: "field" });
    const victims = opponent.cards(woodlandSquirrels, { zone: "field" });
    for (let index = 0; index < 3; index += 1) {
      player.activate(player.cards(igniteTheSoul, { zone: "hand" })[0]!, {
        targets: { "target-1": [victims[index]!.objectId] },
        reservePayment: [
          { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[staff.objectId]!.counters["named:refinement"]).toBe(3);
    const opposingChampion = opponent.card(champion, { zone: "field" });
    player.activateAbility(staff, "nrvth9vyz1-a2", {
      targets: { "target-1": [opposingChampion.objectId] },
    });
    expect(player.cards(everflameStaff, { zone: "field" })).toHaveLength(0);
    expect(game.state.objects[opposingChampion.objectId]!.damage).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[opposingChampion.objectId]!.damage).toBe(4);
  });
});

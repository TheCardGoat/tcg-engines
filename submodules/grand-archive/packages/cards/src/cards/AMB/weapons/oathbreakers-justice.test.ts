import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { oathbreakersJustice } from "./oathbreakers-justice.ts";

/** @covers f5ooozsikp-a1 */
describe("Oathbreaker's Justice — attack tax", () => {
  it("requires three reserve to attack and deals its printed two power", () => {
    const { starter } = classBonusLeveledChampion(oathbreakersJustice, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          field: [oathbreakersJustice],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const attacker = player.card(starter, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    const weapon = player.card(oathbreakersJustice, { zone: "field" });
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    const before = game.state;
    expect(() =>
      player.declareAttack(attacker, target, {
        weaponIds: [weapon.objectId],
        reservePayment: payment.slice(0, 2),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.declareAttack(attacker, target, {
      weaponIds: [weapon.objectId],
      reservePayment: payment,
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    expect(player.zone("memory")).toHaveLength(3);
  });
});

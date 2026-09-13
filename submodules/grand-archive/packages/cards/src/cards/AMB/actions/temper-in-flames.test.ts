import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { temperInFlames } from "./temper-in-flames.ts";

/** @covers wjzg76zofp-a1 */
describe("Temper in Flames — weapon power and durability", () => {
  it("gives the targeted weapon +1 POWER and a durability counter", () => {
    const champion = createClassBonusTestChampion(temperInFlames, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [temperInFlames, woodlandSquirrels],
          field: [trainingSword, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const weapon = player.card(trainingSword, { zone: "field" });
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const attacker = player.card(champion, { zone: "field" });
    const defender = opponent.card(champion, { zone: "field" });
    const payment = [
      { kind: "card" as const, cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
    ];
    const before = game.state;
    expect(() =>
      player.activate(temperInFlames, {
        reservePayment: payment,
        targets: { "target-1": [ally.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(2);
    player.activate(temperInFlames, {
      reservePayment: payment,
      targets: { "target-1": [weapon.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(3);

    player.declareAttack(attacker, defender, { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(2);
  });
});

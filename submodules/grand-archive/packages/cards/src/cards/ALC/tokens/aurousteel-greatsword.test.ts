import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { aurousteelGreatsword } from "./aurousteel-greatsword.ts";

/** @covers-card hkurfp66pv */
describe("Aurousteel Greatsword", () => {
  it("adds three power to a Guardian attack and ceases after spending its one durability", () => {
    const champion = createClassBonusTestChampion(
      aurousteelGreatsword,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [aurousteelGreatsword] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const weapon = player.card(aurousteelGreatsword);
    const attacker = player.card(champion);
    const target = game.player("player-two").card(champion);
    expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(1);
    player.declareAttack(attacker, target, { weaponIds: [weapon.objectId] });
    expect(game.state.objects[weapon.objectId]!.states.has("wielded")).toBe(true);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    expect(game.state.objects[weapon.objectId]).toBeUndefined();
    expect(player.zone("graveyard")).toHaveLength(0);
  });

  it("cannot be wielded by an opposing champion", () => {
    const champion = createClassBonusTestChampion(
      aurousteelGreatsword,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion },
      playerTwo: { champion, zones: { field: [aurousteelGreatsword] } },
    });
    const player = game.player("player-one");
    const weapon = game.player("player-two").card(aurousteelGreatsword);
    const before = game.state;
    expect(() =>
      player.declareAttack(player.card(champion), game.player("player-two").card(champion), {
        weaponIds: [weapon.objectId],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

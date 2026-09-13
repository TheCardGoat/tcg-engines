import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nimbleLongbowman } from "../../RDO/allies/nimble-longbowman.ts";
import { cowlOfTheWild } from "./cowl-of-the-wild.ts";

/** @covers t203gysyp8-a1 */
describe("Cowl of the Wild — non-Human Tamer level", () => {
  it("gives the champion +1 level only while a non-Human Tamer ally is controlled", () => {
    const champion = createClassBonusTestChampion(cowlOfTheWild, true, "activation-discount");
    const without = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [cowlOfTheWild, nimbleLongbowman] },
      },
      playerTwo: { champion },
    });
    const withoutPlayer = without.player("player-one");
    const withoutLevel = deriveGrandArchiveNumericProperty(
      without.state.objects[withoutPlayer.card(champion).objectId]!,
      "level",
      {
        program: without.program,
        state: without.state,
        controllerId: withoutPlayer.id,
        bindings: {},
      },
    );
    expect(withoutLevel).toBe(0);

    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [cowlOfTheWild, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const level = deriveGrandArchiveNumericProperty(
      game.state.objects[player.card(champion).objectId]!,
      "level",
      {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      },
    );
    expect(level).toBe(1);
  });
});

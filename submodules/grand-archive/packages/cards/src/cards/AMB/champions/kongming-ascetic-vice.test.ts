import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import {
  changeShiftingCurrents,
  startWithShiftingCurrentsNorth,
} from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { kongmingFelEidolon } from "./kongming-fel-eidolon.ts";
import { kongmingWaywardMaven } from "./kongming-wayward-maven.ts";
import { kongmingAsceticVice } from "./kongming-ascetic-vice.ts";

/** @covers a01pyxwo25-a1 */
describe("Kongming, Ascetic Vice — Lineage", () => {
  proveChampionLineage({
    card: kongmingAsceticVice,
    lineageName: "Kongming",
    level: 2,
    memoryCost: 2,
  });
});

/** @covers a01pyxwo25-a3 */
describe("Kongming, Ascetic Vice — Inherited North to South draw", () => {
  it("draws only when currents change from North to South while Vice is in the inner lineage", () => {
    const game = startWithShiftingCurrentsNorth({
      lineage: [kongmingWaywardMaven, kongmingAsceticVice, kongmingFelEidolon],
      playerOneZones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
    });
    const player = game.player("player-one");
    const champion = player.zone("field")[0]!;
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(
      kongmingFelEidolon.canonicalId,
    );
    expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("north");
    const deck = player.zone("main-deck");
    changeShiftingCurrents(game, "south");
    expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("south");
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "a01pyxwo25-a3",
      ),
    ).toBe(true);
    passEffectsStack(game);
    expect(player.zone("hand")).toContainEqual(deck[0]);
  });
});

/** @covers a01pyxwo25-a2 */
describe("Kongming, Ascetic Vice — On Enter Empower 3", () => {
  it("empowers 3 when materialization resolves", () => {
    const starter = lineageTestChampion("Kongming", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Kongming", 1)],
        zones: {
          "material-deck": [kongmingAsceticVice],
          memory: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    player.materialize(kongmingAsceticVice);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.players[player.id]?.states.empower ?? 0).toBe(0);
    passEffectsStack(game);
    expect(game.state.players[player.id]?.states.empower).toBe(3);
  });
});

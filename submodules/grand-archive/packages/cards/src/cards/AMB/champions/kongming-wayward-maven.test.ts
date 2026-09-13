import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { kongmingWaywardMaven } from "./kongming-wayward-maven.ts";

/** @covers 346vgwz3y4-a1 */
describe("Kongming, Wayward Maven — On Enter mastery", () => {
  it("gains Shifting Currents facing North on materialization", () => {
    const starter = lineageTestChampion("Kongming", 0);
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [shiftingCurrents],
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [kongmingWaywardMaven],
          memory: [woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    player.materialize(kongmingWaywardMaven);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.players[player.id]?.mastery?.name).toBeUndefined();
    passEffectsStack(game);
    expect(game.state.players[player.id]?.mastery?.name).toBe("Shifting Currents");
    expect(game.state.players[player.id]?.states["shifting-currents"]).toBe("north");
  });
});

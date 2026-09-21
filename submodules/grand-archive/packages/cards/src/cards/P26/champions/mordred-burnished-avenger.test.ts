import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { mordredBurnishedAvenger } from "./mordred-burnished-avenger.ts";

/** @covers OWCdWq3mXY-a1 */
describe("Mordred, Burnished Avenger — Flawless Spirit Lineage restriction", () => {
  it("levels up only from a Flawless Spirit of Mordred champion", () => {
    const starter = lineageTestChampion("Flawless Spirit of Mordred", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [mordredBurnishedAvenger],
          memory: [woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const champion = game.player("player-one").card(starter, { zone: "field" });
    player.materialize(mordredBurnishedAvenger);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(
      mordredBurnishedAvenger.canonicalId,
    );
  });

  it("rejects a plain Mordred champion despite the shared lineage name", () => {
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: lineageTestChampion("Mordred", 0),
        zones: {
          "material-deck": [mordredBurnishedAvenger],
          memory: [woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const before = game.state;
    expect(() => game.player("player-one").materialize(mordredBurnishedAvenger)).toThrow(
      "Lineage restriction",
    );
    expect(game.state).toEqual(before);
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { fulminatorRisingStorm } from "./fulminator-rising-storm.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers F1JIgewvFI-a1 */
describe("Fulminator, Rising Storm — entry static counters", () => {
  for (const matching of [false, true])
    for (const level of [0, 1, 2, 3, 4, 5]) {
      it(`Lorraine=${matching}, current level=${level}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createLineageTestChampion(fulminatorRisingStorm, matching ? "Lorraine" : "Other"),
            level,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: { "material-deck": [fulminatorRisingStorm], "main-deck": [woodlandSquirrels] },
          },
          playerTwo: {
            champion,
            zones: { field: [fulminatorRisingStorm], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(fulminatorRisingStorm);
        p.materialize(source);
        expect(game.state.objects[source.objectId]!.counters.static ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.counters.static ?? 0).toBe(
          matching ? Math.max(0, level - 2) : 0,
        );
        expect(game.state.objects[source.objectId]!.counters.durability).toBe(3);
        expect(
          game.state.objects[q.card(fulminatorRisingStorm).objectId]!.counters.static ?? 0,
        ).toBe(0);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
      });
    }
});

import type { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveTestEngine as TestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { rustedWarshield } from "./rusted-warshield.ts";
import { temporalSpectrometer } from "./temporal-spectrometer.ts";

function advanceToPhase(
  game: GrandArchiveTestEngine,
  playerId: "player-one" | "player-two",
  phase: "main" | "materialize",
  afterTurn: number,
): void {
  for (let step = 0; step < 256; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === phase &&
      game.state.turn.number > afterTurn
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to ${phase}`);
  }
  throw new Error(`Did not reach ${playerId}'s ${phase} phase`);
}

/** @covers h23qu7d6so-a2 */
describe("Temporal Spectrometer — time counters", () => {
  it("rests to add exactly one time counter and cannot activate again while rested", () => {
    const champion = lineageTestChampion("Temporal", 0);
    const game = TestEngine.startFixture({
      playerOne: { champion, zones: { field: [temporalSpectrometer] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(temporalSpectrometer, { zone: "field" });
    player.activateAbility(source, "h23qu7d6so-a2");
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.counters["named:time"]).toBe(1);
    const before = game.state;
    expect(() => player.activateAbility(source, "h23qu7d6so-a2")).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers h23qu7d6so-a3 */
describe("Temporal Spectrometer — memory contribution", () => {
  it("sacrifices to pay memory equal to its time counter", () => {
    const champion = lineageTestChampion("Temporal", 0);
    const game = TestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [temporalSpectrometer],
          "material-deck": [rustedWarshield],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const source = player.card(temporalSpectrometer, { zone: "field" });
    player.activateAbility(source, "h23qu7d6so-a2");
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.counters["named:time"]).toBe(1);

    const firstTurn = game.state.turn.number;
    advanceToPhase(game, "player-one", "materialize", firstTurn);
    player.materialize(rustedWarshield, {
      paymentContributions: [{ ruleId: `static:${source.objectId}:h23qu7d6so-a3:0` }],
    });
    expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    expect(player.cards(rustedWarshield, { zone: "field" })).toHaveLength(1);
  });
});

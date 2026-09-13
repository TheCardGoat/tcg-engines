import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { frozenQuill } from "./frozen-quill.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { ebbingTide } from "./ebbing-tide.ts";

function kongmingStarter() {
  const starter = lineageTestChampion("Kongming", 0);
  if (starter.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...starter,
    layout: {
      kind: "single-faced" as const,
      face: { ...starter.layout.face, elements: ["NORM", "WIND"] as const },
    },
  };
}

function setupCurrents() {
  const starter = kongmingStarter();
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: starter,
      zones: {
        field: [ebbingTide],
        hand: [],
        memory: [woodlandSquirrels],
        "material-deck": [kongmingWaywardMaven],
        graveyard: [snowFairy, frozenQuill],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: lineageTestChampion("Opponent", 0),
      zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
    },
    definitions: [shiftingCurrents],
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  player.materialize(kongmingWaywardMaven);
  player.pass();
  opponent.pass();
  passEffectsStack(game);
  for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision" && game.answerForcedDecision()) continue;
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("north");
  return { game, player, opponent };
}

function faceEast(game: GrandArchiveTestEngine): void {
  const player = game.player("player-one");
  for (let step = 0; step < 80; step++) {
    if (game.state.turn.playerId === player.id && game.state.turn.phase === "end") break;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision" && game.answerForcedDecision()) continue;
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  passEffectsStack(game);
  if (game.state.decision?.kind === "resolve-optional-effect") {
    answerDecision(game, "resolve-optional-effect", true);
    answerDecision(game, "resolve-direction-choice", "east");
    passEffectsStack(game);
  }
  for (let step = 0; step < 80; step++) {
    if (game.state.turn.playerId === player.id && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision" && game.answerForcedDecision()) continue;
    else throw new Error(`Unexpected ${wait.kind}`);
  }
}

/** @covers s7pmqsl3jw-a2 */
describe("Ebbing Tide — Empower 2 facing East or West", () => {
  it("rests to Empower 2 only while Shifting Currents face East or West", () => {
    const { game, player } = setupCurrents();
    const tide = player.card(ebbingTide, { zone: "field" });
    const beforeNorth = game.state;
    expect(() => player.activateAbility(tide, "s7pmqsl3jw-a2")).toThrow();
    expect(game.state).toEqual(beforeNorth);
    faceEast(game);
    player.activateAbility(tide, "s7pmqsl3jw-a2");
    expect(game.state.objects[tide.objectId]!.states.has("rested")).toBe(true);
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(2);
  });
});

/** @covers s7pmqsl3jw-a3 */
describe("Ebbing Tide — Empower X facing North or South", () => {
  it("rests and banishes itself to Empower equal to water cards in the graveyard", () => {
    const { game, player } = setupCurrents();
    const tide = player.card(ebbingTide, { zone: "field" });
    player.activateAbility(tide, "s7pmqsl3jw-a3");
    expect(player.cards(ebbingTide, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(2);
    expect(player.card(ebbingTide, { zone: "banishment" }).definitionId).toBe(
      ebbingTide.canonicalId,
    );
  });
});

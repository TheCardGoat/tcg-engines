import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { shiftingCurrents } from "../cards/P24/masteries/shifting-currents.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveAbilityId, requireSingleFace } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export type ShiftingCurrentsDirection = "north" | "east" | "south" | "west";

type FixtureZones = Partial<
  Record<
    "main-deck" | "material-deck" | "hand" | "memory" | "graveyard" | "banishment" | "field",
    readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[]
  >
>;

function kongmingElementalStarter() {
  const starter = lineageTestChampion("Kongming", 0);
  const face = requireSingleFace(starter);
  return {
    ...starter,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...face,
        elements: ["NORM", "WATER", "WIND", "TERA", "FIRE", "LUXEM", "EXIA"] as const,
        abilities: [
          {
            id: grandArchiveAbilityId(starter.canonicalId, 1),
            kind: "triggered" as const,
            text: "On Enter: You gain the Shifting Currents mastery.",
            trigger: {
              kind: "event" as const,
              event: {
                name: "object-entered-field" as const,
                subject: { kind: "source" as const },
              },
            },
            effect: {
              kind: "gain-mastery" as const,
              player: "controller" as const,
              mastery: "Shifting Currents",
            },
          },
        ],
      },
    },
  };
}

/** Resolve Kongming's On Enter so Shifting Currents starts facing North. */
export function startWithShiftingCurrentsNorth(options?: {
  readonly playerOneZones?: FixtureZones;
  readonly playerTwoZones?: FixtureZones;
  readonly lineage?: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[];
}): GrandArchiveTestEngine {
  const starter = kongmingElementalStarter();
  const game = GrandArchiveTestEngine.startFixture({
    pregame: "resolve",
    definitions: [shiftingCurrents],
    playerOne: {
      champion: starter,
      lineage: options?.lineage,
      zones: {
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        ...options?.playerOneZones,
      },
    },
    playerTwo: {
      champion: lineageTestChampion("Opponent", 0),
      zones: {
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        ...options?.playerTwoZones,
      },
    },
  });
  const player = game.player("player-one");
  expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("north");
  advanceToMain(game, player.id);
  return game;
}

export function changeShiftingCurrents(
  game: GrandArchiveTestEngine,
  direction: ShiftingCurrentsDirection,
  playerId = "player-one",
): void {
  const initialTurn = game.state.turn.number;
  const alreadyEnding = game.state.turn.phase === "end" && game.state.turn.playerId === playerId;
  for (let step = 0; step < 64; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "end" &&
      (!alreadyEnding || game.state.turn.number > initialTurn)
    )
      break;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision")
      throw new Error(`Unexpected decision ${game.state.decision?.kind}`);
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  if (game.state.turn.phase !== "end" || game.state.turn.playerId !== playerId) {
    throw new Error("Did not reach the end phase");
  }
  if (!game.state.decision && game.state.stack.length === 0) {
    const wait = game.waitState();
    if (wait.kind === "opportunity") game.player(wait.playerId).pass();
  }
  passEffectsStack(game);
  if (game.state.decision?.kind === "resolve-optional-effect") {
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
  }
  if (game.state.decision?.kind !== "resolve-direction-choice") {
    throw new Error(
      `Expected resolve-direction-choice, found ${game.state.decision?.kind ?? "no decision"} at ${game.state.turn.phase} stack=${game.state.stack.length} wait=${game.waitState().kind} player=${game.state.turn.playerId}`,
    );
  }
  answerDecision(game, "resolve-direction-choice", direction);
}

export function advanceToRecollection(game: GrandArchiveTestEngine, playerId: string): void {
  const initialTurn = game.state.turn.number;
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.number > initialTurn &&
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "recollection"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision" && game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", false);
    else throw new Error(`Unexpected ${wait.kind} while advancing to recollection`);
  }
  throw new Error("Did not reach the next recollection in 128 steps");
}

export function advanceToMain(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 64; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision" && game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", false);
    else if (wait.kind === "decision")
      throw new Error(`Unexpected decision ${game.state.decision?.kind}`);
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach main");
}

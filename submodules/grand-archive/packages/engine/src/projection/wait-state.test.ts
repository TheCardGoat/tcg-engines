import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveDecisionId, grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import { readGrandArchiveWaitState } from "./wait-state.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("wait-state-champion", "CHAMPION");
const filler = card("wait-state-filler", "ACTION");

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 8 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function initial(skipPregameForTests: boolean): GrandArchiveMatchState {
  const program = createGrandArchiveMatchProgram([champion, filler]);
  return createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 121,
    },
    { validateDeckConstruction: false, skipPregameForTests },
  );
}

describe("Grand Archive wait state", () => {
  it("distinguishes pre-game special actions from Opportunity", () => {
    const state = initial(false);
    expect(readGrandArchiveWaitState(state)).toEqual({
      kind: "pregame-action",
      playerId: grandArchivePlayerId("p1"),
    });
  });

  it("reports Opportunity before a pending materialization choice", () => {
    const base = initial(true);
    const state: GrandArchiveMatchState = {
      ...base,
      turn: {
        ...base.turn,
        phase: "materialize",
        materializeKind: "regular",
        materializeChoicePending: true,
      },
    };
    expect(readGrandArchiveWaitState(state)).toMatchObject({
      kind: "opportunity",
      playerId: grandArchivePlayerId("p1"),
    });
    expect(readGrandArchiveWaitState({ ...state, opportunity: null })).toEqual({
      kind: "materialization-choice",
      playerId: grandArchivePlayerId("p1"),
      materializeKind: "regular",
    });
  });

  it("gives a pending decision precedence over every action window", () => {
    const base = initial(true);
    const decision = {
      id: grandArchiveDecisionId("wait-state-decision"),
      kind: "choose-recollection" as const,
      playerId: grandArchivePlayerId("p2"),
      amount: 1,
      candidateIds: [],
      stateVersion: base.stateVersion,
    };
    expect(readGrandArchiveWaitState({ ...base, decision })).toEqual({
      kind: "decision",
      playerId: grandArchivePlayerId("p2"),
      decisionKind: "choose-recollection",
    });
  });

  it("reports the winner after concession through the production runtime", () => {
    const program = createGrandArchiveMatchProgram([champion, filler]);
    const runtime = new GrandArchiveMatchRuntime(program, initial(true));
    const result = runtime.execute({ move: "concede" }, { playerId: grandArchivePlayerId("p1") });
    expect(result.ok).toBe(true);
    expect(runtime.waitState()).toEqual({
      kind: "game-over",
      winnerIds: [grandArchivePlayerId("p2")],
    });
  });
});

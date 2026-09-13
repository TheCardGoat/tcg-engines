import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveBotStrategy } from "./bot-strategies.ts";
import { passOnlyGrandArchiveStrategy } from "./bot-strategies.ts";
import { playGrandArchiveAutomatedMatch } from "./play-match.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("automated-match-champion", "CHAMPION");
const action = card("automated-match-action", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, action]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: action.canonicalId, count: 8 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  return {
    program,
    initialState: createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 1129,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    ),
  };
}

describe("Grand Archive automated match harness", () => {
  it("plays a bounded match through authoritative commands and validates every snapshot", () => {
    const fixture = setup();
    const played = playGrandArchiveAutomatedMatch({
      ...fixture,
      maximumActions: 24,
      defaultStrategy: passOnlyGrandArchiveStrategy,
    });

    expect(played.termination).toBe("max-actions");
    expect(played.actionCount).toBe(24);
    expect(played.frames).toHaveLength(24);
    expect(played.frames.every((frame) => frame.legal.length > 0)).toBe(true);
    expect(played.frames.every((frame) => frame.committedEventTypes.length > 0)).toBe(true);
    expect(played.error).toBeUndefined();
  });

  it("rejects a strategy command that was not emitted by the engine", () => {
    const fixture = setup();
    const illegalStrategy: GrandArchiveBotStrategy = () => ({
      playerId: grandArchivePlayerId("p1"),
      stateVersion: 0,
      command: { move: "concede" },
      label: "Invented concession",
    });
    const played = playGrandArchiveAutomatedMatch({
      ...fixture,
      maximumActions: 1,
      strategies: { [grandArchivePlayerId("p1")]: illegalStrategy },
    });

    expect(played).toMatchObject({
      termination: "illegal",
      actionCount: 0,
      error: expect.stringContaining("outside the authoritative legal list"),
    });
    expect(played.finalState).not.toBe(fixture.initialState);
    expect(played.finalState).toEqual(fixture.initialState);
  });
});

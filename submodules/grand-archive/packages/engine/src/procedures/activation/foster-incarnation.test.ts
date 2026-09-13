import { imperialRecruit } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

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
        cost: { kind: type === "CHAMPION" ? "memory" : "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["GUARDIAN"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("foster-incarnation-champion", "CHAMPION");
const filler = card("foster-incarnation-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, imperialRecruit]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 5 },
      ...(id === "p1" ? [{ definitionId: imperialRecruit.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 617,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const recruit = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === imperialRecruit.canonicalId,
  );
  if (!recruit) throw new Error("Missing Imperial Recruit");
  return { program, state, p1, p2, recruit };
}

function runtimeAfterRecruitReturns(
  fixture: ReturnType<typeof setup>,
  damageCurrentObject = false,
): GrandArchiveMatchRuntime {
  const returned = new GrandArchiveTransactionKernel().transact(fixture.state, [
    {
      type: "object-moved",
      objectId: fixture.recruit.id,
      from: fixture.recruit.zone,
      to: "field",
    },
    {
      type: "damage-marked",
      objectId: fixture.recruit.id,
      amount: 1,
    },
    {
      type: "object-moved",
      objectId: fixture.recruit.id,
      from: "field",
      to: "graveyard",
    },
    {
      type: "object-moved",
      objectId: fixture.recruit.id,
      from: "graveyard",
      to: "field",
    },
    ...(damageCurrentObject
      ? [
          {
            type: "damage-marked" as const,
            objectId: fixture.recruit.id,
            amount: 1,
          },
        ]
      : []),
  ]).state;
  return new GrandArchiveMatchRuntime(fixture.program, {
    ...returned,
    turn: { ...returned.turn, phase: "materialize", materializeChoicePending: true },
    opportunity: null,
    players: {
      ...returned.players,
      [fixture.p1]: { ...returned.players[fixture.p1]!, hasTakenFirstTurn: true },
    },
  });
}

describe("Foster object-incarnation history", () => {
  it("ignores damage dealt to an earlier object represented by the same catalog card", () => {
    const fixture = setup();
    const runtime = runtimeAfterRecruitReturns(fixture);

    expect(runtime.state.objects[fixture.recruit.id]?.damage).toBe(0);
    expect(runtime.execute({ move: "skip-materialization" }, { playerId: fixture.p1 }).ok).toBe(
      true,
    );
    expect(runtime.state.turn.phase).toBe("recollection");
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(fixture.recruit.id);

    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(runtime.state.objects[fixture.recruit.id]?.states.has("fostered")).toBe(true);
  });

  it("still observes damage dealt after the current object entered the field", () => {
    const fixture = setup();
    const runtime = runtimeAfterRecruitReturns(fixture, true);

    expect(runtime.execute({ move: "skip-materialization" }, { playerId: fixture.p1 }).ok).toBe(
      true,
    );
    expect(runtime.state.turn.phase).toBe("recollection");
    expect(runtime.state.stack.some((item) => item.sourceId === fixture.recruit.id)).toBe(false);
    expect(runtime.state.objects[fixture.recruit.id]?.states.has("fostered")).toBe(false);
  });
});

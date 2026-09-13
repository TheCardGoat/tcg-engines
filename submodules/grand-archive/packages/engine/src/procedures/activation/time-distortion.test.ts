import { chronowarp } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../effects/effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalMoves } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(id: string, type: "CHAMPION" | "ACTION" | "ITEM"): GrandArchiveAnyCard {
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
        cost: type === "ITEM" ? { kind: "memory", amount: 0 } : { kind: "none" },
        typeLine: {
          supertypes: type === "ITEM" ? ["REGALIA"] : [],
          types: [type],
          classes: ["CLERIC"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("time-distortion-champion", "CHAMPION");
const filler = card("time-distortion-filler", "ACTION");
const regalia = card("time-distortion-regalia", "ITEM");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, regalia, chronowarp]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 8 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: regalia.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 481,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "player-first-turn-completed", playerId: p1 },
    { type: "player-first-turn-completed", playerId: p2 },
  ]).state;
  return { program, state: prepared, p1, p2 };
}

function chronowarpEffect(): GrandArchiveEffect {
  const face =
    chronowarp.layout.kind === "single-faced"
      ? chronowarp.layout.face
      : chronowarp.layout.defaultFace;
  const ability = face.abilities.find((candidate) => candidate.kind === "card-resolution");
  if (ability?.kind !== "card-resolution") throw new Error("Chronowarp effect is unavailable");
  return ability.effect;
}

function distortTime(fixture: ReturnType<typeof setup>, state = fixture.state) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    chronowarpEffect(),
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function passCycle(runtime: GrandArchiveMatchRuntime) {
  const first = runtime.state.opportunity?.holderId;
  if (!first) throw new Error("Expected an Opportunity holder");
  expect(runtime.execute({ move: "pass" }, { playerId: first }).ok).toBe(true);
  const second = runtime.state.opportunity?.holderId;
  if (!second) throw new Error("Expected the next Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: second });
  if (!result.ok) throw new Error(result.message);
  return result;
}

describe("Grand Archive Chronowarp turn structure", () => {
  it("persists time distortion and adds a post-main materialize phase", () => {
    const fixture = setup();
    const distorted = distortTime(fixture);
    expect(distorted.events).toMatchObject([
      { type: "game-state-changed", state: "time-distorted", value: true },
    ]);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(distorted.state))),
    );
    expect(restored.gameStates["time-distorted"]).toBe(true);
    expect(
      projectGrandArchiveViewerState(fixture.program, restored, fixture.p1).gameStates,
    ).toEqual({
      "time-distorted": true,
    });

    const runtime = new GrandArchiveMatchRuntime(fixture.program, restored);
    passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({
      playerId: fixture.p1,
      phase: "materialize",
      materializeKind: "additional",
      materializeChoicePending: true,
    });
    expect(runtime.state.opportunity).toBeNull();
    expect(listGrandArchiveLegalMoves(runtime.state, fixture.p1)).toEqual(
      expect.arrayContaining(["materialize", "skip-materialization"]),
    );

    expect(runtime.execute({ move: "skip-materialization" }, { playerId: fixture.p1 }).ok).toBe(
      true,
    );
    expect(runtime.state.turn).toMatchObject({
      phase: "end",
      materializeKind: null,
      materializeChoicePending: false,
    });
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p1);

    const nextTurn = passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({
      number: 2,
      playerId: fixture.p2,
      phase: "recollection",
      materializeKind: null,
      materializeChoicePending: false,
    });
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p2);
    expect(
      nextTurn.events.some(
        (event) => event.type === "phase-changed" && event.phase === "materialize",
      ),
    ).toBe(false);
    expect(nextTurn.events).toContainEqual(
      expect.objectContaining({
        type: "phase-changed",
        phase: "recollection",
        cause: { kind: "rule", rule: "time-distorted-skips-regular-materialize-phase" },
      }),
    );
  });

  it("continues to the end phase after resolving an additional materialization", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, distortTime(fixture).state);
    passCycle(runtime);
    const regaliaId = runtime.state.zones[fixture.p1]["material-deck"].find(
      (objectId) => runtime.state.objects[objectId]?.definitionId === regalia.canonicalId,
    );
    if (!regaliaId) throw new Error("Missing additional materialization card");
    const materialized = runtime.execute(
      { move: "materialize", cardId: regaliaId },
      { playerId: fixture.p1 },
    );
    if (!materialized.ok) throw new Error(materialized.message);
    expect(runtime.state.turn).toMatchObject({
      phase: "materialize",
      materializeKind: "additional",
      materializeChoicePending: false,
    });
    passCycle(runtime);
    expect(runtime.state.objects[regaliaId]).toMatchObject({ zone: "field" });
    expect(runtime.state.turn).toMatchObject({ phase: "end", materializeKind: null });
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p1);
  });
});

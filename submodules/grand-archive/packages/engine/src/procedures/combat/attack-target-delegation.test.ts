import { tweedledumRattledDancer } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["ASSASSIN"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : { power: 1, life: 4 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("delegation-champion", "CHAMPION");
const defender = card("delegation-defender", "ALLY");
const filler = card("delegation-filler", "ACTION");

describe("Grand Archive attack target delegation", () => {
  it("lets Tweedledum's chosen opponent choose the legal target defender", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      defender,
      filler,
      tweedledumRattledDancer,
    ]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1" ? [{ definitionId: tweedledumRattledDancer.canonicalId, count: 1 }] : []),
        ...(id === "p2" ? [{ definitionId: defender.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 752,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const tweedledum = Object.values(initial.objects).find(
      (object) =>
        object.ownerId === p1 && object.definitionId === tweedledumRattledDancer.canonicalId,
    );
    const p2Defender = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === defender.canonicalId,
    );
    if (!tweedledum || !p2Defender) throw new Error("Missing Tweedledum delegation fixture");
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: tweedledum.id, from: tweedledum.zone, to: "field" },
      { type: "object-moved", objectId: p2Defender.id, from: p2Defender.zone, to: "field" },
    ]).state;
    const prepared = {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "declare-attack", attackerId: tweedledum.id, targetIds: [] },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId: tweedledum.id,
          targetIds: [],
          delegatePlayerId: p2,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const restored = new GrandArchiveMatchRuntime(
      program,
      restoreGrandArchiveMatchSnapshot(
        program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    const decision = restored.state.decision;
    if (!decision || decision.kind !== "choose-delegated-defender") {
      throw new Error("Expected delegated defender decision");
    }
    expect(decision.playerId).toBe(p2);
    expect(decision.candidateIds).toEqual(
      expect.arrayContaining([p2Defender.id, restored.state.zones[p2].field[0]!]),
    );
    expect(
      restored.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: p2Defender.id,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      restored.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: p2Defender.id,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(restored.state.combat?.attackerId).toBe(tweedledum.id);
    expect(restored.state.combat?.targetIds).toEqual([p2Defender.id]);
    expect(restored.state.objects[tweedledum.id]?.states.has("rested")).toBe(true);
  });

  it("lets Cleave replace Tweedledum's delegated target-defender selection", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      defender,
      filler,
      tweedledumRattledDancer,
    ]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1" ? [{ definitionId: tweedledumRattledDancer.canonicalId, count: 1 }] : []),
        ...(id === "p2" ? [{ definitionId: defender.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 753,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const tweedledum = Object.values(initial.objects).find(
      (object) =>
        object.ownerId === p1 && object.definitionId === tweedledumRattledDancer.canonicalId,
    );
    const p2Defender = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === defender.canonicalId,
    );
    if (!tweedledum || !p2Defender) throw new Error("Missing Tweedledum Cleave fixture");
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: tweedledum.id, from: tweedledum.zone, to: "field" },
      { type: "object-moved", objectId: p2Defender.id, from: p2Defender.zone, to: "field" },
      {
        type: "continuous-effect-created",
        effect: {
          id: `continuous-${initial.nextContinuousOrdinal}`,
          sourceId: tweedledum.id,
          controllerId: p1,
          effect: {
            kind: "continuous",
            subjects: { kind: "bound", binding: "cleave-attacker" },
            affectedSet: "locked",
            duration: { kind: "permanent" },
            layer: { layer: "D", modifies: "ability" },
            change: { kind: "grant-keyword", keyword: { name: "cleave" } },
          },
          affectedObjectIds: [tweedledum.id],
          affectedObjectIncarnations: { [tweedledum.id]: tweedledum.incarnation + 1 },
          bindings: { "cleave-attacker": [tweedledum.id] },
          variables: {},
          durationAnchors: {},
          createdAtVersion: initial.stateVersion,
          createdTurnNumber: initial.turn.number,
          createdPhase: initial.turn.phase,
        },
      },
    ]).state;
    const prepared = {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const declaration = runtime.execute(
      {
        move: "declare-attack",
        attackerId: tweedledum.id,
        targetIds: [],
        cleavePlayerId: p2,
      },
      { playerId: p1 },
    );

    if (!declaration.ok) throw new Error(declaration.message);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.combat).toMatchObject({
      attackerId: tweedledum.id,
      cleavePlayerId: p2,
      defendingPlayerIds: [p2],
    });
    expect(runtime.state.combat?.targetIds).toEqual(
      expect.arrayContaining([p2Defender.id, runtime.state.zones[p2].field[0]!]),
    );
  });
});

import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { createGrandArchiveMatchInitialState } from "../procedures/game-flow/initialize.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "./snapshot.ts";
import {
  collectGrandArchiveSnapshotValidationIssues,
  GrandArchiveSnapshotValidationError,
  isGrandArchiveMatchSnapshotV1,
} from "./snapshot-validation.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "snapshot-admission-champion",
  slug: "snapshot-admission-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "snapshot-admission-champion:face:default",
      catalogId: "snapshot-admission-champion",
      name: "Snapshot Admission Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const action: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "snapshot-admission-action",
  slug: "snapshot-admission-action",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "snapshot-admission-action:face:default",
      catalogId: "snapshot-admission-action",
      name: "Snapshot Admission Action",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function fixture() {
  const program = createGrandArchiveMatchProgram([champion, action]);
  const player = (id: "p1" | "p2") => ({
    id,
    name: id,
    mainDeck: [{ definitionId: action.canonicalId, count: 8 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard" as const,
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1201,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, snapshot: serializeGrandArchiveMatchSnapshot(state) };
}

describe("Grand Archive snapshot admission", () => {
  it("admits an engine snapshot and restores the same persistence graph", () => {
    const { program, snapshot } = fixture();

    expect(isGrandArchiveMatchSnapshotV1(snapshot, program)).toBe(true);
    expect(collectGrandArchiveSnapshotValidationIssues(snapshot, program)).toEqual([]);
    const restored = restoreGrandArchiveMatchSnapshot(program, snapshot);
    expect(Object.hasOwn(restored, "snapshotVersion")).toBe(false);
    expect(serializeGrandArchiveMatchSnapshot(restored)).toEqual(snapshot);
  });

  it("rejects snapshots with missing or unrecognized persistence fields", () => {
    const { program, snapshot } = fixture();
    const withRuntimeLeak = { ...snapshot, transientRuntimeCache: {} };
    const { random: _random, ...withoutRequiredState } = snapshot;

    for (const malformed of [withRuntimeLeak, withoutRequiredState]) {
      expect(isGrandArchiveMatchSnapshotV1(malformed, program)).toBe(false);
      expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
        check: "snapshot-keys",
      });
      expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow(
        GrandArchiveSnapshotValidationError,
      );
    }
  });

  it("rejects a card duplicated across two persisted zones", () => {
    const { program, snapshot } = fixture();
    const playerId = snapshot.turnOrder[0]!;
    const objectId = snapshot.zones[playerId]["main-deck"][0]!;
    const malformed = {
      ...snapshot,
      zones: {
        ...snapshot.zones,
        [playerId]: {
          ...snapshot.zones[playerId],
          hand: [...snapshot.zones[playerId].hand, objectId],
        },
      },
    };

    expect(isGrandArchiveMatchSnapshotV1(malformed, program)).toBe(false);
    expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
      check: "zone-graph",
    });
    expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow(
      GrandArchiveSnapshotValidationError,
    );
  });

  it("refuses to serialize a state whose object and zone identities disagree", () => {
    const { state } = fixture();
    const playerId = state.turnOrder[0]!;
    const objectId = state.zones[playerId]["main-deck"][0]!;
    const malformedState = {
      ...state,
      objects: {
        ...state.objects,
        [objectId]: { ...state.objects[objectId]!, zone: "hand" as const },
      },
    };

    expect(() => serializeGrandArchiveMatchSnapshot(malformedState)).toThrow(
      GrandArchiveSnapshotValidationError,
    );
  });

  it("rejects unknown executable card identities at restore", () => {
    const { program, snapshot } = fixture();
    const object = Object.values(snapshot.objects)[0]!;
    const objectId = object.id;
    const malformed = {
      ...snapshot,
      objects: {
        ...snapshot.objects,
        [objectId]: { ...object, definitionId: "forged-card" },
      },
    };

    expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
      check: "object-graph",
    });
    expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow("object-graph");
  });

  it("rejects unknown decision kinds and dangling decision references", () => {
    const { program, snapshot } = fixture();
    const playerId = snapshot.turnOrder[0]!;
    const objectId = snapshot.zones[playerId]["main-deck"][0]!;
    const baseDecision = {
      id: "decision-forged",
      playerId,
      stateVersion: snapshot.stateVersion,
    };
    const unknownKind = {
      ...snapshot,
      decision: { ...baseDecision, kind: "future-decision" },
    };
    const danglingCandidate = {
      ...snapshot,
      decision: {
        ...baseDecision,
        kind: "choose-unique-object",
        name: "Unique",
        candidates: [objectId, "missing-object"],
      },
    };
    const danglingStackItem = {
      ...snapshot,
      decision: {
        ...baseDecision,
        kind: "resolve-optional-effect",
        stackItemId: "missing-stack-item",
      },
    };

    for (const malformed of [unknownKind, danglingCandidate, danglingStackItem]) {
      expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
        check: "decision-graph",
      });
      expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow("decision-graph");
    }
  });

  it("rejects stack targets without their announcement-time object incarnation", () => {
    const { program, snapshot } = fixture();
    const playerId = snapshot.turnOrder[0]!;
    const objectId = snapshot.zones[playerId]["main-deck"][0]!;
    const malformed = {
      ...snapshot,
      stack: [
        {
          id: "stack-forged",
          controllerId: playerId,
          targets: [
            {
              binding: "target-card",
              targetIds: [objectId],
              required: true,
            },
          ],
        },
      ],
    };

    expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
      check: "live-control-graph",
    });
    expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow(
      "live-control-graph",
    );
  });

  it("rejects removed stack-item history without an explicit resolution outcome", () => {
    const { program, snapshot } = fixture();
    const malformed = {
      ...snapshot,
      eventHistory: [
        ...snapshot.eventHistory,
        { type: "stack-item-removed", itemId: "stack-forged" },
      ],
    };

    expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
      check: "event-history-graph",
    });
    expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow(
      "event-history-graph",
    );
  });

  it("rejects persisted effects that omit their variable context", () => {
    const { program, snapshot } = fixture();
    const malformed = {
      ...snapshot,
      continuousEffects: [
        {
          id: "continuous-forged",
          controllerId: snapshot.turnOrder[0],
          bindings: {},
        },
      ],
    };

    expect(collectGrandArchiveSnapshotValidationIssues(malformed, program)).toContainEqual({
      check: "persisted-effect-contexts",
    });
    expect(() => restoreGrandArchiveMatchSnapshot(program, malformed)).toThrow(
      "persisted-effect-contexts",
    );
  });
});

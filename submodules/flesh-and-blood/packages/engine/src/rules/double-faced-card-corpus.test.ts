import { describe, expect, it } from "vitest";
import { type FabDoubleFacedCardSpec } from "../../../cards/src/authoring/reviewed-card-layouts.ts";
import { FAB_DOUBLE_FACED_CARD_SPECS } from "../../../cards/src/authoring/reviewed-card-layouts.ts";
import { firstClassDoubleFacedCards } from "../../../cards/src/double-faced-layouts.ts";
import { fleshAndBloodCatalogIdentityProjection } from "../../../cards/src/catalog.ts";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "../../../cards/src/generated/card-registry.generated.ts";
import { toFabCardDefinition, type FabRegisteredCardDefinition } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import type { FabMatchState } from "../state.ts";
import type { ProposedEvent } from "./events.ts";
import { reduceFabGameEvent } from "../kernel/event-reducer.ts";
import { commitProposedEventBatch } from "../kernel/transaction-kernel.ts";
import { destinationRefForFabMove, snapshotObject } from "./snapshots.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";

const PLAYER = "p1";
const OPPONENT = "p2";
const INSTANCE = "double-faced-card";
const PROCESS = "process-1";

const physicalCards = firstClassDoubleFacedCards(STRUCTURED_CARDS_BY_CANONICAL_ID.values());

function definitionFor(spec: FabDoubleFacedCardSpec): FabRegisteredCardDefinition {
  const card = physicalCards.get(spec.frontCanonicalId);
  if (!card) throw new Error(`Missing physical DFC ${spec.frontCanonicalId}.`);
  return toFabCardDefinition(card);
}

function stateFor(definition: FabRegisteredCardDefinition): FabMatchState {
  return FabTestEngine.createStateForRulesTest({
    seed: `double-faced-corpus:${definition.canonicalId}`,
    player1Id: PLAYER,
    player2Id: OPPONENT,
    cardsMaps: {
      canonicalIdsByInstance: { [INSTANCE]: definition.canonicalId },
      owners: { [PLAYER]: [INSTANCE], [OPPONENT]: [] },
    },
    cardDefinitions: { [definition.canonicalId]: definition },
  });
}

function commit(state: FabMatchState, event: ProposedEvent): FabMatchState {
  return commitProposedEventBatch(state, [event], reduceFabGameEvent).state;
}

function commitBatch(state: FabMatchState, events: readonly ProposedEvent[]): FabMatchState {
  return commitProposedEventBatch(state, events, reduceFabGameEvent).state;
}

function changeToBack(state: FabMatchState, zone: "hand" | "arena"): FabMatchState {
  const definition = state.cardDefinitions[state.objects[INSTANCE]!.canonicalId]!;
  if (
    definition.layout.kind !== "flip" &&
    definition.layout.kind !== "twin" &&
    definition.layout.kind !== "transcend"
  ) {
    throw new Error("Expected paired layout.");
  }
  const source = snapshotObject(state, INSTANCE, PLAYER, zone);
  return commit(state, {
    name: "change-active-face",
    processId: PROCESS,
    cause: { kind: "rule", rule: "test", controllerId: PLAYER },
    controllerId: PLAYER,
    source,
    affected: [source],
    bindings: {},
    data: { object: source, faceId: definition.layout.back.faceId },
  });
}

function move(
  state: FabMatchState,
  from: "hand" | "arena",
  to: "arena" | "graveyard",
): FabMatchState {
  const source = snapshotObject(state, INSTANCE, PLAYER, from);
  const event: ProposedEvent = {
    name: "move-zone",
    processId: PROCESS,
    cause: { kind: "rule", rule: "test", controllerId: PLAYER },
    controllerId: PLAYER,
    source,
    affected: [source],
    bindings: {},
    data: {
      object: source,
      destinationRef: destinationRefForFabMove(state, source, to),
      from,
      to,
      reason: "move",
    },
  };
  return commitProposedEventBatch(state, [event], reduceFabGameEvent).state;
}

/**
 * CR 9.1.4b requires the player/effect that puts a twin-card in the arena to
 * determine its single active face. The move keeps object identity, so its
 * accompanying active-face selection carries the same object ref.
 */
function moveTwinIntoArenaOnFront(state: FabMatchState): FabMatchState {
  const source = snapshotObject(state, INSTANCE, PLAYER, "hand");
  const canonicalId = source.canonicalId;
  if (canonicalId === null) throw new Error("Expected a named twin source.");
  const definition = state.cardDefinitions[canonicalId];
  if (!definition) throw new Error(`Missing definition for ${canonicalId}.`);
  if (definition.layout.kind !== "twin") throw new Error("Expected twin layout.");
  return commitBatch(state, [
    {
      name: "move-zone",
      processId: PROCESS,
      cause: { kind: "rule", rule: "test", controllerId: PLAYER },
      controllerId: PLAYER,
      source,
      affected: [source],
      bindings: {},
      data: {
        object: source,
        destinationRef: null,
        from: "hand",
        to: "arena",
        reason: "move",
      },
    },
    {
      name: "change-active-face",
      processId: PROCESS,
      cause: { kind: "rule", rule: "test", controllerId: PLAYER },
      controllerId: PLAYER,
      source,
      affected: [source],
      bindings: {},
      data: { object: source, faceId: definition.layout.front.faceId },
    },
  ]);
}

function transcend(state: FabMatchState): FabMatchState {
  const source = snapshotObject(state, INSTANCE, PLAYER, "hand");
  return commit(state, {
    name: "transcend",
    processId: PROCESS,
    cause: { kind: "rule", rule: "test", controllerId: PLAYER },
    controllerId: PLAYER,
    source,
    affected: [source],
    bindings: {},
    data: { actorId: PLAYER, object: source },
  });
}

function expectProjectedNames(state: FabMatchState, names: readonly string[]): void {
  const object = state.objects[INSTANCE]!;
  expect(
    buildFabRulesView(state).object({
      instanceId: object.instanceId,
      incarnation: object.incarnation,
    })?.current.names,
  ).toEqual(names);
}

function restore(state: FabMatchState): FabMatchState {
  return restoreFabMatchSnapshot(
    serializeFabMatchSnapshot(state),
    createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
  );
}

describe("CR 9.1 complete physical double-faced card corpus", () => {
  it("loads every reviewed primary and retains only independently printed backs", () => {
    expect(FAB_DOUBLE_FACED_CARD_SPECS).toHaveLength(48);
    for (const spec of FAB_DOUBLE_FACED_CARD_SPECS) {
      expect(physicalCards.get(spec.frontCanonicalId)?.canonicalId).toBe(spec.frontCanonicalId);
      expect(physicalCards.has(spec.backCanonicalId)).toBe(
        fleshAndBloodCatalogIdentityProjection.independentlyPrintedBackCanonicalIds.has(
          spec.backCanonicalId,
        ),
      );
    }
  });

  it("preserves authored face-local abilities when composing physical cards", () => {
    const invokeYendurai = physicalCards.get("9J9c98JJDc8mtKnRR9hhq");
    expect(invokeYendurai?.layout.kind).toBe("flip");
    if (invokeYendurai?.layout.kind !== "flip")
      throw new Error("Expected Invoke Yendurai flip layout.");
    expect(invokeYendurai.layout.front.abilities).toHaveLength(1);
    expect(invokeYendurai.layout.front.abilities[0]?.id).toBe(
      "9J9c98JJDc8mtKnRR9hhq:transformAshIntoYendurai",
    );
  });

  it.each(FAB_DOUBLE_FACED_CARD_SPECS)(
    "CR 9.1 $kind $frontCanonicalId keeps one physical identity and applies its family lifecycle",
    (spec) => {
      const definition = definitionFor(spec);
      const layout = definition.layout;
      if (layout.kind !== "flip" && layout.kind !== "twin" && layout.kind !== "transcend") {
        throw new Error(`Expected paired layout for ${spec.frontCanonicalId}.`);
      }

      expect(definition.canonicalId).toBe(spec.frontCanonicalId);
      expect(layout.kind).toBe(spec.kind);
      if (spec.kind === "flip") {
        if (layout.kind !== "flip") throw new Error("Expected flip layout.");
        expect(layout.family).toBe(spec.family);
      }
      expect(layout.front.faceId).toBe(`${spec.frontCanonicalId}:face:front`);
      expect(layout.back.faceId).toBe(`${spec.frontCanonicalId}:face:back`);
      expect(layout.front.name).not.toHaveLength(0);
      expect(layout.back.name).not.toHaveLength(0);

      let state = stateFor(definition);
      const initial = state.objects[INSTANCE]!;
      expect(initial.canonicalId).toBe(spec.frontCanonicalId);

      switch (spec.kind) {
        case "flip": {
          expect(initial.activeFace).toMatchObject({
            family: "flip",
            activeFaceIds: [layout.front.faceId],
          });
          expectProjectedNames(state, [layout.front.name]);

          state = changeToBack(state, "hand");
          const back = state.objects[INSTANCE]!;
          expect(back.instanceId).toBe(initial.instanceId);
          expect(back.incarnation).toBe(initial.incarnation);
          expect(back.canonicalId).toBe(spec.frontCanonicalId);
          expect(back.activeFace).toMatchObject({ activeFaceIds: [layout.back.faceId] });
          expectProjectedNames(state, [layout.back.name]);

          state = move(state, "hand", "graveyard");
          expect(state.containers.zonesByPlayerId[PLAYER]!.graveyard).toContain(INSTANCE);
          expect(state.objects[INSTANCE]!.incarnation).toBe(back.incarnation + 1);
          expect(state.objects[INSTANCE]!.activeFace).toMatchObject({
            family: "flip",
            activeFaceIds: [layout.front.faceId],
          });
          expectProjectedNames(state, [layout.front.name]);
          break;
        }
        case "twin": {
          expect(initial.activeFace).toMatchObject({
            family: "twin",
            activeFaceIds: [layout.front.faceId, layout.back.faceId],
          });
          expectProjectedNames(state, [layout.front.name, layout.back.name]);

          state = moveTwinIntoArenaOnFront(state);
          expect(state.objects[INSTANCE]!.activeFace).toMatchObject({
            family: "twin",
            activeFaceIds: [layout.front.faceId],
          });
          expectProjectedNames(state, [layout.front.name]);

          state = changeToBack(state, "arena");
          expect(state.objects[INSTANCE]!.activeFace).toMatchObject({
            family: "twin",
            activeFaceIds: [layout.back.faceId],
          });
          expectProjectedNames(state, [layout.back.name]);

          state = move(state, "arena", "graveyard");
          expect(state.objects[INSTANCE]!.activeFace).toMatchObject({
            family: "twin",
            activeFaceIds: [layout.front.faceId, layout.back.faceId],
          });
          expectProjectedNames(state, [layout.front.name, layout.back.name]);
          break;
        }
        case "transcend": {
          expect(initial.activeFace).toMatchObject({
            family: "transcend",
            activeFaceIds: [layout.front.faceId],
          });
          expectProjectedNames(state, [layout.front.name]);

          state = transcend(state);
          expect(state.containers.zonesByPlayerId[PLAYER]!.hand).toContain(INSTANCE);
          expect(state.objects[INSTANCE]!.activeFace).toMatchObject({
            family: "transcend",
            activeFaceIds: [layout.back.faceId],
          });
          expectProjectedNames(state, [layout.back.name]);

          state = move(state, "hand", "graveyard");
          expect(state.objects[INSTANCE]!.canonicalId).toBe(spec.frontCanonicalId);
          expect(state.objects[INSTANCE]!.activeFace).toMatchObject({
            family: "transcend",
            activeFaceIds: [layout.back.faceId],
          });
          expectProjectedNames(state, [layout.back.name]);
          break;
        }
      }

      const restored = restore(state);
      expect(restored.objects[INSTANCE]!.canonicalId).toBe(spec.frontCanonicalId);
      expect(restored.objects[INSTANCE]!.activeFace).toEqual(state.objects[INSTANCE]!.activeFace);
      expectProjectedNames(
        restored,
        spec.kind === "flip"
          ? [layout.front.name]
          : spec.kind === "twin"
            ? [layout.front.name, layout.back.name]
            : [layout.back.name],
      );
    },
  );
});

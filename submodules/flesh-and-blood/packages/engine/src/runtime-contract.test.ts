import { describe, expect, it } from "vitest";
import { FabTestEngine } from "./testing/test-engine.ts";
import {
  FAB_FACE_DOWN,
  FabMatchRuntime,
  createFabMatchContext,
  decodeFabCommand,
  projectFabViewerResources,
  projectFabViewerState,
  registerFabCardDefinition,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
  type FabCardDefinitionInput,
  type FabCardsMaps,
} from "./runtime-api.ts";

const PLAYER_ONE = "runtime-contract-p1";
const PLAYER_TWO = "runtime-contract-p2";

function definitions(): Record<string, FabCardDefinitionInput> {
  return Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => {
      const canonicalId = `runtime-contract-card-${index}`;
      return [
        canonicalId,
        registerFabCardDefinition({
          canonicalId,
          name: `Runtime Contract Card ${index}`,
          types: ["Action"],
          pitch: (index % 3) + 1,
          cost: 0,
        }),
      ];
    }),
  );
}

function cardsMaps(): FabCardsMaps {
  const canonicalIdsByInstance: Record<string, string> = {};
  const owners: Record<string, string[]> = { [PLAYER_ONE]: [], [PLAYER_TWO]: [] };
  for (const playerId of [PLAYER_ONE, PLAYER_TWO]) {
    for (let index = 0; index < 12; index += 1) {
      const instanceId = `${playerId}:card:${index}`;
      canonicalIdsByInstance[instanceId] = `runtime-contract-card-${index}`;
      owners[playerId].push(instanceId);
    }
  }
  return { canonicalIdsByInstance, owners };
}

function runtime(options: { playerOneMissingCard?: boolean } = {}) {
  const cardDefinitions = definitions();
  const state = FabTestEngine.createStateForRulesTest({
    seed: "runtime-contract",
    player1Id: PLAYER_ONE,
    player2Id: PLAYER_TWO,
    cardsMaps: cardsMaps(),
    cardDefinitions,
  });
  if (options.playerOneMissingCard) {
    const cardId = state.containers.zonesByPlayerId[PLAYER_ONE]!.hand.pop();
    if (!cardId) throw new Error("Expected player one to start with a card in hand.");
    state.containers.zonesByPlayerId[PLAYER_ONE]!.graveyard.push(cardId);
  }
  return { cardDefinitions, state, runtime: new FabMatchRuntime(state) };
}

describe("@tcg/flesh-and-blood-engine/runtime contract", () => {
  it("decodes known commands strictly and rejects legacy or unknown fields", () => {
    expect(decodeFabCommand("pass", {})).toEqual({ move: "pass" });
    expect(decodeFabCommand("pass", { legacy: true })).toBeNull();
    expect(decodeFabCommand("begin-play", { cardId: "legacy-card-id" })).toBeNull();
  });

  it("keeps rejected commands atomic and returns a stable bounded error", () => {
    const match = runtime();
    const before = match.runtime.cloneState();

    const result = match.runtime.applyCommand("not-seated", { move: "pass" });

    expect(result).toEqual({
      success: false,
      error: "Unknown actor: not-seated",
      errorCode: "unknown_actor",
      currentStateID: 0,
    });
    expect(match.runtime.getState()).toEqual(before);
  });

  it("advances the revision once and preserves deterministic execution metadata", () => {
    const match = runtime();
    const result = match.runtime.applyCommand(
      PLAYER_ONE,
      { move: "pass" },
      { commandId: "runtime-contract:pass:1", timestamp: 1234 },
    );

    expect(result).toMatchObject({
      success: true,
      stateID: 1,
      actorId: PLAYER_ONE,
      processedCommand: { move: "pass" },
      execution: { commandId: "runtime-contract:pass:1", timestamp: 1234 },
      status: "settled",
      undoBarrier: null,
    });
    expect(match.runtime.getStateID()).toBe(1);
  });

  it("reports a conservative draw barrier at the End Phase boundary", () => {
    const match = runtime({ playerOneMissingCard: true });
    const result = match.runtime.applyCommand(PLAYER_ONE, { move: "end-turn" });

    expect(result).toMatchObject({ success: true, stateID: 1, status: "settled" });
    if (!result.success) throw new Error(result.error);
    expect(result.committedEvents.length).toBeGreaterThan(0);
    expect(result.committedEvents.some((event) => event.name === "draw")).toBe(true);
    expect(result.undoBarrier?.reasons).toContain("draw");
    expect(result.state).not.toHaveProperty("committedEvents");
  });

  it("round-trips the current snapshot without serializing card definitions", () => {
    const match = runtime();
    const snapshot = serializeFabMatchSnapshot(match.runtime.getState());

    expect(snapshot).not.toHaveProperty("cardDefinitions");
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(match.cardDefinitions, match.state.publicCardIdentities),
    );
    expect(restored.stateID).toBe(match.state.stateID);
    expect(Object.keys(restored.cardDefinitions)).toEqual(
      expect.arrayContaining(Object.keys(match.cardDefinitions)),
    );
  });

  it("projects private zones by viewer without exposing either deck order", () => {
    const match = runtime();
    const view = projectFabViewerState(match.runtime.getState(), {
      role: "player",
      actorId: PLAYER_ONE,
    });

    expect(view.players[PLAYER_ONE]!.zones.hand).not.toContain(FAB_FACE_DOWN);
    expect(view.players[PLAYER_TWO]!.zones.hand.every((card) => card === FAB_FACE_DOWN)).toBe(true);
    expect(view.players[PLAYER_ONE]!.zones.deck.every((card) => card === FAB_FACE_DOWN)).toBe(true);
    expect(view.players[PLAYER_TWO]!.zones.deck.every((card) => card === FAB_FACE_DOWN)).toBe(true);
  });

  it("returns cloned card definitions from viewerResources", () => {
    const match = runtime();
    const resources = projectFabViewerResources(match.runtime.getState(), {
      role: "player",
      actorId: PLAYER_ONE,
    });
    const visibleId = Object.values(resources.cardInstances)[0];
    expect(visibleId).toBeDefined();
    const projected = resources.cardDefinitions[visibleId!];
    const live = match.runtime.getState().cardDefinitions[visibleId!];
    expect(projected).toBeDefined();
    expect(live).toBeDefined();
    expect(projected).not.toBe(live);
    expect(projected).toEqual(live);
  });
});

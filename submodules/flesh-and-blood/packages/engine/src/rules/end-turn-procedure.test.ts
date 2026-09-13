import {
  registerFabCardDefinition,
  toFabCardDefinition,
  type FabCardDefinitionInput,
} from "../cards.ts";
import { fabCanonicalCardId, fabObjectInstanceId } from "../game/identity.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FabMatchRuntime } from "../runtime.ts";
import type { FabCommand } from "../moves.ts";
import { describe, expect, it } from "vitest";
import { seismicSurge } from "../../../cards/src/cards/tokens/seismic-surge.ts";

const PLAYER = "p1";
const OPPONENT = "p2";

describe("persisted FAB end-turn procedure", () => {
  it("restores private pitch ordering and deterministically reaches the next action phase", () => {
    const initial = stateWithCards();
    const playerPitch = initial.containers.zonesByPlayerId[PLAYER]!.hand.splice(0, 2);
    const opponentPitch = initial.containers.zonesByPlayerId[OPPONENT]!.hand.splice(0, 2);
    const arsenalCardId = initial.containers.zonesByPlayerId[PLAYER]!.hand[0]!;
    const intimidatedCardId = initial.containers.zonesByPlayerId[PLAYER]!.deck.pop()!;
    initial.containers.zonesByPlayerId[PLAYER]!.pitch.push(...playerPitch);
    initial.containers.zonesByPlayerId[OPPONENT]!.pitch.push(...opponentPitch);
    initial.containers.zonesByPlayerId[PLAYER]!.banished.push(intimidatedCardId);
    initial.players[PLAYER]!.intimidatedInstanceIds.push({
      instanceId: intimidatedCardId,
      returnToZone: "hand",
    });
    initial.players[PLAYER]!.resourcePoints = 3;

    const first = new FabMatchRuntime(structuredClone(initial));
    expect(
      apply(first, PLAYER, { move: "end-turn", arsenalInstanceId: arsenalCardId }).success,
    ).toBe(true);
    expect(first.getState().phase).toBe("end");
    expect(first.getState().decision).toMatchObject({ kind: "ordering", actorId: PLAYER });
    expect(first.getState().rulesProcess?.procedure).toMatchObject({
      kind: "end-turn",
      stage: "pitch-order",
    });

    const restored = new FabMatchRuntime(structuredClone(first.getState()));
    answerCurrentOrdering(first, PLAYER, playerPitch);
    answerCurrentOrdering(restored, PLAYER, playerPitch);
    expect(first.getState().decision).toMatchObject({ kind: "ordering", actorId: OPPONENT });
    answerCurrentOrdering(first, OPPONENT, opponentPitch);
    answerCurrentOrdering(restored, OPPONENT, opponentPitch);

    expect(restored.getState()).toEqual(first.getState());
    const state = first.getState();
    expect(state.containers.zonesByPlayerId[PLAYER]!.deck.slice(0, 2)).toEqual(playerPitch);
    expect(state.containers.zonesByPlayerId[OPPONENT]!.deck.slice(0, 2)).toEqual(opponentPitch);
    expect(state.players[PLAYER]!.resourcePoints).toBe(0);
    expect(state.containers.zonesByPlayerId[PLAYER]!.arsenal).toEqual([arsenalCardId]);
    expect(state.players[PLAYER]!.intimidatedInstanceIds).toEqual([]);
    expect(state.containers.zonesByPlayerId[PLAYER]!.hand).toContain(intimidatedCardId);
    expect(state.containers.zonesByPlayerId[PLAYER]!.hand).toHaveLength(
      state.players[PLAYER]!.intellect,
    );
    // CR 4.4.3f survives the pitch-order checkpoint: because this is turn 1,
    // the non-turn player also refills after returning their pitched cards.
    expect(state.containers.zonesByPlayerId[OPPONENT]!.hand).toHaveLength(
      state.players[OPPONENT]!.intellect,
    );
    expect(state.activePlayerId).toBe(OPPONENT);
    expect(state.priority?.holderPlayerId).toBe(OPPONENT);
    expect(state.turnNumber).toBe(2);
    expect(state.phase).toBe("action");
    expect(state.players[OPPONENT]!.actionPoints).toBe(1);
    expect(state.rulesProcess).toBeNull();
    expect(state).not.toHaveProperty("committedEvents");
  });

  it("holds the turn transition at an end-phase triggered layer before granting next-turn priority", () => {
    const watcher: FabCardDefinitionInput = {
      canonicalId: "end-watcher",
      name: "End Watcher",
      types: ["Action", "Aura"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "end-watcher-a1",
          text: "At the beginning of your end phase, gain 1 life.",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
          },
        },
      ],
    };
    const state = stateWithCards(watcher);
    for (const zone of Object.values(state.containers.zonesByPlayerId[PLAYER]!)) {
      const index = zone.indexOf("watcher-1");
      if (index >= 0) zone.splice(index, 1);
    }
    state.containers.zonesByPlayerId[PLAYER]!.arena.push("watcher-1");
    const beforeLife = state.players[PLAYER]!.life;
    const runtime = new FabMatchRuntime(state);

    expect(apply(runtime, PLAYER, { move: "end-turn" }).success).toBe(true);
    expect(runtime.getState().phase).toBe("end");
    expect(runtime.getState().turnNumber).toBe(1);
    expect(runtime.getState().rulesStack).toHaveLength(1);
    expect(runtime.enumerateMoves(PLAYER)).toContain("pass");

    apply(runtime, PLAYER, { move: "pass" });
    apply(runtime, OPPONENT, { move: "pass" });
    expect(runtime.getState().players[PLAYER]!.life).toBe(beforeLife + 1);
    expect(runtime.getState().turnNumber).toBe(2);
    expect(runtime.getState().phase).toBe("action");
    expect(runtime.getState().activePlayerId).toBe(OPPONENT);
  });

  it("draws with a this-turn intellect modifier before expiring it at the turn boundary", () => {
    const endPhaseIntellect: FabCardDefinitionInput = {
      canonicalId: "end-phase-intellect",
      name: "End Phase Intellect",
      types: ["Action", "Aura"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "end-phase-intellect-a1",
          text: "At the beginning of your end phase, your hero gains +1 intellect this turn.",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "intellect",
              op: "add",
              amount: 1,
              target: { selector: "controller" },
              duration: "this-turn",
            },
          },
        },
      ],
    };
    const state = stateWithCards(endPhaseIntellect);
    for (const zone of Object.values(state.containers.zonesByPlayerId[PLAYER]!)) {
      const index = zone.indexOf("watcher-1");
      if (index >= 0) zone.splice(index, 1);
    }
    state.containers.zonesByPlayerId[PLAYER]!.arena.push("watcher-1");
    const heroCard: FabCardDefinitionInput = {
      canonicalId: "test-hero",
      name: "Test Hero",
      types: ["Hero"],
      intelligence: 4,
      health: 20,
    };
    state.cardDefinitions[heroCard.canonicalId] = registerFabCardDefinition(heroCard);
    const heroInstanceId = fabObjectInstanceId("test-hero-1");
    state.objects[heroInstanceId] = {
      ...state.objects["watcher-1"]!,
      instanceId: heroInstanceId,
      canonicalId: fabCanonicalCardId(heroCard.canonicalId),
      incarnation: state.counters.objectIncarnation + 1,
      activeFace: { kind: "single" },
      cardPropertyState: { kind: "whole-card" },
    };
    state.containers.zonesByPlayerId[PLAYER]!.heroZone.push(heroInstanceId);
    expect(state.containers.zonesByPlayerId[PLAYER]!.hand).toHaveLength(3);

    const uninterrupted = new FabMatchRuntime(state);
    expect(apply(uninterrupted, PLAYER, { move: "end-turn" }).success).toBe(true);
    expect(uninterrupted.getState().rulesStack).toHaveLength(1);
    const restored = new FabMatchRuntime(structuredClone(uninterrupted.getState()));

    for (const runtime of [uninterrupted, restored]) {
      expect(apply(runtime, PLAYER, { move: "pass" }).success).toBe(true);
      expect(apply(runtime, OPPONENT, { move: "pass" }).success).toBe(true);
      expect(runtime.getState().containers.zonesByPlayerId[PLAYER]!.hand).toHaveLength(5);
      expect(runtime.getState().turnNumber).toBe(2);
      expect(runtime.getState().activePlayerId).toBe(OPPONENT);
      expect(
        runtime
          .getState()
          .continuousEffectInstances.some(
            (effect) =>
              effect.origin === "static" &&
              effect.abilityId === "end-phase-intellect-a1" &&
              effect.expiresAt.kind === "turn",
          ),
      ).toBe(false);
    }
    expect(restored.getState()).toEqual(uninterrupted.getState());
  });

  it("restores an unresolved heave choice and reaches the identical compact state", () => {
    const heave: FabCardDefinitionInput = {
      canonicalId: "heave-card",
      name: "Heave Card",
      types: ["Action", "Attack", "Guardian"],
      keywords: [{ name: "heave", value: 1 }],
    };
    const initial = stateWithCards(heave);
    for (const zone of Object.values(initial.containers.zonesByPlayerId[PLAYER]!)) {
      const index = zone.indexOf("watcher-1");
      if (index >= 0) zone.splice(index, 1);
    }
    initial.containers.zonesByPlayerId[PLAYER]!.hand.push("watcher-1");
    initial.players[PLAYER]!.resourcePoints = 1;

    const uninterrupted = new FabMatchRuntime(initial);
    expect(apply(uninterrupted, PLAYER, { move: "end-turn" }).success).toBe(true);
    expect(uninterrupted.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [{ instanceId: "watcher-1" }],
      continuation: { kind: "turn-heave" },
    });
    expect(uninterrupted.getState().rulesProcess).not.toHaveProperty("committedEvents");
    expect(uninterrupted.getState().rulesProcess?.futureSubjectEvents).toEqual([]);
    const restored = new FabMatchRuntime(structuredClone(uninterrupted.getState()));

    answerCurrentHeave(uninterrupted, "watcher-1");
    answerCurrentHeave(restored, "watcher-1");
    expect(restored.getState()).toEqual(uninterrupted.getState());
    const surgeIds = uninterrupted.getState().containers.zonesByPlayerId[PLAYER]!.arena;
    expect(surgeIds).toHaveLength(1);
    expect(uninterrupted.getState().objects[surgeIds[0]!]?.canonicalId).toBe("token:seismic-surge");
    expect(restored.getState()).not.toHaveProperty("committedEvents");
    expect(restored.getState()).not.toHaveProperty("log");
  });
});

function answerCurrentOrdering(
  runtime: FabMatchRuntime,
  actorId: string,
  orderedIds: readonly string[],
): void {
  const decision = runtime.getState().decision;
  if (!decision || decision.kind !== "ordering")
    throw new Error("Expected a persisted ordering decision.");
  const result = apply(runtime, actorId, {
    move: "answer-decision",
    decisionId: decision.decisionId,
    stateVersion: decision.stateVersion,
    answer: { kind: "ordering", orderedIds },
  });
  expect(result.success).toBe(true);
}

function answerCurrentHeave(runtime: FabMatchRuntime, instanceId: string): void {
  const decision = runtime.getState().decision;
  if (!decision || decision.kind !== "entity-target")
    throw new Error("Expected a persisted Heave decision.");
  const result = apply(runtime, PLAYER, {
    move: "answer-decision",
    decisionId: decision.decisionId,
    stateVersion: decision.stateVersion,
    answer: { kind: "entity-target", instanceIds: [instanceId] },
  });
  expect(result.success).toBe(true);
}

function apply(runtime: FabMatchRuntime, actorId: string, command: FabCommand) {
  return runtime.applyCommand(actorId, command);
}

function stateWithCards(extra?: FabCardDefinitionInput) {
  const canonicalIdsByInstance: Record<string, string> = {};
  const owners: Record<string, string[]> = { [PLAYER]: [], [OPPONENT]: [] };
  const definitions: Record<string, FabCardDefinitionInput> = {};
  definitions["token:seismic-surge"] = toFabCardDefinition(seismicSurge);
  for (const playerId of [PLAYER, OPPONENT]) {
    for (let index = 0; index < 8; index += 1) {
      const canonicalId = `${playerId}-card-${index}`;
      const instanceId = `${canonicalId}-instance`;
      canonicalIdsByInstance[instanceId] = canonicalId;
      owners[playerId]!.push(instanceId);
      definitions[canonicalId] = { canonicalId, name: canonicalId, types: ["Action"] };
    }
  }
  if (extra) {
    canonicalIdsByInstance["watcher-1"] = extra.canonicalId;
    owners[PLAYER]!.push("watcher-1");
    definitions[extra.canonicalId] = extra;
  }
  return FabTestEngine.createStateForRulesTest({
    seed: "persisted-end-turn",
    player1Id: PLAYER,
    player2Id: OPPONENT,
    cardsMaps: { canonicalIdsByInstance, owners },
    cardDefinitions: definitions,
  });
}

import { describe, expect, it } from "vite-plus/test";

import { gd01Gundam001, gd04Encounter105 } from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "../../game/dev-runtime.ts";
import {
  applyLiveProjectionUpdate,
  createLiveProjectionViewerEngine,
  createReplayViewerEngine,
} from "./liveState.ts";

describe("live and replay viewer engines", () => {
  it("hydrates the renderer from a privacy-filtered server projection", () => {
    const server = createDevRuntime({
      p1: { hand: [gd01Gundam001] },
      p2: { hand: [gd01Gundam001], deck: [gd01Gundam001] },
    });
    const projection = server.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });

    const live = createLiveProjectionViewerEngine(structuredClone(projection));
    const rendered = live.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });

    expect(rendered.players.map(({ playerId }) => playerId)).toEqual([
      DEV_PLAYER_ONE,
      DEV_PLAYER_TWO,
    ]);
    expect(rendered.stateID).toBe(projection.stateID);
    expect(rendered.status).toEqual(projection.status);
    expect(rendered.timerView.players).toEqual(projection.timerView.players);
    expect(rendered.zones.zones[`hand:${DEV_PLAYER_ONE}`]?.cards).toHaveLength(1);
    expect(rendered.zones.zones[`hand:${DEV_PLAYER_TWO}`]?.cards[0]?.definition).toBeNull();
    expect(rendered.zones.zones[`deck:${DEV_PLAYER_TWO}`]?.cards).toHaveLength(
      rendered.zones.zones[`deck:${DEV_PLAYER_TWO}`]?.count,
    );
    expect(rendered.zones.zones[`deck:${DEV_PLAYER_TWO}`]?.cards[0]?.definition).toBeNull();
  });

  it("preserves server-authorized reveals when re-projecting the renderer state", () => {
    const server = createDevRuntime({ p2: { hand: [gd01Gundam001] } });
    const projection = server.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });
    const revealed = projection.zones.zones[`hand:${DEV_PLAYER_TWO}`]?.cards[0];
    expect(revealed).toBeDefined();
    revealed!.definition = gd01Gundam001;
    revealed!.definitionId = gd01Gundam001.cardNumber;
    revealed!.faceDown = false;

    const live = createLiveProjectionViewerEngine(structuredClone(projection));
    const rendered = live.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });

    expect(rendered.zones.zones[`hand:${DEV_PLAYER_TWO}`]?.cards[0]).toMatchObject({
      definitionId: gd01Gundam001.cardNumber,
      faceDown: false,
    });
  });

  it("uses the projection viewer identity instead of player-list ordering", () => {
    const server = createDevRuntime();
    const projection = server.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });
    const reorderedProjection = {
      ...projection,
      players: [...projection.players].reverse(),
    };

    const live = createLiveProjectionViewerEngine(reorderedProjection);

    expect(live.viewerPlayerId).toBe(DEV_PLAYER_ONE);
  });

  it("hydrates projection-backed server replays", () => {
    const server = createDevRuntime({ p2: { deck: [gd01Gundam001] } });
    const projection = server.runtime.getFilteredView({ role: "spectator" });

    const replay = createReplayViewerEngine(projection);
    const rendered = replay.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });

    expect(rendered.stateID).toBe(projection.stateID);
    expect(rendered.zones.zones[`deck:${DEV_PLAYER_TWO}`]?.cards[0]?.definition).toBeNull();
  });

  it("retains support for raw replay snapshots", () => {
    const server = createDevRuntime({
      p1: { hand: [gd01Gundam001] },
      p2: { deck: [gd01Gundam001] },
    });
    const rawState = structuredClone(server.runtime.getState());

    const live = createReplayViewerEngine(rawState);

    expect(live.runtime.getState()).toEqual(rawState);
    const rendered = live.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });
    expect(rendered.zones.zones[`deck:${DEV_PLAYER_TWO}`]?.cards).toHaveLength(1);
    expect(rendered.zones.zones[`deck:${DEV_PLAYER_TWO}`]?.cards[0]?.definition).toBeNull();
  });

  it("notifies renderer subscribers when a newer live projection arrives", () => {
    const server = createDevRuntime({ p1: { hand: [gd01Gundam001] } });
    const projection = server.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });
    const live = createLiveProjectionViewerEngine(projection);
    const observedStateIds: number[] = [];
    const unsubscribe = live.runtime.onStateUpdate((stateId) => observedStateIds.push(stateId));
    const nextProjection = {
      ...projection,
      stateID: projection.stateID + 1,
      status: { ...projection.status, turn: projection.status.turn + 1 },
    };

    applyLiveProjectionUpdate(live.runtime, live.staticResources, nextProjection);
    unsubscribe();

    expect(live.runtime.getState().ctx._stateID).toBe(nextProjection.stateID);
    expect(live.runtime.getState().ctx.status.turn).toBe(nextProjection.status.turn);
    expect(observedStateIds).toEqual([nextProjection.stateID]);
  });

  it("hydrates looked-at deck identities so live deck-look prompts can render faces", () => {
    const pilot = createMockPilot({ name: "Searched Pilot", level: 1, cost: 1 });
    const fillers = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Filler ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: [pilot, ...fillers],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(p1.getHand()[0]!));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") {
      throw new Error("Expected GD04-105 deck look");
    }
    expect(choice.legalTutorCardIds).toHaveLength(1);

    const serverProjection = engine.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(PLAYER_ONE),
    });
    for (const instanceId of choice.revealedCardIds) {
      const projected = serverProjection.zones.zones[`deck:${PLAYER_ONE}`]?.cards.find(
        (card) => card.instanceId === instanceId,
      );
      expect(projected).toMatchObject({ faceDown: false });
      expect(projected?.definitionId).toBeTruthy();
    }

    // Opponent still sees a secret deck.
    const opponentProjection = engine.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(PLAYER_TWO),
    });
    for (const instanceId of choice.revealedCardIds) {
      const projected = opponentProjection.zones.zones[`deck:${PLAYER_ONE}`]?.cards.find(
        (card) => card.instanceId === instanceId,
      );
      expect(projected).toMatchObject({ faceDown: true, definitionId: null, definition: null });
    }

    const live = createLiveProjectionViewerEngine(structuredClone(serverProjection));
    for (const instanceId of choice.revealedCardIds) {
      const mapping = live.staticResources.cardsMaps.instances.get(instanceId);
      expect(mapping?.definitionId).toBeTruthy();
      expect(live.staticResources.getDefinition(mapping!.definitionId)).toBeTruthy();
    }
  });
});

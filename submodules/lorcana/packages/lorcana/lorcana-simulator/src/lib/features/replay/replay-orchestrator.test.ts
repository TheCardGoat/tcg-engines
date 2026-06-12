import { describe, expect, it } from "bun:test";
import { arielOnHumanLegs } from "@tcg/lorcana-cards/cards/001";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import type { Patch } from "mutative";
import {
  buildForkedReplayPlayerMetadataMap,
  buildReplayPlayerMetadataMap,
  getReplayPlayerLabel,
  loadReplayBlobForPlayback,
  type PersistedReplayData,
  type PersistedReplayMetadata,
  type PersistedReplayStep,
} from "./fetch-replay.js";
import { ReplayOrchestrator } from "./replay-orchestrator.svelte.ts";

function createReplayData(stepOverrides?: Partial<PersistedReplayStep>): PersistedReplayData {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [arielOnHumanLegs],
      deck: [arielOnHumanLegs],
    },
    {
      deck: [arielOnHumanLegs],
    },
  );
  const server = engine.getServerEngine();
  const stateBefore = JSON.parse(JSON.stringify(server.getState()));
  const cardsMaps = engine.getCardsMaps();

  // initialState no longer contains cardsMaps — state-only
  const initialState = JSON.stringify({
    state: stateBefore,
    historyLength: 0,
  });

  const moveResult = engine.asPlayerOne().ink(arielOnHumanLegs);
  expect(moveResult.success).toBe(true);

  const stateAfter = server.getState();

  const patches: Patch[] = [
    { op: "replace" as const, path: ["ctx", "_stateID"], value: stateAfter.ctx._stateID },
  ];

  return {
    version: 2,
    gameId: "game-1",
    matchId: "match-1",
    gameType: "lorcana",
    seed: "replay-seed",
    playerIds: ["player_one", "player_two"],
    cardsMaps,
    initialState,
    steps: [
      {
        patches,
        logs: [],
        acceptedMove: {
          stateVersion: 1,
          turnNumber: 0,
          actorId: PLAYER_ONE,
          moveId: "inkCard",
          timestamp: Date.now(),
        },
        ...stepOverrides,
      },
    ],
    metadata: {
      totalMoves: 1,
      totalTurns: 1,
      createdAt: new Date(0).toISOString(),
      completedAt: new Date(1).toISOString(),
    },
  };
}

function createReplayMetadata(): PersistedReplayMetadata {
  return {
    totalMoves: 1,
    totalTurns: 1,
    createdAt: new Date(0).toISOString(),
    completedAt: new Date(1).toISOString(),
    players: [
      { id: "p1", displayName: "Alice", username: "alice-user" },
      { id: "p2", displayName: null, username: "bob-user" },
    ],
  };
}

describe("replay player metadata", () => {
  it("maps replay player names by persisted player id", () => {
    expect(buildReplayPlayerMetadataMap(["p1", "p2"], createReplayMetadata())).toEqual({
      p1: { displayName: "Alice" },
      p2: { displayName: "bob-user" },
    });
  });

  it("remaps names for forked human-vs-ai games", () => {
    expect(buildForkedReplayPlayerMetadataMap(createReplayMetadata(), "playerTwo")).toEqual({
      player_one: { displayName: "bob-user" },
      player_two: { displayName: "Alice" },
    });
  });

  it("uses caller fallback when replay metadata has no public name", () => {
    expect(
      getReplayPlayerLabel(
        {
          ...createReplayMetadata(),
          players: [
            { id: "p1", displayName: "  ", username: null },
            { id: "p2", displayName: null, username: null },
          ],
        },
        "playerOne",
        "Player 1",
      ),
    ).toBe("Player 1");
  });
});

describe("ReplayOrchestrator", () => {
  it("reconstructs states by applying patches", () => {
    const orchestrator = new ReplayOrchestrator(createReplayData());

    expect(orchestrator.hasPatchData).toBe(true);
    expect(orchestrator.totalSteps).toBe(2); // initial + 1 step

    orchestrator.nextStep();

    expect(orchestrator.currentStep).toBe(1);
    expect(orchestrator.currentEngine.getState().ctx._stateID).toBe(1);
  });

  it("handles steps with empty patches (state unchanged)", () => {
    const orchestrator = new ReplayOrchestrator(createReplayData({ patches: [] }));

    // Empty patches still produce a step
    expect(orchestrator.totalSteps).toBe(2);
  });

  it("hydrates replay choice logs with labels from the pending-effect patch", () => {
    const replayData = createReplayData();
    replayData.steps = [
      {
        patches: [
          {
            op: "add",
            path: ["G", "pendingEffects", 0],
            value: {
              id: "pending-effect-1",
              selectionContext: {
                options: [
                  { index: 0, label: "Draw a card.", legal: true },
                  { index: 1, label: "Banish chosen damaged character.", legal: true },
                ],
              },
            },
          },
        ],
        logs: [],
        acceptedMove: {
          stateVersion: 1,
          turnNumber: 1,
          actorId: PLAYER_ONE,
          moveId: "playCard",
          timestamp: 100,
        },
      },
      {
        patches: [],
        logs: [
          {
            moveType: "resolveEffect",
            playerId: PLAYER_ONE,
            timestamp: 200,
            public: [
              {
                key: "lorcana.effect.resolve.choiceSelection",
                values: {
                  playerId: PLAYER_ONE,
                  sourceCardId: "source-card",
                  choiceIndex: 2,
                },
              },
            ],
          },
        ],
        acceptedMove: {
          stateVersion: 2,
          turnNumber: 1,
          actorId: PLAYER_ONE,
          moveId: "resolveEffect",
          input: {
            args: {
              effectId: "pending-effect-1",
              params: { choiceIndex: 1 },
            },
          },
          timestamp: 200,
        },
      },
    ];

    const orchestrator = new ReplayOrchestrator(replayData);
    orchestrator.goToStep(2);

    const choiceEntry = orchestrator.readModel
      .getMoveLog()
      .find((entry) => entry.moveId === "resolveEffect");

    expect(choiceEntry?.title).toBe(
      "Resolved source-card choosing Banish chosen damaged character.",
    );
  });
});

describe("loadReplayBlobForPlayback", () => {
  it("uses IndexedDB replay data when available", async () => {
    const localBlob = new Uint8Array([1, 2, 3]).buffer;
    let remoteFetches = 0;

    const result = await loadReplayBlobForPlayback("game-1", {
      isReplayStoreAvailable: () => true,
      loadReplayData: async () => localBlob,
      fetchReplayBlob: async () => {
        remoteFetches += 1;
        return new ArrayBuffer(0);
      },
    });

    expect(result).toEqual({ blob: localBlob, source: "indexed-db" });
    expect(remoteFetches).toBe(0);
  });

  it("fetches remote replay data when IndexedDB misses", async () => {
    const remoteBlob = new Uint8Array([4, 5, 6]).buffer;

    const result = await loadReplayBlobForPlayback("game-1", {
      isReplayStoreAvailable: () => true,
      loadReplayData: async () => null,
      fetchReplayBlob: async () => remoteBlob,
    });

    expect(result).toEqual({ blob: remoteBlob, source: "api" });
  });

  it("fetches remote replay data when IndexedDB is unavailable", async () => {
    const remoteBlob = new Uint8Array([7, 8, 9]).buffer;
    let localLoads = 0;

    const result = await loadReplayBlobForPlayback("game-1", {
      isReplayStoreAvailable: () => false,
      loadReplayData: async () => {
        localLoads += 1;
        return null;
      },
      fetchReplayBlob: async () => remoteBlob,
    });

    expect(result).toEqual({ blob: remoteBlob, source: "api" });
    expect(localLoads).toBe(0);
  });

  it("fetches remote replay data when IndexedDB read fails", async () => {
    const remoteBlob = new Uint8Array([10, 11, 12]).buffer;

    const result = await loadReplayBlobForPlayback("game-1", {
      isReplayStoreAvailable: () => true,
      loadReplayData: async () => {
        throw new Error("IndexedDB read failed");
      },
      fetchReplayBlob: async () => remoteBlob,
    });

    expect(result).toEqual({ blob: remoteBlob, source: "api" });
  });

  it("propagates API fetch errors after IndexedDB miss", async () => {
    const apiError = new Error("API unavailable");

    await expect(
      loadReplayBlobForPlayback("game-1", {
        isReplayStoreAvailable: () => true,
        loadReplayData: async () => null,
        fetchReplayBlob: async () => {
          throw apiError;
        },
      }),
    ).rejects.toThrow(apiError);
  });
});

import { beforeEach, expect, it, vi } from "vitest";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";

const mocks = vi.hoisted(() => ({
  fetchReplayPlayback: vi.fn(),
  saveReplayOnDevice: vi.fn(),
}));
vi.mock("@tcg/simulator-runtime", () => mocks);

import { saveFabReplayOnDevice } from "./replayActions";

const playback: ReplayPlaybackV1 = {
  schemaVersion: 1,
  trust: "server_authoritative",
  publishedAt: "2026-09-24T13:25:01.737Z",
  replay: {
    version: 3,
    gameType: "flesh-and-blood",
    matchId: "match-1",
    gameId: "game-1",
    seed: "test",
    participants: [
      { id: "p1", seat: 1, displayName: "Player 1" },
      { id: "p2", seat: 2, displayName: "Player 2" },
    ],
    initialState: {},
    checkpoints: [],
    steps: [],
    metadata: { totalMoves: 0, totalTurns: 0, createdAt: "2026-09-24T13:25:01.737Z" },
  },
};

beforeEach(() => {
  mocks.fetchReplayPlayback.mockReset();
  mocks.saveReplayOnDevice.mockReset();
});

it("rejects a downloadable replay that has no card resources before saving it", async () => {
  mocks.fetchReplayPlayback.mockResolvedValue(playback);
  await expect(saveFabReplayOnDevice("game-1")).rejects.toThrow("Replay card data is missing");
  expect(mocks.saveReplayOnDevice).not.toHaveBeenCalled();
});

it("stores a replay with card resources for device playback", async () => {
  const complete = { ...playback, resources: { cardInstances: {}, cardDefinitions: {} } };
  mocks.fetchReplayPlayback.mockResolvedValue(complete);
  mocks.saveReplayOnDevice.mockResolvedValue({});
  await saveFabReplayOnDevice("game-1");
  expect(mocks.saveReplayOnDevice).toHaveBeenCalledWith("flesh-and-blood", complete);
});

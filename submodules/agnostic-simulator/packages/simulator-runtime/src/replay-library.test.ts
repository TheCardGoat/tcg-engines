import { describe, expect, it } from "vitest";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { createReplayArchive, parseReplayArchive, replayArchiveFilename } from "./replay-library";

const playback: ReplayPlaybackV1 = {
  schemaVersion: 1,
  trust: "server_authoritative",
  publishedAt: "2026-09-07T12:00:00.000Z",
  resources: { cards: { card1: { name: "Test card" } } },
  presentation: {
    schemaVersion: 1,
    manifestId: "a".repeat(64),
    catalog: { revision: "b".repeat(64), url: "https://assets.example/catalog.json" },
    records: {},
    aliases: {},
  },
  presentationBindings: { printingIdByInstanceId: {} },
  replay: {
    version: 3,
    gameId: "game-1",
    matchId: "match-1",
    gameType: "flesh-and-blood",
    seed: "seed",
    participants: [
      { id: "p1", seat: 1, displayName: "One" },
      { id: "p2", seat: 2, displayName: "Two" },
    ],
    initialState: { turn: 1 },
    checkpoints: [],
    steps: [],
    metadata: {
      totalMoves: 0,
      totalTurns: 1,
      createdAt: "2026-09-07T11:00:00.000Z",
      completedAt: "2026-09-07T12:00:00.000Z",
    },
  },
};

describe("canonical replay archive", () => {
  it("round trips the complete canonical payload and marks imports unverified", async () => {
    const archive = createReplayArchive(playback);
    const imported = await parseReplayArchive(
      new File([archive], replayArchiveFilename(playback), { type: archive.type }),
      "flesh-and-blood",
    );
    expect(imported.trust).toBe("player_authored_unverified");
    expect(imported.resources).toEqual(playback.resources);
    expect(imported.presentation).toEqual(playback.presentation);
    expect(imported.presentationBindings).toEqual(playback.presentationBindings);
    expect(imported.replay).toEqual(playback.replay);
  });

  it("rejects a valid replay imported into the wrong game", async () => {
    const archive = createReplayArchive(playback);
    await expect(
      parseReplayArchive(new File([archive], "test.replay.zip"), "cyberpunk"),
    ).rejects.toThrow("Replay belongs to flesh-and-blood, not cyberpunk");
  });

  it("rejects an archive whose manifest identity was altered", async () => {
    const bytes = new Uint8Array(await createReplayArchive(playback).arrayBuffer());
    const needle = new TextEncoder().encode("game-1");
    const replacement = new TextEncoder().encode("game-x");
    const offset = bytes.findIndex((_, index) =>
      needle.every((value, needleIndex) => bytes[index + needleIndex] === value),
    );
    bytes.set(replacement, offset);

    await expect(parseReplayArchive(new File([bytes], "tampered.replay.zip"))).rejects.toThrow(
      "Replay manifest does not match replay.json",
    );
  });
});

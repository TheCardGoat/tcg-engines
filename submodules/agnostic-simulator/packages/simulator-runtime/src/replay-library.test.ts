import { describe, expect, it, vi } from "vitest";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { materializeReplayFrameAtCursor } from "@tcg/game-page-contract/replay-materializer";
import {
  createReplayArchive,
  loadReplayWithSource,
  parseReplayArchive,
  replayArchiveFilename,
} from "./replay-library";

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

  it("materializes a card reveal from the archive without a server request", async () => {
    const recorded: ReplayPlaybackV1 = {
      ...playback,
      resources: {
        cardInstances: { hero: "hero-definition" },
        cardDefinitions: { "hero-definition": { name: "Hero" } },
      },
      replay: {
        ...playback.replay,
        initialState: { visibleCardIds: ["hero"] },
        steps: [
          {
            acceptedMove: {
              stateVersion: 1,
              turnNumber: 1,
              actorId: "p1",
              moveId: "reveal",
              timestamp: 1,
            },
            patches: [{ op: "add", path: "/visibleCardIds/-", value: "attack" }],
            resourcePatches: [
              { op: "add", path: "/cardInstances/attack", value: "attack-definition" },
              {
                op: "add",
                path: "/cardDefinitions/attack-definition",
                value: { name: "Attack" },
              },
            ],
            logs: [],
          },
        ],
      },
    };
    const archive = createReplayArchive(recorded);
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("Network unavailable"));
    let imported: ReplayPlaybackV1;
    try {
      imported = await parseReplayArchive(new File([archive], "fab.replay.zip"), "flesh-and-blood");
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }

    expect(materializeReplayFrameAtCursor(imported, 0).resources).toEqual(recorded.resources);
    expect(materializeReplayFrameAtCursor(imported, 1)).toMatchObject({
      state: { visibleCardIds: ["hero", "attack"] },
      resources: {
        cardInstances: { hero: "hero-definition", attack: "attack-definition" },
        cardDefinitions: {
          "hero-definition": { name: "Hero" },
          "attack-definition": { name: "Attack" },
        },
      },
    });
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

describe("loadReplayWithSource", () => {
  it("plays the cloud replay when this browser has no saved copy", async () => {
    vi.stubGlobal("indexedDB", {
      open: () => {
        const request = {
          result: null,
          error: new DOMException("storage unavailable"),
          onsuccess: null as null | (() => void),
          onerror: null as null | (() => void),
          onupgradeneeded: null as null | (() => void),
        };
        queueMicrotask(() => request.onerror?.());
        return request;
      },
    });
    const fetcher = vi.fn(async (url: string) => {
      if (url.endsWith("/chat")) return new Response("no", { status: 404 });
      return Response.json({
        ...playback,
        chatMessages: [
          {
            id: "baked",
            senderPlayerId: "p2",
            senderSeat: 2,
            kind: "text",
            text: "secret",
            timestamp: 1,
          },
        ],
      });
    });

    try {
      const loaded = await loadReplayWithSource({
        gameSlug: "cyberpunk",
        gameId: "missing-on-device",
        cloudUrl: "https://api.example/replays/missing-on-device",
        preferredSource: "device",
        fetcher,
      });
      expect(loaded.source).toBe("cloud");
      expect(loaded.playback.replay.gameId).toBe("game-1");
      expect(loaded.playback.chatMessages).toBeUndefined();
      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(fetcher).toHaveBeenCalledWith(
        "https://api.example/replays/missing-on-device/chat",
        expect.objectContaining({ credentials: "include" }),
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("attaches participant chat and ignores chat baked into the public document", async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.endsWith("/chat")) {
        return Response.json({
          object: "replay_chat",
          data: [
            {
              id: "chat-1",
              senderPlayerId: "p1",
              senderSeat: 1,
              kind: "text",
              text: "hello",
              timestamp: 10,
            },
          ],
        });
      }
      return Response.json({
        ...playback,
        chatMessages: [
          {
            id: "baked",
            senderPlayerId: "p2",
            senderSeat: 2,
            kind: "text",
            text: "secret",
            timestamp: 1,
          },
        ],
      });
    });

    const loaded = await loadReplayWithSource({
      gameSlug: "cyberpunk",
      gameId: "game-1",
      cloudUrl: "https://api.example/replays/game-1",
      fetcher,
    });

    expect(loaded.playback.chatMessages).toEqual([
      {
        id: "chat-1",
        senderPlayerId: "p1",
        senderSeat: 1,
        kind: "text",
        text: "hello",
        timestamp: 10,
      },
    ]);
  });
});

import { describe, expect, it } from "vitest";

import { appendFabEngineLogRecords, type FabLiveEngineLogRecord } from "./use-fab-event-log";

const VIEWER = "fab-p1";

function record(overrides: Partial<FabLiveEngineLogRecord["log"]> = {}, version = 1): unknown {
  return {
    gameId: "game-1",
    stateVersion: version,
    timestamp: 1_700_000_000_000,
    sourceAuthority: "engine",
    log: {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "test-command",
      moveType: "answer-decision",
      actorId: VIEWER,
      timestamp: 1_700_000_000_000,
      turnNumber: 1,
      turnPlayerId: VIEWER,
      phase: "action",
      entries: [
        {
          entryId: "test-command:entry-0",
          message: {
            key: "flesh-and-blood.play",
            values: { actorId: VIEWER, cardName: "Snatch" },
            category: "action",
          },
        },
      ],
      ...overrides,
    },
  };
}

describe("appendFabEngineLogRecords", () => {
  it("accepts the raw player narrative shape used by bootstrap history", () => {
    const wrapped = record() as FabLiveEngineLogRecord;
    const merged = appendFabEngineLogRecords([], [wrapped.log]);

    expect(merged).toEqual([
      {
        stateVersion: 0,
        timestamp: wrapped.log.timestamp,
        log: wrapped.log,
      },
    ]);
  });

  it("does not duplicate a bootstrap log when recent history delivers it again", () => {
    const live = record() as FabLiveEngineLogRecord;
    const bootstrapped = appendFabEngineLogRecords([], [live.log]);

    expect(appendFabEngineLogRecords(bootstrapped, [live])).toHaveLength(1);
  });

  it("parses valid records and rejects malformed candidates", () => {
    const merged = appendFabEngineLogRecords(
      [],
      [
        record(),
        record({ schemaVersion: 2 as never }),
        record({ turnPlayerId: undefined as never }),
        record({ entries: [{ entryId: "missing-message" }] as never }),
        record({
          entries: [
            {
              entryId: "missing-value",
              message: {
                key: "flesh-and-blood.play",
                values: { actorId: VIEWER },
                category: "action",
              },
            },
          ] as never,
        }),
        record({
          entries: [
            {
              entryId: "extra-value",
              message: {
                key: "flesh-and-blood.play",
                values: { actorId: VIEWER, cardName: "Snatch", leaked: "unexpected" },
                category: "action",
              },
            },
          ] as never,
        }),
        record({
          entries: [
            {
              entryId: "private-map-leak",
              message: {
                key: "flesh-and-blood.draw",
                values: { playerId: VIEWER },
                category: "action",
              },
              privateMessageByPlayerId: {
                [VIEWER]: {
                  key: "flesh-and-blood.draw.private",
                  values: { playerId: VIEWER, cardNames: "Snatch" },
                  category: "action",
                },
              },
            },
          ] as never,
        }),
        record({
          entries: [
            {
              entryId: "unknown-key",
              message: { key: "invented.english-line", values: {}, category: "action" },
            },
          ] as never,
        }),
        record({
          entries: [
            {
              entryId: "invalid-category",
              message: {
                key: "flesh-and-blood.play",
                values: { actorId: VIEWER, cardName: "Snatch" },
                category: "debug",
              },
            },
          ] as never,
        }),
        record({
          entries: [
            {
              entryId: "mismatched-category",
              message: {
                key: "flesh-and-blood.play",
                values: { actorId: VIEWER, cardName: "Snatch" },
                category: "combat",
              },
            },
          ] as never,
        }),
        { stateVersion: 1 },
        { stateVersion: "1", timestamp: 0, log: {} },
        null,
      ],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.stateVersion).toBe(1);
  });

  it("keeps the existing reference for empty or duplicate deliveries", () => {
    const seeded = appendFabEngineLogRecords([], [record()]);
    expect(appendFabEngineLogRecords(seeded, [])).toBe(seeded);
    expect(appendFabEngineLogRecords(seeded, [record()])).toBe(seeded);
    expect(appendFabEngineLogRecords(seeded, [{ not: "a record" }])).toBe(seeded);
  });

  it("prefers the richer viewer-composed copy on the same structural key", () => {
    // state_update broadcasts the public fallback first; move_accepted then
    // carries the viewer's private replacement with an exact card reference.
    const broadcast = appendFabEngineLogRecords([], [record()]);
    const viewerCopy = record({
      entries: [
        {
          entryId: "test-command:entry-0",
          message: {
            key: "flesh-and-blood.draw.private",
            values: { playerId: VIEWER, cardNames: "Snatch" },
            category: "action",
            cardRefs: [{ instanceId: "card-1", canonicalId: "wtr167", name: "Snatch" }],
          },
        },
      ],
    });
    const merged = appendFabEngineLogRecords(broadcast, [viewerCopy]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.log.entries[0]?.message.key).toBe("flesh-and-blood.draw.private");
    // The thinner broadcast copy never displaces the richer one.
    expect(appendFabEngineLogRecords(merged, [record()])).toBe(merged);
  });

  it("prefers viewer detail even when it carries no card references", () => {
    const broadcast = appendFabEngineLogRecords(
      [],
      [
        record({
          entries: [
            {
              entryId: "test-command:entry-0",
              message: {
                key: "flesh-and-blood.look",
                values: { playerId: VIEWER },
                category: "action",
              },
            },
          ],
        }),
      ],
    );
    const viewerCopy = record({
      entries: [
        {
          entryId: "test-command:entry-0",
          message: {
            key: "flesh-and-blood.look.private",
            values: { playerId: VIEWER, cardName: "Snatch" },
            category: "action",
          },
        },
      ],
    });

    const merged = appendFabEngineLogRecords(broadcast, [viewerCopy]);
    expect(merged[0]?.log.entries[0]?.message.key).toBe("flesh-and-blood.look.private");
    expect(appendFabEngineLogRecords(merged, [record()])).toBe(merged);
  });

  it("prefers a viewer copy with additional visible consequences", () => {
    const broadcast = appendFabEngineLogRecords([], [record()]);
    const viewerCopy = record({
      entries: [
        ...((broadcast[0]?.log.entries ?? []) as FabLiveEngineLogRecord["log"]["entries"]),
        {
          entryId: "test-command:entry-1",
          message: {
            key: "flesh-and-blood.search.found",
            values: { playerId: VIEWER, cardName: "Snatch" },
            category: "action",
          },
        },
      ],
    });

    const merged = appendFabEngineLogRecords(broadcast, [viewerCopy]);
    expect(merged[0]?.log.entries).toHaveLength(2);
  });

  it("keeps one narrative receipt for each distinct accepted command", () => {
    const merged = appendFabEngineLogRecords(
      [],
      [
        record({ commandId: "command-1", moveType: "pass" }),
        record({ commandId: "command-2", moveType: "pass" }),
        record({ commandId: "command-3", moveType: "pass" }),
      ],
    );
    expect(merged).toHaveLength(3);
    expect(merged.map((entry) => entry.log.commandId)).toEqual([
      "command-1",
      "command-2",
      "command-3",
    ]);
  });

  it("bounds the corpus to the newest records", () => {
    let corpus: readonly FabLiveEngineLogRecord[] = [];
    for (let version = 0; version < 600; version += 1) {
      corpus = appendFabEngineLogRecords(corpus, [
        record({ timestamp: 1_700_000_000_000 + version }, version),
      ]);
    }
    expect(corpus).toHaveLength(512);
    expect(corpus[0]?.stateVersion).toBe(600 - 512);
    expect(corpus.at(-1)?.stateVersion).toBe(599);
  });
});

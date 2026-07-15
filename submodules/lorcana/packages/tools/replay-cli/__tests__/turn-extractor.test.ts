import { describe, it, expect } from "bun:test";
import { extractTurn } from "../src/turn-extractor";
import type { PersistedReplayData } from "../src/fetch";

/**
 * Builds a small but representative `PersistedReplayData` fixture. The
 * `state` argument controls the `initialState` envelope so each test can
 * exercise a different shape that the CLI is expected to handle.
 */
function fixture(opts: {
  initialState: string;
  topLevelCardInstances?: Record<string, string>;
  steps?: PersistedReplayData["steps"];
}): PersistedReplayData {
  return {
    version: 2,
    gameId: "g1",
    matchId: "m1",
    gameType: "lorcana",
    seed: "seed-1",
    playerIds: ["p1", "p2"],
    cardsMaps: {
      cardInstances: opts.topLevelCardInstances ?? {},
      owners: { p1: [], p2: [] },
    },
    initialState: opts.initialState,
    steps: opts.steps ?? [],
    metadata: {
      totalMoves: opts.steps?.length ?? 0,
      totalTurns: 1,
      createdAt: "2026-01-01T00:00:00Z",
      completedAt: "2026-01-01T00:01:00Z",
    },
  };
}

const baseMatchState = {
  ctx: { matchID: "m1", random: { seed: "seed-1" } },
  G: { lore: { p1: 0, p2: 0 } },
};

describe("extractTurn / parseInitialState", () => {
  it("unwraps v2 server-authority `{ state, historyLength }` envelopes", () => {
    const replay = fixture({
      initialState: JSON.stringify({ state: baseMatchState, historyLength: 0 }),
      topLevelCardInstances: { "inst-A": "WeA" },
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "play-card",
            input: { instanceId: "inst-A" },
            timestamp: 0,
          },
        },
      ],
    });

    const out = extractTurn(replay, 1);
    expect((out.preTurnState as { ctx: { matchID: string } }).ctx.matchID).toBe("m1");
    expect(out.involvedInstanceIds).toEqual(["inst-A"]);
    expect(out.cardInstances).toEqual({ "inst-A": "WeA" });
    expect(out.turnSteps).toHaveLength(1);
  });

  it("unwraps v2 client-authority envelopes that have no historyLength", () => {
    // Client-authority replays save `{ state, ...cardsMaps }` without
    // historyLength. parseInitialState must still strip the wrapper.
    const replay = fixture({
      initialState: JSON.stringify({
        state: baseMatchState,
        cardInstances: { "inst-B": "Fdq" },
        owners: { p1: ["inst-B"] },
      }),
      topLevelCardInstances: { "inst-B": "Fdq" },
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "quest",
            input: { instanceId: "inst-B" },
            timestamp: 0,
          },
        },
      ],
    });

    const out = extractTurn(replay, 1);
    expect((out.preTurnState as { ctx: { matchID: string } }).ctx.matchID).toBe("m1");
    expect(out.involvedInstanceIds).toEqual(["inst-B"]);
  });

  it("falls back to embedded cardsMaps for legacy `engineSnapshot` envelopes", () => {
    // Legacy `{ state: { engineSnapshot: { state, cardsMaps } } }` shape.
    // Top-level cardsMaps is empty; only the embedded one is populated.
    // Without the merge, --- CARDS INVOLVED --- would be empty for these
    // historical replays.
    const replay = fixture({
      initialState: JSON.stringify({
        state: {
          engineSnapshot: {
            state: baseMatchState,
            cardsMaps: { cardInstances: { "inst-C": "kOA", "inst-D": "shb" } },
          },
        },
      }),
      topLevelCardInstances: {},
      steps: [
        {
          patches: [],
          logs: [{ event: "played", instanceId: "inst-C" }],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "play-card",
            input: { instanceId: "inst-D" },
            timestamp: 0,
          },
        },
      ],
    });

    const out = extractTurn(replay, 1);
    expect(out.cardInstances).toEqual({ "inst-C": "kOA", "inst-D": "shb" });
    expect(out.involvedInstanceIds.sort()).toEqual(["inst-C", "inst-D"]);
  });

  it("accepts a direct `{ ctx, ... }` initialState (no wrapper)", () => {
    const replay = fixture({
      initialState: JSON.stringify(baseMatchState),
      topLevelCardInstances: { "inst-E": "GBS" },
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "play-card",
            input: { instanceId: "inst-E" },
            timestamp: 0,
          },
        },
      ],
    });

    const out = extractTurn(replay, 1);
    expect((out.preTurnState as { G: { lore: Record<string, number> } }).G.lore.p1).toBe(0);
    expect(out.involvedInstanceIds).toEqual(["inst-E"]);
  });

  it("applies prior-turn patches to reconstruct the pre-turn state", () => {
    const replay = fixture({
      initialState: JSON.stringify({ state: baseMatchState, historyLength: 0 }),
      topLevelCardInstances: { "inst-A": "WeA" },
      steps: [
        // Turn 1: bumps p1 lore from 0 to 2
        {
          patches: [{ op: "replace", path: ["G", "lore", "p1"], value: 2 }],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "quest",
            input: { instanceId: "inst-A" },
            timestamp: 0,
          },
        },
        // Turn 2: should see p1 lore = 2 in the pre-turn state
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 2,
            turnNumber: 2,
            actorId: "p2",
            moveId: "draw",
            input: {},
            timestamp: 1,
          },
        },
      ],
    });

    const out = extractTurn(replay, 2);
    const state = out.preTurnState as { G: { lore: Record<string, number> } };
    expect(state.G.lore.p1).toBe(2);
    expect(out.turnSteps).toHaveLength(1);
    expect(out.turnSteps[0]!.globalIndex).toBe(1);
  });

  it("collects involved instance ids from patches, logs, and move input", () => {
    const replay = fixture({
      initialState: JSON.stringify(baseMatchState),
      topLevelCardInstances: {
        "inst-from-patch": "WeA",
        "inst-from-log": "Fdq",
        "inst-from-input": "kOA",
        "inst-not-involved": "shb",
      },
      steps: [
        {
          patches: [{ op: "add", path: ["G", "play", "p1", 0], value: "inst-from-patch" }],
          logs: [{ event: "trigger", source: "inst-from-log" }],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "challenge",
            input: { challenger: "inst-from-input" },
            timestamp: 0,
          },
        },
      ],
    });

    const out = extractTurn(replay, 1);
    expect(out.involvedInstanceIds.sort()).toEqual([
      "inst-from-input",
      "inst-from-log",
      "inst-from-patch",
    ]);
    expect(out.involvedInstanceIds).not.toContain("inst-not-involved");
  });

  it("throws a clear error with available turns when the requested turn has no steps", () => {
    const replay = fixture({
      initialState: JSON.stringify(baseMatchState),
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "draw",
            input: {},
            timestamp: 0,
          },
        },
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 2,
            turnNumber: 3,
            actorId: "p2",
            moveId: "draw",
            input: {},
            timestamp: 1,
          },
        },
      ],
    });

    expect(() => extractTurn(replay, 2)).toThrow(/Available turns:.*1.*3/);
  });

  it("merges top-level and embedded cardInstances with top-level winning on conflict", () => {
    const replay = fixture({
      initialState: JSON.stringify({
        state: {
          engineSnapshot: {
            state: baseMatchState,
            cardsMaps: { cardInstances: { shared: "OLD", "embedded-only": "EMB" } },
          },
        },
      }),
      topLevelCardInstances: { shared: "NEW", "top-only": "TOP" },
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "play-card",
            input: { ids: ["shared", "embedded-only", "top-only"] },
            timestamp: 0,
          },
        },
      ],
    });

    const out = extractTurn(replay, 1);
    expect(out.cardInstances).toEqual({
      shared: "NEW", // top-level wins
      "embedded-only": "EMB",
      "top-only": "TOP",
    });
  });

  it("rejects non-object initialState with a clear error", () => {
    // Give it a step on the requested turn so the parse path runs (the
    // "no steps for turn N" check is intentionally cheap and fires first
    // on an empty steps array).
    const replay = fixture({
      initialState: JSON.stringify("not-an-object"),
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "draw",
            input: {},
            timestamp: 0,
          },
        },
      ],
    });
    expect(() => extractTurn(replay, 1)).toThrow(
      /did not unwrap to a recognised match-state shape/,
    );
  });

  it("rejects malformed JSON in initialState with a clear error", () => {
    const replay = fixture({
      initialState: "{not valid json",
      steps: [
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "draw",
            input: {},
            timestamp: 0,
          },
        },
      ],
    });
    expect(() => extractTurn(replay, 1)).toThrow(/initialState is not valid JSON/);
  });

  it("surfaces a step-anchored error when patch application fails mid-reconstruction", () => {
    const replay = fixture({
      initialState: JSON.stringify(baseMatchState),
      steps: [
        {
          // Invalid patch path (missing zone) — mutative.apply will throw
          patches: [{ op: "replace", path: ["nope", "missing"], value: 1 }],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 1,
            actorId: "p1",
            moveId: "draw",
            input: {},
            timestamp: 0,
          },
        },
        {
          patches: [],
          logs: [],
          acceptedMove: {
            stateVersion: 2,
            turnNumber: 2,
            actorId: "p2",
            moveId: "draw",
            input: {},
            timestamp: 1,
          },
        },
      ],
    });

    expect(() => extractTurn(replay, 2)).toThrow(/step 0.*turn 1.*draw/);
  });
});

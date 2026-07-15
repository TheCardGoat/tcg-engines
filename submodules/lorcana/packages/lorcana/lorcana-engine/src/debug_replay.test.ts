import { describe, it, expect } from "bun:test";
import { apply } from "mutative";
import { ServerEngine } from "./core/engine/server-engine";
import { createEmptyLorcanaStaticResources } from "./testing/serialization";
import { lorcanaRuntimeConfig } from "./runtime-game";

const API_ORIGIN = "https://api.tcg.online";
const RUN_DEBUG_REPLAY = process.env.RUN_DEBUG_REPLAY === "1";
const debugReplayIt = RUN_DEBUG_REPLAY ? it : it.skip;

// Helper to unwrap initialState, copied from turn-extractor
function parseInitialState(raw: string) {
  const parsed = JSON.parse(raw);
  const isStateObject = (v: any) => !!v && typeof v === "object" && !Array.isArray(v);

  const unwrap = (value: any, depth: number): any => {
    if (depth > 4 || !isStateObject(value)) return null;
    if ("ctx" in value && isStateObject(value.ctx)) return value;
    if ("state" in value && isStateObject(value.state)) {
      const inner = unwrap(value.state, depth + 1);
      if (inner) return inner;
      return value.state;
    }
    if ("engineSnapshot" in value && isStateObject(value.engineSnapshot)) {
      return unwrap(value.engineSnapshot, depth + 1);
    }
    return null;
  };

  const inner = unwrap(parsed, 0);
  return { state: inner };
}

describe("Replay Debugger", () => {
  debugReplayIt("verifies validation of passTurn at step 119", async () => {
    const gameId = "mgzc1BwLK-aClC34OHFH1Ct";
    const response = await fetch(
      `${API_ORIGIN}/v1/play/replays/${encodeURIComponent(gameId)}/data`,
      { redirect: "follow" },
    );
    console.log("Fetch Status:", response.status);
    const compressed = new Uint8Array(await response.arrayBuffer());
    const json = Bun.gunzipSync(compressed);
    const text = new TextDecoder().decode(json);
    const replay = JSON.parse(text) as any;

    console.log("Replay keys:", Object.keys(replay));
    console.log("Initial state length:", replay.initialState.length);
    const parsedObj = JSON.parse(replay.initialState);
    console.log("Parsed keys:", Object.keys(parsedObj));
    if (parsedObj.staticResources) {
      console.log("staticResources keys:", Object.keys(parsedObj.staticResources));
    }

    const parsed = parseInitialState(replay.initialState);
    let state = parsed.state;

    // We want the state BEFORE step 119, i.e., after step 118 patches are applied
    for (let i = 0; i <= 118; i++) {
      const step = replay.steps[i];
      if (step.patches && step.patches.length > 0) {
        state = apply(state, step.patches);
      }
    }

    console.log("State reconstructed successfully.");
    console.log("State ID:", state.ctx._stateID);
    console.log("Priority holder:", state.ctx.priority.holder);
    console.log("Pending Choice:", JSON.stringify(state.ctx.priority.pendingChoice));

    // Get resources
    const staticResources = parsedObj.staticResources || createEmptyLorcanaStaticResources();
    const serverEngine = new ServerEngine({
      runtimeConfig: lorcanaRuntimeConfig as any,
      players: state.ctx.playerIds.map((id: string) => ({ id, name: id })),
      staticResources,
      _skipInitialization: true,
    });

    serverEngine.restoreAuthoritativeSnapshot({ state });

    const priorityHolder = state.ctx.priority.holder ?? state.ctx.playerIds[0];
    if (!priorityHolder) {
      throw new Error("Cannot enumerate player moves without a priority holder or player id.");
    }

    const playerMoves = serverEngine.enumerateMovesForPlayer(priorityHolder);
    console.log("Player legal moves:", playerMoves);
    const judgeMoves = serverEngine.enumerateMoves();
    console.log("Judge legal moves:", judgeMoves);

    expect(playerMoves).not.toContain("passTurn");
  });
});

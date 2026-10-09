import { describe, expect, it } from "vite-plus/test";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join as joinPath } from "node:path";
import { createContext, Script } from "node:vm";
import type { BotCandidateManifestV1, BotMatchRecordV1 } from "@tcg/bot-core";
import { evaluateCandidate } from "../../evaluate.ts";
import { createAuthoredBotLabDecks } from "../../../../../../cyberpunk/tools/ai-runner/src/legal-decks.ts";
import {
  enumerateCandidateActions,
  enumerateChoiceActions,
} from "../../../../../../cyberpunk/packages/engine/src/automation/search/shared.ts";
import { loadReferenceRuntime, REFERENCE_SHA256, sha256 } from "./runtime.ts";
import { NativeEngine, matchCatalog, playerId, semanticNativeHash } from "./native-engine.ts";
import { createChoombattlerReferenceAdapter } from "./adapter.ts";

it("pins the audited worker and refuses an arbitrary build before executing it", () => {
  const directory = mkdtempSync(joinPath(tmpdir(), "choombattler-hash-test-"));
  try {
    const worker = joinPath(directory, "worker.js");
    writeFileSync(worker, "throw new Error('must not execute');");
    expect(() => loadReferenceRuntime(worker, "missing-catalog.json")).toThrow("hash mismatch");
    expect(REFERENCE_SHA256).toHaveLength(64);
    expect(sha256("same fixture")).toBe(sha256("same fixture"));
  } finally {
    rmSync(directory, { recursive: true });
  }
});

const workerPath = process.env.CHOOMBATTLER_REFERENCE_WORKER;
const catalogPath = process.env.CHOOMBATTLER_REFERENCE_CATALOG;
describe.skipIf(!workerPath || !catalogPath)("original shipped reference fixture", () => {
  function fixture() {
    if (!workerPath || !catalogPath) throw new Error("Reference fixture paths are required");
    const runtime = loadReferenceRuntime(workerPath, catalogPath);
    const catalogJoin = matchCatalog(runtime);
    const deck = createAuthoredBotLabDecks().find(
      (entry) => entry.id === "authored-ryb-low-cost-tempo",
    );
    if (!deck) throw new Error("Missing authored deck");
    const map = (id: string) => {
      const native = catalogJoin.ownToNative.get(id);
      if (!native) throw new Error(`Missing card ${id}`);
      return native;
    };
    const setup = { userId: "test", legends: deck.legends.map(map), deck: deck.mainDeck.map(map) };
    const state = runtime.api.setup({
      gameId: "reference-test",
      seed: 419,
      players: { 1: setup, 2: setup },
    });
    return { runtime, engine: new NativeEngine(state, runtime, catalogJoin) };
  }
  it("joins every authored deck without printed-stat substitutions", () => {
    const { runtime, engine } = fixture();
    expect(engine.join.mismatches).toEqual([]);
    for (const deck of createAuthoredBotLabDecks()) {
      expect(
        [...deck.legends, ...deck.mainDeck].every((id) => engine.join.ownToNative.has(id)),
      ).toBe(true);
    }
    expect(Object.keys(runtime.catalog)).toHaveLength(151);
  });
  it("matches the UNMODIFIED worker message handler across twelve native positions", () => {
    const { runtime, engine } = fixture();
    if (!workerPath) throw new Error("Missing worker path");
    let listener: ((event: { data: unknown }) => void) | undefined;
    let reply: unknown;
    const context = createContext(
      {
        performance: { now: () => 0 },
        postMessage: (value: unknown) => {
          reply = value;
        },
        addEventListener: (_name: string, fn: (event: { data: unknown }) => void) => {
          listener = fn;
        },
      },
      { codeGeneration: { strings: false, wasm: false } },
    );
    new Script(readFileSync(workerPath, "utf8")).runInContext(context, { timeout: 5_000 });
    if (!listener) throw new Error("Original worker did not register its handler");
    Reflect.set(context, "handler", listener);
    const send = (data: unknown) => {
      Reflect.set(context, "input", data);
      new Script("globalThis.handler({data:globalThis.input})").runInContext(context, {
        timeout: 30_000,
      });
    };
    send({ kind: "catalog", catalog: runtime.catalog });
    for (let step = 0; step < 12; step++) {
      const seat = runtime.api.actor(engine.state);
      if (seat === null) throw new Error("Fixture ended before twelve comparison positions");
      const before = semanticNativeHash(engine.state);
      const action = runtime.decide(engine.state, seat);
      send({ kind: "move", id: 1, state: engine.state, seat, difficulty: "expert" });
      expect(reply).toEqual({ kind: "move", id: 1, action });
      expect(semanticNativeHash(engine.state)).toBe(before);
      engine.applyNativeAction(action);
    }
  }, 60_000);
  it("preserves every native legal choice and forks without changing the live game", () => {
    const { runtime, engine } = fixture();
    for (let step = 0; step < 16; step++) {
      const seat = runtime.api.actor(engine.state);
      if (seat === null) break;
      const id = playerId(seat);
      const nativeActions = runtime.api.actions(engine.state, runtime.cards, seat);
      const prompt = engine.getPrompt(id);
      const expanded = prompt.choice
        ? enumerateChoiceActions(prompt.choice)
        : enumerateCandidateActions(prompt);
      const commands = expanded.map((decision) => ({
        commandID: "test",
        move: decision.move,
        input: { args: decision.args ?? {} },
      }));
      expect(commands.map((command) => engine.actionFor(command, id))).toEqual(nativeActions);
      const command = commands[0];
      if (!command) throw new Error("No native action");
      const before = semanticNativeHash(engine.state);
      const child = engine.fork();
      expect(child.processCommand(command, id).success).toBe(true);
      expect(semanticNativeHash(engine.state)).toBe(before);
      expect(engine.processCommand(command, id).success).toBe(true);
    }
  });
  it("keeps hidden hands out of filtered views and allows them only through the oracle view", () => {
    const { runtime, engine } = fixture();
    for (let step = 0; engine.state.status !== "playing" && step < 5; step++) {
      const seat = runtime.api.actor(engine.state);
      if (seat === null) throw new Error("Setup ended the game");
      const actions = runtime.api.actions(engine.state, runtime.cards, seat);
      const action =
        actions.find((entry) => entry.type === "MULLIGAN" && entry.keep === true) ?? actions[0];
      if (!action) throw new Error("Setup has no action");
      engine.applyNativeAction(action);
    }
    const filtered = engine.getFilteredView(playerId(1));
    const oracle = engine.getOracleView(playerId(1));
    expect(typeof filtered.players.p2?.zones.hand).toBe("number");
    expect(typeof filtered.players.p1?.zones.deck).toBe("number");
    expect(Array.isArray(oracle.players.p2?.zones.hand)).toBe(true);
    expect("nativeStateHash" in filtered).toBe(false);
    expect("nativeStateHash" in oracle).toBe(true);
  });
  it("marks both descriptors as oracle and excludes the reference environment from deployment", () => {
    if (!workerPath || !catalogPath) throw new Error("Missing fixtures");
    const adapter = createChoombattlerReferenceAdapter(workerPath, catalogPath);
    for (const id of ["expert-oracle", "choombattler-expert"]) {
      expect(adapter.getStrategyDescriptor(id)).toMatchObject({
        informationPolicy: "oracle",
        productionEligible: false,
      });
    }
    expect(adapter.getStrategyDescriptor("tactical")).toBeUndefined();
  });
  it("rejects stale replay inputs before executing a match", async () => {
    if (!workerPath || !catalogPath) throw new Error("Missing fixtures");
    const adapter = createChoombattlerReferenceAdapter(workerPath, catalogPath);
    const manifest: BotCandidateManifestV1 = {
      schemaVersion: 1,
      game: "cyberpunk",
      candidateId: "expert-oracle",
      parentStrategyId: "choombattler-expert",
      informationPolicy: "oracle",
      hypothesis: "Replay drift guard",
      engineRevision: adapter.getEngineRevision(),
      cardCatalogHash: adapter.getCardCatalogHash(),
      adapterVersion: adapter.adapterVersion,
      changes: {},
      evaluation: {
        suiteId: "reference:authored-ryb-low-cost-tempo",
        seedBase: "drift-test",
        minimumBlocks: 1,
        maximumBlocks: 1,
        batchSize: 1,
        confidenceLevel: 0.95,
        minimumMeanImprovement: 0,
        maximumCellRegression: 1,
      },
    };
    const record: BotMatchRecordV1 = {
      blockId: "test/block-0",
      legId: "a-seat-1",
      seed: "drift-test",
      candidateSeat: "p1",
      candidateDeckId: "authored-ryb-low-cost-tempo",
      baselineDeckId: "authored-ryb-low-cost-tempo",
      winner: "baseline",
      termination: "rules-win",
      turnCount: 1,
      actionCount: 1,
      finalStateHash: "test-hash",
    };
    // Build a typed report without running an expensive game. Each stale field
    // must fail before the real replay reaches the engine.
    const report = await evaluateCandidate({
      adapter: { ...adapter, runMatch: () => record },
      manifest,
    });
    for (const key of ["engineRevision", "cardCatalogHash", "adapterVersion"] as const) {
      expect(() =>
        adapter.replayMatch(record, {
          ...report,
          manifest: { ...report.manifest, [key]: "stale" },
        }),
      ).toThrow("recorded engine, adapter, and catalog versions");
    }
  });
});

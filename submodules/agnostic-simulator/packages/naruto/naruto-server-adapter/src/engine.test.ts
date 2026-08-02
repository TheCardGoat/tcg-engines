import { describe, expect, it } from "vite-plus/test";
import {
  buildDeck,
  createInitialState,
  newCharacter,
  playableLeaders,
  type GameState,
} from "@tcg-engines/naruto-engine";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type { DispatchContext, ServerEngineCreateInput } from "@tcg/shared/game-engine";

import { narutoServerAdapter } from "./adapter.js";
import {
  NarutoServerEngine,
  narutoCreateServerEngine,
  narutoExtractCardsMapsFromSnapshot,
  narutoRestoreEngine,
  narutoSerializeEngine,
} from "./engine.js";
import type { NarutoSnapshotState } from "./state-mapper.js";

const PLAYER_1 = "alice";
const PLAYER_2 = "bob";
const CONTEXT: DispatchContext = { gameId: "naruto-test-game", sourceAuthority: "server" };

function deckEntries(leaderId: string): { cardId: string; qty: number }[] {
  const deck = buildDeck(leaderId);
  const counts = new Map<string, number>();
  for (const cardId of deck.cardIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  return [
    { cardId: deck.leaderId, qty: 1 },
    ...[...counts.entries()].map(([cardId, qty]) => ({ cardId, qty })),
  ];
}

function testCardsMaps(): CardsMaps {
  const leaders = playableLeaders();
  const first = leaders[0];
  const second = leaders[1] ?? leaders[0];
  if (!first || !second) throw new Error("Naruto cards package ships no leaders.");
  return narutoServerAdapter.buildCardInstances([
    { owner: PLAYER_1, deck: deckEntries(first.id) },
    { owner: PLAYER_2, deck: deckEntries(second.id) },
  ]);
}

function createInput(seed: string): ServerEngineCreateInput {
  return {
    gameSlug: "naruto",
    seed,
    player1Id: PLAYER_1,
    player2Id: PLAYER_2,
    cardsMaps: testCardsMaps(),
  };
}

async function createEngine(seed = "naruto-seed-1"): Promise<NarutoServerEngine> {
  const engine = await narutoCreateServerEngine(createInput(seed));
  if (!(engine instanceof NarutoServerEngine)) throw new Error("wrong engine type");
  return engine;
}

/** Drive the game past the mulligan window; returns the mulligan actor id. */
function resolveMulligan(engine: NarutoServerEngine, keep = true): string {
  const mulliganActor = engine.getActivePlayerId();
  if (!mulliganActor) throw new Error("expected a mulligan window");
  const result = engine.dispatch("MULLIGAN", mulliganActor, { keep }, CONTEXT);
  if (!result.success) throw new Error(`mulligan dispatch failed: ${result.error ?? "?"}`);
  return mulliganActor;
}

describe("naruto engine lifecycle", () => {
  it("creates an engine from deck lists at version 0 with a mulligan window", async () => {
    const engine = await createEngine();
    expect(engine.getStateID()).toBe(0);
    expect(engine.hasGameEnded()).toBe(false);
    expect(engine.getGameEndResult()).toBeUndefined();
    const state = engine.getRawState();
    expect(state.players.p1.name).toBe(PLAYER_1);
    expect(state.players.p2.name).toBe(PLAYER_2);
    // Second player gets the mulligan window under provisional rules.
    expect(state.awaitingMulligan).not.toBeNull();
    expect(engine.getActivePlayerId()).toBe(state.awaitingMulligan === "p1" ? PLAYER_1 : PLAYER_2);
    expect(engine.getInteractionActorIds()).toEqual([PLAYER_1, PLAYER_2]);
  });

  it("rejects non-'none' time control", async () => {
    await expect(
      narutoCreateServerEngine({
        ...createInput("tc"),
        timeControl: { mode: "chess", initialReserveMs: 1000, incrementMs: 0 },
      }),
    ).rejects.toThrow(/time-control/);
  });

  it("rejects decks without a leader", async () => {
    const maps = testCardsMaps();
    const noLeader: CardsMaps = {
      cardInstances: { ...maps.cardInstances },
      owners: {
        [PLAYER_1]: (maps.owners[PLAYER_1] ?? []).filter((id) => {
          const leaders = playableLeaders().map((l) => l.id);
          return !leaders.includes(maps.cardInstances[id] ?? "");
        }),
        [PLAYER_2]: maps.owners[PLAYER_2] ?? [],
      },
    };
    await expect(
      narutoCreateServerEngine({ ...createInput("no-leader"), cardsMaps: noLeader }),
    ).rejects.toThrow(/leader/);
  });

  it("accepts legal dispatches and rejects illegal ones by state identity", async () => {
    const engine = await createEngine();
    const mulliganActor = engine.getActivePlayerId();
    if (!mulliganActor) throw new Error("expected mulligan window");

    const accepted = engine.dispatch("MULLIGAN", mulliganActor, { keep: true }, CONTEXT);
    expect(accepted.success).toBe(true);
    if (accepted.success) {
      expect(accepted.stateID).toBe(1);
      expect(accepted.acceptedMoveRecord?.moveId).toBe("MULLIGAN");
      expect(accepted.acceptedMoveRecord?.actorId).toBe(mulliganActor);
      expect(accepted.engineLogRecords?.length).toBeGreaterThan(0);
    }

    // END_TURN from the non-active player is illegal → same-reference no-op.
    const state = engine.getRawState();
    const nonActive = state.activePlayer === "p1" ? PLAYER_2 : PLAYER_1;
    const rejected = engine.dispatch("END_TURN", nonActive, {}, CONTEXT);
    expect(rejected.success).toBe(false);
    if (!rejected.success) {
      expect(rejected.errorCode).toBe("illegal_move");
      expect(rejected.stateID).toBe(1);
    }
    expect(engine.getStateID()).toBe(1);
  });

  it("rejects malformed payloads and unknown actors/move types", async () => {
    const engine = await createEngine();
    const badActor = engine.dispatch("MULLIGAN", "mallory", { keep: true }, CONTEXT);
    expect(badActor.success).toBe(false);
    if (!badActor.success) expect(badActor.errorCode).toBe("unknown_actor");

    const badMove = engine.dispatch("FIREBALL", PLAYER_1, {}, CONTEXT);
    expect(badMove.success).toBe(false);
    if (!badMove.success) expect(badMove.errorCode).toBe("invalid_move_payload");

    const badPayload = engine.dispatch("SUMMON", PLAYER_1, { handUid: 42 }, CONTEXT);
    expect(badPayload.success).toBe(false);
    if (!badPayload.success) expect(badPayload.errorCode).toBe("invalid_move_payload");
  });

  it("increments the CAS version by exactly 1 per accepted action", async () => {
    const engine = await createEngine();
    resolveMulligan(engine);
    let expected = 1;
    // Alternate END_TURN between the two seats for several turns.
    for (let i = 0; i < 6; i++) {
      const state = engine.getRawState();
      const actor = state.activePlayer === "p1" ? PLAYER_1 : PLAYER_2;
      const result = engine.dispatch("END_TURN", actor, {}, CONTEXT);
      expect(result.success).toBe(true);
      expected += 1;
      expect(engine.getStateID()).toBe(expected);
      if (result.success) expect(result.stateID).toBe(expected);
    }
    expect(engine.getRawState().turn).toBe(7);
  });

  it("snapshot round-trip preserves state, seats, and the version counter", async () => {
    const engine = await createEngine();
    resolveMulligan(engine);
    const state = engine.getRawState();
    const actor = state.activePlayer === "p1" ? PLAYER_1 : PLAYER_2;
    engine.dispatch("END_TURN", actor, {}, CONTEXT);

    const snapshot = narutoSerializeEngine(engine, testCardsMaps());
    expect(snapshot.gameSlug).toBe("naruto");
    const payload = snapshot.state as NarutoSnapshotState;
    expect(payload.gameSlug).toBe("naruto");
    expect(payload.stateVersion).toBe(engine.getStateID());
    expect(payload.seats).toEqual({ p1: PLAYER_1, p2: PLAYER_2 });

    const restored = await narutoRestoreEngine(snapshot, {
      gameSlug: "naruto",
      seed: "naruto-seed-1",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
    });
    expect(restored.getStateID()).toBe(engine.getStateID());
    expect(JSON.stringify((restored as NarutoServerEngine).getRawState())).toBe(
      JSON.stringify(engine.getRawState()),
    );

    // The restored engine continues the version counter.
    const restoredState = (restored as NarutoServerEngine).getRawState();
    const nextActor = restoredState.activePlayer === "p1" ? PLAYER_1 : PLAYER_2;
    const continued = restored.dispatch("END_TURN", nextActor, {}, CONTEXT);
    expect(continued.success).toBe(true);
    expect(restored.getStateID()).toBe(engine.getStateID() + 1);

    expect(narutoExtractCardsMapsFromSnapshot(snapshot)).toEqual(testCardsMaps());
  });

  it("rejects malformed snapshots at restore time", async () => {
    await expect(
      narutoRestoreEngine(
        { gameSlug: "naruto", state: { gameSlug: "gundam" }, historyLength: 0 },
        { gameSlug: "naruto", seed: "s", player1Id: PLAYER_1, player2Id: PLAYER_2 },
      ),
    ).rejects.toThrow(/gameSlug/);
  });

  it("replays deterministically: same seed + same actions → identical final state JSON", async () => {
    const engineA = await createEngine("replay-seed");
    const engineB = await createEngine("replay-seed");
    expect(JSON.stringify(engineB.getRawState())).toBe(JSON.stringify(engineA.getRawState()));

    // Drive A with the deterministic greedy policy, recording every accepted
    // (moveType, actorId, payload) triple.
    const script: { moveType: string; actorId: string; payload: Record<string, unknown> }[] = [];
    for (let i = 0; i < 40 && !engineA.hasGameEnded(); i++) {
      const result = engineA.takeAutomatedAction({}, CONTEXT);
      const final = result.finalResult;
      if (!final.success) break;
      const record = final.acceptedMoveRecord;
      if (!record) throw new Error("accepted dispatch missing move record");
      const input = record.input as { args: Record<string, unknown> };
      script.push({ moveType: record.moveId, actorId: record.actorId, payload: input.args });
    }
    expect(script.length).toBeGreaterThan(0);

    for (const step of script) {
      const replayed = engineB.dispatch(step.moveType, step.actorId, step.payload, CONTEXT);
      expect(replayed.success).toBe(true);
    }
    expect(engineB.getStateID()).toBe(engineA.getStateID());
    expect(JSON.stringify(engineB.getRawState())).toBe(JSON.stringify(engineA.getRawState()));
  });

  it("takeAutomatedAction is blocked once the game has ended", async () => {
    // Craft a terminal state directly; winner short-circuits everything.
    const base = createCraftedState();
    base.winner = "p1";
    const engine = new NarutoServerEngine({
      state: base,
      seats: { p1: PLAYER_1, p2: PLAYER_2 },
    });
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()).toEqual({ winnerId: PLAYER_1 });
    const result = engine.takeAutomatedAction({}, CONTEXT);
    expect(result.finalResult.success).toBe(false);
    expect(result.blocked?.reason).toBe("game-ended");
  });
});

/** Minimal hand-crafted mid-game state (p1 to move, turn 3 main phase). */
function createCraftedState(): GameState {
  const leaders = playableLeaders();
  const leader1 = leaders[0];
  const leader2 = leaders[1] ?? leaders[0];
  if (!leader1 || !leader2) throw new Error("no leaders");
  const state = createInitialState({
    decks: {
      p1: buildDeck(leader1.id),
      p2: buildDeck(leader2.id),
    },
    seed: 7,
    firstPlayer: "p1",
    names: { p1: PLAYER_1, p2: PLAYER_2 },
  });
  state.awaitingMulligan = null;
  state.turn = 3;
  state.phase = "main";
  state.players.p1.characters[0] = newCharacter("p1-crafted-0", "N-013", 1);
  return state;
}

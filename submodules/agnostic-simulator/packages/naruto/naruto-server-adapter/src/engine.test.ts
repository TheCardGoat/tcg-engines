import { describe, expect, it } from "vite-plus/test";
import {
  buildDeck,
  createInitialState,
  newCharacter,
  playableLeaders,
  type GameState,
} from "@tcg-engines/naruto-engine";
import { getCardById } from "@tcg-engines/naruto-cards";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type { DispatchContext, ServerEngineCreateInput } from "@tcg/shared/game-engine";

import { narutoServerAdapter } from "./adapter.js";
import {
  NarutoServerEngine,
  narutoActionFromPayload,
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
  for (const cardId of [deck.leaderId, ...deck.cardIds, ...deck.chakraCardIds, deck.summonCardId]) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  return [...counts.entries()].map(([cardId, qty]) => ({ cardId, qty }));
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

function flatDeckCards(leaderId: string): string[] {
  const deck = buildDeck(leaderId);
  return [deck.leaderId, ...deck.cardIds, ...deck.chakraCardIds, deck.summonCardId];
}

function cardsMapsWithDeck(playerId: string, cardIds: readonly string[]): CardsMaps {
  const maps = testCardsMaps();
  const priorInstances = maps.owners[playerId] ?? [];
  const cardInstances = { ...maps.cardInstances };
  for (const instanceId of priorInstances) delete cardInstances[instanceId];
  const ownerInstances = cardIds.map((cardId, index) => `${playerId}-bypass-${index}`);
  for (const [index, instanceId] of ownerInstances.entries()) {
    cardInstances[instanceId] = cardIds[index] ?? "";
  }
  return {
    cardInstances,
    owners: { ...maps.owners, [playerId]: ownerInstances },
  };
}

function leaderAndMainCards(leaderId: string): { leaderId: string; main: string[] } {
  const deck = buildDeck(leaderId);
  return { leaderId: deck.leaderId, main: [...deck.cardIds] };
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

  it("projects viewer-specific state without hidden card identities or engine uids", async () => {
    const engine = await createEngine("viewer-redaction");
    const raw = engine.getRawState();
    const ownCard = raw.players.p1.hand[0];
    if (!ownCard) throw new Error("Expected an opening hand card.");

    raw.players.p2.hand = [{ uid: "p2-hand-PRIVATE-HAND-CARD", cardId: "PRIVATE-HAND-CARD" }];
    raw.players.p2.supports[0] = {
      uid: "p2-support-PRIVATE-SUPPORT-CARD",
      cardId: "PRIVATE-SUPPORT-CARD",
    };

    const playerView = engine.getViewerState({ role: "player", actorId: PLAYER_1 }) as {
      state: {
        seed?: unknown;
        players: Record<
          "p1" | "p2",
          { hand: Array<Record<string, unknown>>; supports: Array<Record<string, unknown> | null> }
        >;
      };
    };
    const playerJson = JSON.stringify(playerView);
    expect(playerJson).not.toContain("PRIVATE-HAND-CARD");
    expect(playerJson).not.toContain("PRIVATE-SUPPORT-CARD");
    expect(playerJson).not.toContain("p2-hand-PRIVATE-HAND-CARD");
    expect(playerJson).not.toContain("p2-support-PRIVATE-SUPPORT-CARD");
    expect(playerView.state.seed).toBeUndefined();

    const hiddenHand = playerView.state.players.p2.hand[0];
    expect(hiddenHand).toEqual({ uid: "hidden:p1:p2:hand:0" });
    expect(hiddenHand).not.toHaveProperty("cardId");
    expect(hiddenHand).not.toHaveProperty("name");
    const hiddenSupport = playerView.state.players.p2.supports[0];
    expect(hiddenSupport).toEqual({ uid: "hidden:p1:p2:support:0", revealed: false });
    expect(hiddenSupport).not.toHaveProperty("cardId");
    expect(hiddenSupport).not.toHaveProperty("name");

    // Own interaction-bearing ids remain intact for a seated viewer.
    expect(playerView.state.players.p1.hand[0]).toEqual(ownCard);
    const ownerView = engine.getViewerState({ role: "player", actorId: PLAYER_2 }) as {
      state: { players: Record<"p1" | "p2", { hand: Array<Record<string, unknown>> }> };
    };
    expect(ownerView.state.players.p2.hand[0]).toEqual({
      uid: "p2-hand-PRIVATE-HAND-CARD",
      cardId: "PRIVATE-HAND-CARD",
    });

    // Public projections hide both players' private zones and fail closed for
    // a forged player identity.
    const spectatorJson = JSON.stringify(engine.getViewerState({ role: "spectator" }));
    expect(spectatorJson).not.toContain(ownCard.uid);
    expect(spectatorJson).not.toContain("PRIVATE-HAND-CARD");
    expect(() => engine.getViewerState({ role: "player", actorId: "mallory" })).toThrow(
      /not seated/,
    );
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

  it("rejects an unknown card in either player's server-side instance map", async () => {
    const leaders = playableLeaders();
    const first = leaders[0];
    const second = leaders[1] ?? first;
    if (!first || !second) throw new Error("Naruto cards package ships no leaders.");

    const p1Unknown = flatDeckCards(first.id);
    p1Unknown[1] = "NOT-A-NARUTO-CARD";
    await expect(
      narutoCreateServerEngine({
        ...createInput("p1-unknown"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, p1Unknown),
      }),
    ).rejects.toThrow(/unknown card/);

    const p2Unknown = flatDeckCards(second.id);
    p2Unknown[1] = "NOT-A-NARUTO-CARD";
    await expect(
      narutoCreateServerEngine({
        ...createInput("p2-unknown"),
        cardsMaps: cardsMapsWithDeck(PLAYER_2, p2Unknown),
      }),
    ).rejects.toThrow(/unknown card/);
  });

  it("rejects a short main deck before initial state creation", async () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("Naruto cards package ships no leaders.");
    const cards = flatDeckCards(leader.id);
    cards.splice(1, 1);

    await expect(
      narutoCreateServerEngine({
        ...createInput("short-main"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, cards),
      }),
    ).rejects.toThrow(/wrongSize/);
  });

  it("rejects a long main deck before initial state creation", async () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("Naruto cards package ships no leaders.");
    const { main } = leaderAndMainCards(leader.id);
    const addable = main.find((cardId) => main.filter((id) => id === cardId).length < 4);
    if (!addable) throw new Error("Expected an under-copy-limit test card.");
    const cards = flatDeckCards(leader.id);
    cards.splice(1, 0, addable);

    await expect(
      narutoCreateServerEngine({
        ...createInput("long-main"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, cards),
      }),
    ).rejects.toThrow(/wrongSize/);
  });

  it("rejects main cards whose color does not match the leader", async () => {
    const leaders = playableLeaders();
    const leader = leaders[0];
    const otherLeader = leaders.find((candidate) => candidate.color !== leader?.color);
    if (!leader || !otherLeader) throw new Error("Expected leaders in distinct Naruto colors.");
    const offColor = buildDeck(otherLeader.id).cardIds[0];
    if (!offColor) throw new Error("Expected a card in the other leader's deck.");
    const cards = flatDeckCards(leader.id);
    cards[1] = offColor;

    await expect(
      narutoCreateServerEngine({
        ...createInput("wrong-color"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, cards),
      }),
    ).rejects.toThrow(/wrongColor/);
  });

  it("rejects main decks above the copy limit", async () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("Naruto cards package ships no leaders.");
    const { main } = leaderAndMainCards(leader.id);
    const capped = main.find((cardId) => main.filter((id) => id === cardId).length === 4);
    const replacementIndex = main.findIndex((cardId) => cardId !== capped);
    if (!capped || replacementIndex < 0) throw new Error("Expected a four-copy Naruto card.");
    const cards = flatDeckCards(leader.id);
    cards[1 + replacementIndex] = capped;

    await expect(
      narutoCreateServerEngine({
        ...createInput("too-many-copies"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, cards),
      }),
    ).rejects.toThrow(/tooManyCopies/);
  });

  it("rejects multiple leaders, including repeated copies of the same leader", async () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("Naruto cards package ships no leaders.");
    const cards = flatDeckCards(leader.id);
    cards.splice(1, 0, leader.id);

    await expect(
      narutoCreateServerEngine({
        ...createInput("multiple-leaders"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, cards),
      }),
    ).rejects.toThrow(/exactly one leader/);
  });

  it("rejects missing or over-count Chakra side cards", async () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("Naruto cards package ships no leaders.");
    const missing = flatDeckCards(leader.id);
    const firstChakra = missing.findIndex((cardId) => getCardById(cardId)?.cardType === "chakra");
    if (firstChakra < 0) throw new Error("Expected a Chakra card in the Preview deck.");
    missing.splice(firstChakra, 1);
    await expect(
      narutoCreateServerEngine({
        ...createInput("missing-chakra"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, missing),
      }),
    ).rejects.toThrow(/wrongChakraCount/);

    const tooMany = flatDeckCards(leader.id);
    const chakraId = tooMany.find((cardId) => getCardById(cardId)?.cardType === "chakra");
    if (!chakraId) throw new Error("Expected a Chakra card in the Preview deck.");
    tooMany.push(chakraId);
    await expect(
      narutoCreateServerEngine({
        ...createInput("too-many-chakra"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, tooMany),
      }),
    ).rejects.toThrow(/wrongChakraCount/);
  });

  it("rejects missing or over-count Summon side cards", async () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("Naruto cards package ships no leaders.");
    const missing = flatDeckCards(leader.id).filter(
      (cardId) => getCardById(cardId)?.cardType !== "summon",
    );
    await expect(
      narutoCreateServerEngine({
        ...createInput("missing-summon"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, missing),
      }),
    ).rejects.toThrow(/exactly one Summon/);

    const tooMany = flatDeckCards(leader.id);
    const summonId = tooMany.find((cardId) => getCardById(cardId)?.cardType === "summon");
    if (!summonId) throw new Error("Expected a Summon card in the Preview deck.");
    tooMany.push(summonId);
    await expect(
      narutoCreateServerEngine({
        ...createInput("too-many-summon"),
        cardsMaps: cardsMapsWithDeck(PLAYER_1, tooMany),
      }),
    ).rejects.toThrow(/exactly one Summon/);
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

    // Do not defer malformed leader attack routing to engine legality.  The
    // adapter must prevent a forged uid from entering persisted move records.
    const forgedLeader = engine.dispatch(
      "DECLARE_ATTACK",
      PLAYER_1,
      {
        attackerKind: "leader",
        attackerUid: "anything-but-leader:p1",
        targetKind: "leader",
        targetUid: "leader:p2",
      },
      CONTEXT,
    );
    expect(forgedLeader.success).toBe(false);
    if (!forgedLeader.success) expect(forgedLeader.errorCode).toBe("invalid_move_payload");

    expect(() =>
      narutoActionFromPayload(
        "DECLARE_ATTACK",
        {
          attackerKind: "leader",
          attackerUid: "leader:p1",
          targetKind: "leader",
          targetUid: "leader:p1",
        },
        "p1",
      ),
    ).toThrow(/opposing leader uid/);

    expect(() =>
      narutoActionFromPayload(
        "DECLARE_ATTACK",
        {
          attackerKind: "character",
          attackerUid: "p1-character-0",
          targetKind: "character",
          targetUid: null,
        },
        "p1",
      ),
    ).toThrow(/attack targets/);
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
    expect(snapshot.historyLength).toBe(engine.getStateID());
    expect(snapshot.metadata).toMatchObject({
      runtimeFingerprint: {
        game: "naruto",
      },
      rulesProfile: { id: "naruto-preview-v1", version: 1, status: "provisional" },
    });
    const payload = snapshot.state as NarutoSnapshotState;
    expect(payload.gameSlug).toBe("naruto");
    expect(payload.stateVersion).toBe(engine.getStateID());
    expect(payload.seats).toEqual({ p1: PLAYER_1, p2: PLAYER_2 });
    expect(payload.state.rulesProfile).toMatchObject({
      id: "naruto-preview-v1",
      version: 1,
      status: "provisional",
    });

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
    const identitySnapshot = narutoSerializeEngine(await createEngine(), testCardsMaps());
    identitySnapshot.state = { gameSlug: "gundam" };
    await expect(
      narutoRestoreEngine(identitySnapshot, {
        gameSlug: "naruto",
        seed: "s",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
      }),
    ).rejects.toThrow(/gameSlug/);

    const truncatedSnapshot = narutoSerializeEngine(await createEngine(), testCardsMaps());
    delete (
      (truncatedSnapshot.state as NarutoSnapshotState).state.players.p1 as unknown as Record<
        string,
        unknown
      >
    ).hand;
    await expect(
      narutoRestoreEngine(truncatedSnapshot, {
        gameSlug: "naruto",
        seed: "s",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
      }),
    ).rejects.toThrow(/invalid hand zone/);
  });

  it("rejects missing or mismatched preview rules profiles on restore", async () => {
    const engine = await createEngine();
    const snapshot = narutoSerializeEngine(engine, testCardsMaps());
    const missingProfile = structuredClone(snapshot);
    delete (
      (missingProfile.state as NarutoSnapshotState).state as unknown as Record<string, unknown>
    ).rulesProfile;
    const restoreContext = {
      gameSlug: "naruto" as const,
      seed: "naruto-seed-1",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
    };

    await expect(narutoRestoreEngine(missingProfile, restoreContext)).rejects.toThrow(
      /missing the preview rules profile/,
    );

    const mismatchedProfile = structuredClone(snapshot);
    (
      (mismatchedProfile.state as NarutoSnapshotState).state as unknown as Record<string, unknown>
    ).rulesProfile = { id: "naruto-preview-v2", version: 2, status: "provisional" };
    await expect(narutoRestoreEngine(mismatchedProfile, restoreContext)).rejects.toThrow(
      /unsupported preview rules profile/,
    );
  });

  it("rejects missing, drifted, or mis-seated snapshot identities", async () => {
    const snapshot = narutoSerializeEngine(await createEngine(), testCardsMaps());
    const context = {
      gameSlug: "naruto" as const,
      seed: "naruto-seed-1",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
    };

    const missingIdentity = structuredClone(snapshot);
    delete missingIdentity.metadata;
    await expect(narutoRestoreEngine(missingIdentity, context)).rejects.toThrow(/runtime identity/);

    const changedRuntime = structuredClone(snapshot);
    (
      (changedRuntime.metadata as Record<string, unknown>).runtimeFingerprint as Record<
        string,
        unknown
      >
    ).runtimeHash = "runtime-drift";
    await expect(narutoRestoreEngine(changedRuntime, context)).rejects.toThrow(
      /runtime fingerprint/,
    );

    const changedCards = structuredClone(snapshot);
    const cards = (
      (changedCards.metadata as Record<string, unknown>).runtimeFingerprint as Record<
        string,
        unknown
      >
    ).cards as Record<string, unknown>;
    cards.hash = "card-drift";
    await expect(narutoRestoreEngine(changedCards, context)).rejects.toThrow(/card fingerprint/);

    const changedCompatibility = structuredClone(snapshot);
    const engineIdentity = (
      (changedCompatibility.metadata as Record<string, unknown>).runtimeFingerprint as Record<
        string,
        unknown
      >
    ).engine as Record<string, unknown>;
    (engineIdentity.metadata as Record<string, unknown>).compatibilityVersion = "2.0.0-preview.1";
    await expect(narutoRestoreEngine(changedCompatibility, context)).rejects.toThrow(
      /engine compatibility identity/,
    );

    const changedBuild = structuredClone(snapshot);
    const buildEngine = (
      (changedBuild.metadata as Record<string, unknown>).runtimeFingerprint as Record<
        string,
        unknown
      >
    ).engine as Record<string, unknown>;
    (buildEngine.metadata as Record<string, unknown>).buildId = "different-build";
    await expect(narutoRestoreEngine(changedBuild, context)).rejects.toThrow(
      /engine compatibility identity/,
    );

    const changedRules = structuredClone(snapshot);
    (
      (changedRules.metadata as Record<string, unknown>).rulesProfile as Record<string, unknown>
    ).version = 2;
    await expect(narutoRestoreEngine(changedRules, context)).rejects.toThrow(
      /rules profile identity/,
    );

    await expect(
      narutoRestoreEngine(snapshot, { ...context, player1Id: "not-alice" }),
    ).rejects.toThrow(/seats/);
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

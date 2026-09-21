import { gundamAnimationPlan } from "./gundam-animation.js";
import { describe, expect, it } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import type {
  LocalEngine,
  MatchState,
  MatchStaticResources,
  PacketAnimation,
  PendingChoicePrompt,
} from "@tcg/gundam-engine";
import { GundamServerEngine, gundamPacketAnimation } from "./gundam-server-engine.js";

describe("GundamServerEngine interaction submission", () => {
  it("rejects invalid protocol values before native command dispatch", () => {
    const calls: unknown[] = [];
    const pendingChoice: PendingChoicePrompt = {
      kind: "targetSelection",
      effectId: "effect-1",
      controllerId: "p1",
      sourceCardId: "source-1",
      directiveIndex: 0,
      filter: { owner: "any" },
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: ["target-1"],
      groups: [{ minTargets: 1, maxTargets: 1, legalTargetIds: ["target-1"] }],
      prompt: "Choose a target.",
    };
    const engine = new GundamServerEngine(
      {
        getStateID: () => 5,
        getState: () =>
          ({
            ctx: { status: { gameEnded: false, activePlayer: "p1" } },
          }) as MatchState,
        getRuntime: () => ({
          getPendingChoice: () => pendingChoice,
        }),
        executeCommand: (command: unknown) => {
          calls.push(command);
          return { success: true };
        },
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );
    const submission: InteractionSubmission = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 5,
      requestId: "gundam:5:resolveEffect:effect-1",
      actionId: "resolveEffect",
      values: {
        pendingEffectId: "effect-1",
        targets: ["target-2"],
      },
    };

    const result = engine.submitInteraction("p1", submission, {
      gameId: "g1",
      sourceAuthority: "server",
    });

    expect(result.success).toBe(false);
    expect((result as import("@tcg/shared/game-engine").DispatchFailure).errorCode).toBe(
      "invalid_interaction_submission",
    );
    expect(calls).toEqual([]);
  });
});

describe("GundamServerEngine undo", () => {
  it("routes the generic undo move to the authoritative runtime undo", () => {
    const calls: string[] = [];
    const state = { ctx: { _stateID: 8, status: { turn: 2, gameEnded: false } } } as MatchState;
    const engine = new GundamServerEngine(
      {
        getStateID: () => 8,
        getState: () => state,
        canUndo: () => true,
        undo: (playerId: string) => {
          calls.push(playerId);
          return {
            success: true,
            stateID: 9,
            state: { ...state, ctx: { ...state.ctx, _stateID: 9 } },
            patches: [],
            gameEvents: [],
            logEntries: [],
            processedCommand: {
              commandID: "undo-p1-9",
              move: "undo",
              prevStateID: 8,
              actorRole: "player",
              args: {},
            },
            animations: [],
            undoable: false,
          };
        },
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    const result = engine.dispatch("undo", "p1", {}, { gameId: "g1", sourceAuthority: "server" });

    expect(calls).toEqual(["p1"]);
    expect(result).toMatchObject({ success: true, stateID: 9, undoable: false });
    if (!result.success) throw new Error("Expected the undo to succeed.");
    expect(result.acceptedMoveRecord?.transitionType).toBe("undo");
  });
});

describe("GundamServerEngine forfeit", () => {
  it("concedes as the loser and persists a forfeit record for the winner", () => {
    const calls: Array<{ playerId: string; command: { move: string; args: unknown } }> = [];
    const liveState = {
      ctx: {
        _stateID: 4,
        playerIds: ["p1", "p2"],
        status: {
          turn: 3,
          gameEnded: false,
          activePlayer: "p2",
          winner: undefined,
          winReason: undefined,
        },
        time: { mode: "none" },
      },
    } as MatchState;
    const engine = new GundamServerEngine(
      {
        getStateID: () => liveState.ctx._stateID,
        getState: () => liveState,
        executeCommand: (command: { move: string; args: unknown }, playerId: string) => {
          calls.push({ playerId, command });
          liveState.ctx._stateID = 5;
          liveState.ctx.status.gameEnded = true;
          liveState.ctx.status.winner = "p1";
          liveState.ctx.status.winReason = "p2 conceded";
          return {
            success: true,
            stateID: 5,
            state: liveState,
            patches: [],
            gameEvents: [],
            logEntries: [],
            processedCommand: command,
            animations: [],
            undoable: false,
            moveLogs: [],
          };
        },
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    const result = engine.forfeit("p1", "disconnect", {
      gameId: "g1",
      sourceAuthority: "server",
    });

    expect(calls).toEqual([
      {
        playerId: "p2",
        command: expect.objectContaining({ move: "concede", args: {} }),
      },
    ]);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.acceptedMoveRecord).toMatchObject({
      moveId: "forfeitGame",
      actorId: "p1",
      stateVersion: 5,
    });
    expect(result.state).toMatchObject({
      ctx: { status: { gameEnded: true, winner: "p1", winReason: "disconnect" } },
    });
    expect(engine.getGameEndResult()).toEqual({ winnerId: "p1", reason: "disconnect" });
  });

  it("rejects a forfeit to a player who is not seated", () => {
    const engine = new GundamServerEngine(
      {
        getStateID: () => 1,
        getState: () =>
          ({
            ctx: {
              _stateID: 1,
              playerIds: ["p1", "p2"],
              status: { gameEnded: false, activePlayer: "p1" },
            },
          }) as MatchState,
        executeCommand: () => {
          throw new Error("must not execute");
        },
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    const result = engine.forfeit("p3", "timeout", {
      gameId: "g1",
      sourceAuthority: "server",
    });

    expect(result).toMatchObject({
      success: false,
      errorCode: "invalid_forfeit_winner",
      stateID: 1,
    });
  });
});

describe("GundamServerEngine timeout recovery", () => {
  it("treats a second reserve timeout while the requester holds priority as a force drop", () => {
    const now = Date.now();
    const engine = new GundamServerEngine(
      {
        getState: () =>
          ({
            ctx: {
              time: {
                mode: "dynamic",
                running: false,
                activePlayerID: "p1",
                players: {
                  p1: { reserveMsRemaining: 60_000, timeoutCount: 0, isInNegativeTime: false },
                  p2: { reserveMsRemaining: 0, timeoutCount: 1, isInNegativeTime: true },
                },
                config: { resetTimeOnSkipMs: 45_000, graceMs: 0 },
              },
            },
          }) as MatchState,
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: now,
      }),
    ).toMatchObject({
      skip: {
        allowed: true,
        timeout: "second",
        stallerPlayerId: "p2",
        timeoutCount: 1,
        forceDrop: true,
        resetTimeOnSkipMs: 45_000,
      },
      drop: { allowed: true, reason: "timeout_allowed" },
    });
  });

  it("starts grace when the active reserve is exactly zero", () => {
    const now = 1_700_000_000_000;
    const engine = new GundamServerEngine(
      {
        getState: () =>
          ({
            ctx: {
              time: {
                mode: "dynamic",
                running: true,
                activePlayerID: "p2",
                startedAtMs: now,
                players: {
                  p2: { reserveMsRemaining: 0, timeoutCount: 0, isInNegativeTime: false },
                },
                config: { resetTimeOnSkipMs: 45_000, graceMs: 15_000, maxDecisionTimeMs: 180_000 },
              },
            },
          }) as MatchState,
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: now,
      }).drop,
    ).toMatchObject({
      allowed: false,
      reason: "timeout_grace_pending",
      remainingMs: 15_000,
    });
  });

  it("waits for configured grace before a reserve drop", () => {
    const now = 1_700_000_000_000;
    const engine = new GundamServerEngine(
      {
        getState: () =>
          ({
            ctx: {
              time: {
                mode: "dynamic",
                running: true,
                activePlayerID: "p2",
                startedAtMs: now,
                players: {
                  p2: { reserveMsRemaining: 0, timeoutCount: 0, isInNegativeTime: true },
                },
                config: { resetTimeOnSkipMs: 45_000, graceMs: 15_000, maxDecisionTimeMs: 180_000 },
              },
            },
          }) as MatchState,
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: now + 14_999,
      }).drop,
    ).toMatchObject({ allowed: false, reason: "timeout_grace_pending" });
    expect(
      engine.evaluateOpponentTimeout({
        requesterPlayerId: "p1",
        opponentPlayerId: "p2",
        nowMs: now + 15_000,
      }).drop.allowed,
    ).toBe(true);
  });

  it("resets the skipped player's clock without incrementing an already-advanced timeout count", () => {
    const state = {
      ctx: {
        time: {
          mode: "dynamic",
          running: false,
          activePlayerID: "p2",
          players: {
            p2: {
              reserveMsRemaining: -1,
              timeoutCount: 1,
              isInNegativeTime: true,
            },
          },
          config: { resetTimeOnSkipMs: 60_000, graceMs: 0 },
        },
      },
    } as MatchState;
    const runtime = { state };
    const engine = new GundamServerEngine(
      {
        getRuntime: () => runtime,
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );

    engine.resetPlayerTimeAfterSkip("p2", { resetMs: 30_000, previousTimeoutCount: 0 });

    expect(runtime.state.ctx.time).toMatchObject({
      players: {
        p2: {
          reserveMsRemaining: 30_000,
          timeoutCount: 1,
          isInNegativeTime: false,
        },
      },
    });
  });
});

describe("gundamPacketAnimation", () => {
  it("preserves native private identities for renderer-level privacy validation", () => {
    const packet = gundamPacketAnimation({
      id: "draw-1",
      type: "cardMove",
      duration: 420,
      data: {
        kind: "cardMove",
        cardId: "private-card-id",
        ownerId: "p2",
        fromZone: "deck",
        toZone: "hand",
      },
    });

    expect(packet.payload).toMatchObject({
      cardId: "private-card-id",
      ownerId: "p2",
      fromZone: "deck",
      toZone: "hand",
    });
  });
});

describe("gundamAnimationPlan", () => {
  it("flips a removed Shield from hidden to public during its transfer", () => {
    const plan = gundamAnimationPlan(
      "shield-damage",
      [
        {
          id: "shield-1",
          type: "cardMove",
          duration: 420,
          data: {
            kind: "cardMove",
            cardId: "shield-1",
            ownerId: "p2",
            fromZone: "shieldArea",
            toZone: "trash",
          },
        },
      ],
      "p1",
      { zones: { zones: {} }, players: [] },
    );

    expect(plan?.steps[0]).toMatchObject({
      type: "entityTransfer",
      sourceFace: "hidden",
      destinationFace: "public",
    });
  });

  it("maps an explicit card flip to the shared face-change animation", () => {
    const plan = gundamAnimationPlan(
      "reveal",
      [
        {
          id: "reveal-1",
          type: "cardFlip",
          duration: 320,
          data: { kind: "cardFlip", cardId: "shield-1", faceDown: false },
        },
      ],
      "p1",
      { zones: { zones: {} }, players: [] },
    );

    expect(plan?.steps[0]).toMatchObject({
      type: "entityStateChange",
      change: "face",
      sourceFace: "hidden",
      destinationFace: "public",
    });
  });
});

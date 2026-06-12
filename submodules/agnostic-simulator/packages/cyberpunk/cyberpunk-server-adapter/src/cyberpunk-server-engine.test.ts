import { describe, expect, it } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import type { LocalEngine, MatchState, PlayerPrompt } from "@tcg/cyberpunk-engine";
import type { DispatchSuccess } from "@tcg/shared/game-engine";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine.js";

describe("CyberpunkServerEngine interaction submission", () => {
  it("rejects invalid protocol values before native command dispatch", () => {
    const calls: unknown[] = [];
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["card_1"] } },
      ],
    };
    const engine = new CyberpunkServerEngine({
      getState: () => ({ ctx: { stateID: 4 }, G: { gameEnded: false } }),
      getPrompt: () => prompt,
      processCommand: (command: unknown) => {
        calls.push(command);
        return { success: true };
      },
      getEffectiveActivePlayerId: () => "p1",
    } as unknown as LocalEngine);
    const submission: InteractionSubmission = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 4,
      requestId: "cyberpunk:4:sellCard",
      actionId: "sellCard",
      values: { cardId: "card_2" },
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

describe("CyberpunkServerEngine undo", () => {
  it("executes the native undo stack and advances the authoritative state id", () => {
    const state = {
      ctx: { stateID: 4 },
      G: {
        gameEnded: false,
        turnMetadata: { turnNumber: 1 },
      },
    } as MatchState;
    const engine = new CyberpunkServerEngine({
      canUndo: () => true,
      undo: () => {
        state.ctx.stateID = 3;
        return true;
      },
      getState: () => state,
      getEffectiveActivePlayerId: () => "p1",
    } as unknown as LocalEngine);

    const result = engine.dispatch("undo", "p1", {}, { gameId: "g1", sourceAuthority: "server" });

    expect(result.success).toBe(true);
    expect(result).toMatchObject({
      stateID: 5,
      acceptedMoveRecord: {
        moveId: "undo",
        transitionType: "undo",
        undoneStateID: 4,
      },
      undoable: false,
    });
    expect(state.ctx.stateID).toBe(5);
  });
});

describe("CyberpunkServerEngine animation packets", () => {
  it("forwards engine animation scripts alongside successful dispatch results", () => {
    const state = {
      ctx: { stateID: 7 },
      G: {
        gameEnded: false,
        turnMetadata: { turnNumber: 2 },
      },
    };
    const engine = new CyberpunkServerEngine({
      getState: () => state,
      processCommand: () => ({
        success: true,
        stateID: 8,
        state,
        patches: [],
        inversePatches: [],
        gameEvents: [{ type: "phaseChanged", playerId: "p1" }],
        moveLogs: [
          {
            type: "action",
            playerId: "p1",
            timestamp: 1,
            turnNumber: 2,
            messageKey: "phase.changed",
          },
        ],
        animationScript: {
          steps: [
            {
              id: "step-1",
              kind: "phaseChange",
              startMs: 0,
              durationMs: 120,
              from: "main",
              to: "run",
              playerId: "p1",
            },
          ],
          totalDurationMs: 120,
        },
        processedCommand: { commandID: "cmd-1", move: "passPhase" },
        undoable: true,
      }),
      getEffectiveActivePlayerId: () => "p1",
    } as unknown as LocalEngine);

    const result = engine.dispatch(
      "passPhase",
      "p1",
      {},
      {
        gameId: "game-1",
        sourceAuthority: "server",
      },
    ) as DispatchSuccess;

    expect(result.animations).toHaveLength(1);
    expect(result.animations?.[0]).toMatchObject({
      id: "game-1:p1:8:animation-script",
      kind: "cyberpunk.animationScript",
      payload: {
        actorId: "p1",
        moveType: "passPhase",
        stateID: 8,
        animationScript: {
          totalDurationMs: 120,
        },
      },
    });
  });
});

describe("CyberpunkServerEngine public game-end summary", () => {
  it("exposes final Cyberpunk Street Cred and Gig counts after a Gig victory", () => {
    const engine = new CyberpunkServerEngine({
      getState: () => ({
        ctx: { stateID: 12, playerIds: ["p1", "p2"] },
        G: {
          gameEnded: true,
          winReason: "gig_victory",
          overtime: false,
          turnMetadata: { overtimeActive: false },
          players: {
            p1: { gigArea: ["d6-a", "d8-a"] },
            p2: { gigArea: ["d4-b"] },
          },
          gigDice: {
            "d6-a": { faceValue: 6 },
            "d8-a": { faceValue: 8 },
            "d4-b": { faceValue: 4 },
          },
        },
      }),
      getEffectiveActivePlayerId: () => "p1",
    } as unknown as LocalEngine);

    expect(engine.getPublicGameEndSummary()).toEqual({
      game: "cyberpunk",
      endReason: "gig_victory",
      overtimeActive: false,
      players: [
        { playerId: "p1", seat: 1, streetCred: 14, gigCount: 2 },
        { playerId: "p2", seat: 2, streetCred: 4, gigCount: 1 },
      ],
    });
  });

  it("marks overtime terminal states", () => {
    const engine = new CyberpunkServerEngine({
      getState: () => ({
        ctx: { stateID: 13, playerIds: ["p1", "p2"] },
        G: {
          gameEnded: true,
          winReason: "overtime_majority",
          overtime: true,
          turnMetadata: { overtimeActive: true },
          players: {
            p1: { gigArea: ["d6-a"] },
            p2: { gigArea: ["d8-b", "d10-b"] },
          },
          gigDice: {
            "d6-a": { faceValue: 5 },
            "d8-b": { faceValue: 7 },
            "d10-b": { faceValue: 9 },
          },
        },
      }),
      getEffectiveActivePlayerId: () => "p2",
    } as unknown as LocalEngine);

    expect(engine.getPublicGameEndSummary()).toMatchObject({
      game: "cyberpunk",
      endReason: "overtime_majority",
      overtimeActive: true,
      players: [
        { playerId: "p1", seat: 1, streetCred: 5, gigCount: 1 },
        { playerId: "p2", seat: 2, streetCred: 16, gigCount: 2 },
      ],
    });
  });

  it("preserves concession terminal reasons", () => {
    const engine = new CyberpunkServerEngine({
      getState: () => ({
        ctx: { stateID: 14, playerIds: ["p1", "p2"] },
        G: {
          gameEnded: true,
          winReason: "concede",
          overtime: false,
          turnMetadata: { overtimeActive: false },
          players: {
            p1: { gigArea: [] },
            p2: { gigArea: ["d6-b"] },
          },
          gigDice: {
            "d6-b": { faceValue: 6 },
          },
        },
      }),
      getEffectiveActivePlayerId: () => "p2",
    } as unknown as LocalEngine);

    expect(engine.getPublicGameEndSummary()).toMatchObject({
      endReason: "concede",
      players: [
        { playerId: "p1", seat: 1, streetCred: 0, gigCount: 0 },
        { playerId: "p2", seat: 2, streetCred: 6, gigCount: 1 },
      ],
    });
  });

  it("preserves deck-out terminal reasons", () => {
    const engine = new CyberpunkServerEngine({
      getState: () => ({
        ctx: { stateID: 15, playerIds: ["p1", "p2"] },
        G: {
          gameEnded: true,
          winReason: "deck_out_victory",
          overtime: false,
          turnMetadata: { overtimeActive: false },
          players: {
            p1: { gigArea: ["d4-a"] },
            p2: { gigArea: [] },
          },
          gigDice: {
            "d4-a": { faceValue: 3 },
          },
        },
      }),
      getEffectiveActivePlayerId: () => "p1",
    } as unknown as LocalEngine);

    expect(engine.getPublicGameEndSummary()).toMatchObject({
      endReason: "deck_out_victory",
      players: [
        { playerId: "p1", seat: 1, streetCred: 3, gigCount: 1 },
        { playerId: "p2", seat: 2, streetCred: 0, gigCount: 0 },
      ],
    });
  });

  it("returns undefined while the game is still live", () => {
    const engine = new CyberpunkServerEngine({
      getState: () => ({
        ctx: { stateID: 1, playerIds: ["p1", "p2"] },
        G: { gameEnded: false },
      }),
      getEffectiveActivePlayerId: () => "p1",
    } as unknown as LocalEngine);

    expect(engine.getPublicGameEndSummary()).toBeUndefined();
  });
});

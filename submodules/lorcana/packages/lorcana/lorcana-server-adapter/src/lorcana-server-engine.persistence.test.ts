import { describe, expect, it } from "bun:test";
import { createPlayerId, type LorcanaServer, type MoveLog } from "@tcg/lorcana-engine";
import { LorcanaServerEngine } from "./lorcana-server-engine";

describe("LorcanaServerEngine persistence records", () => {
  it("keeps the submitted move when the engine auto-resolves a bag entry", () => {
    const playerTwo = createPlayerId("player_two");
    const moveHistory: ReturnType<LorcanaServer["getMoveHistory"]> = [];
    const moveLogs: MoveLog[] = [];
    const server = {
      getMoveHistory: (limit?: number) =>
        limit && limit > 0 ? moveHistory.slice(-limit) : [...moveHistory],
      getMoveLogHistory: () => [...moveLogs],
      dispatch: () => {
        moveHistory.push(
          {
            moveId: "playCard",
            input: { args: { cardId: "violet", cost: "standard" } },
            playerId: playerTwo,
            role: "player",
            timestamp: 100,
            stateID: 13,
            turnNumber: 5,
            transitionType: "move",
            newStateID: 13,
          },
          {
            moveId: "resolveBag",
            input: { args: { bagId: "bag:12:1" } },
            playerId: "player_two",
            role: "player",
            timestamp: 101,
            stateID: 14,
            turnNumber: 5,
            transitionType: "move",
            newStateID: 14,
          },
        );
        moveLogs.push(
          {
            moveType: "playCard",
            playerId: playerTwo,
            timestamp: 100,
            public: [],
          },
          {
            moveType: "resolveEffect",
            playerId: playerTwo,
            timestamp: 101,
            public: [],
          },
        );
        return {
          success: true as const,
          stateID: 14,
          state: { stateID: 14 },
          patches: [],
          animations: [],
          moveLogs: [moveLogs[1]!],
          processedCommand: {
            commandID: "auto-drain-13",
            move: "resolveBag",
            input: { args: { bagId: "bag:12:1" } },
          },
          undoable: true,
        };
      },
    } as unknown as LorcanaServer;
    const adapter = new LorcanaServerEngine(server);

    const result = adapter.dispatch(
      "playCard",
      "player_two",
      { cardId: "violet", cost: "standard" },
      { gameId: "game-1", sourceAuthority: "server" },
    );

    expect(result.success).toBe(true);
    if (!result.success || result.transition !== "move") return;
    expect(result.acceptedMoveRecord).toMatchObject({
      moveId: "playCard",
      stateVersion: 14,
      actorId: "player_two",
      input: { args: { cardId: "violet", cost: "standard" } },
      processedCommand: {
        move: "playCard",
        input: { args: { cardId: "violet", cost: "standard" } },
      },
    });
    expect(result.engineLogRecords?.map((record) => (record.log as MoveLog).moveType)).toEqual([
      "playCard",
      "resolveEffect",
    ]);
  });

  it("persists a judge forfeit even when the engine omitted move history", () => {
    const winnerId = createPlayerId("player_one");
    const server = {
      getMoveHistory: () => [],
      getMoveLogHistory: () => [],
      forfeitGame: () => ({
        success: true as const,
        stateID: 9,
        state: { ctx: { status: { gameEnded: true, winner: winnerId, turn: 4 } } },
        patches: [{ op: "replace", path: "/ctx/status/gameEnded", value: true }],
        animations: [],
        moveLogs: [],
        processedCommand: {
          commandID: "forfeit-player_one-1",
          move: "forfeitGame",
          input: { args: { winnerId, reason: "disconnect" } },
        },
        undoable: false,
      }),
    } as unknown as LorcanaServer;
    const adapter = new LorcanaServerEngine(server);

    const result = adapter.forfeit(winnerId, "disconnect", {
      gameId: "game-1",
      sourceAuthority: "server",
    });

    expect(result.success).toBe(true);
    if (!result.success || result.transition !== "move") return;
    expect(result.acceptedMoveRecord).toMatchObject({
      moveId: "forfeitGame",
      actorId: winnerId,
      stateVersion: 9,
      turnNumber: 4,
      processedCommand: { move: "forfeitGame" },
    });
  });

  it("does not synthesize an accepted-move record for non-forfeit successes", () => {
    const server = {
      getMoveHistory: () => [],
      getMoveLogHistory: () => [],
      dispatch: () => ({
        success: true as const,
        stateID: 4,
        state: { ctx: { status: { turn: 2 } } },
        patches: [],
        animations: [],
        moveLogs: [],
        processedCommand: {
          commandID: "automated-noop-1",
          move: "automatedNoop",
        },
        undoable: false,
      }),
    } as unknown as LorcanaServer;
    const adapter = new LorcanaServerEngine(server);

    expect(() =>
      adapter.dispatch(
        "passTurn",
        "player_one",
        {},
        { gameId: "game-1", sourceAuthority: "server" },
      ),
    ).toThrow("Lorcana dispatch succeeded without a move history entry.");
  });

  it("uses the recorded judge forfeit history entry when present", () => {
    const winnerId = createPlayerId("player_one");
    const moveHistory: ReturnType<LorcanaServer["getMoveHistory"]> = [];
    const server = {
      getMoveHistory: (limit?: number) =>
        limit && limit > 0 ? moveHistory.slice(-limit) : [...moveHistory],
      getMoveLogHistory: () => [],
      forfeitGame: () => {
        moveHistory.push({
          moveId: "forfeitGame",
          input: { args: { winnerId, reason: "disconnect" } },
          playerId: winnerId,
          role: "judge",
          timestamp: 200,
          stateID: 9,
          turnNumber: 3,
          transitionType: "move",
          newStateID: 9,
        });
        return {
          success: true as const,
          stateID: 9,
          state: { ctx: { status: { gameEnded: true, winner: winnerId } } },
          patches: [],
          animations: [],
          moveLogs: [],
          processedCommand: {
            commandID: "forfeit-player_one-1",
            move: "forfeitGame",
            input: { args: { winnerId, reason: "disconnect" } },
          },
          undoable: false,
        };
      },
    } as unknown as LorcanaServer;
    const adapter = new LorcanaServerEngine(server);

    const result = adapter.forfeit(winnerId, "disconnect", {
      gameId: "game-1",
      sourceAuthority: "server",
    });

    expect(result.success).toBe(true);
    if (!result.success || result.transition !== "move") return;
    expect(result.acceptedMoveRecord).toMatchObject({
      moveId: "forfeitGame",
      actorId: winnerId,
      turnNumber: 3,
      stateVersion: 9,
    });
  });
});

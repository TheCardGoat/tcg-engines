import { expect, mock, test } from "bun:test";

mock.module("$env/dynamic/public", () => ({ env: {} }));
const { bugReportContextFromBoard } = await import("./feedback-api.js");

const board = {
  gameID: "client-engine-game",
  playerOrder: ["player-one", "player-two"],
  turnNumber: 0,
  stateID: 0,
};

test("hosted reports use platform identity rather than the client engine identity", () => {
  expect(
    bugReportContextFromBoard(board, {
      gameId: "platform-game",
      matchId: "platform-match",
      platform: "desktop",
    }),
  ).toEqual({
    gameId: "platform-game",
    matchId: "platform-match",
    gameSlug: "lorcana",
    playerCount: 2,
    turn: 0,
    stateVersion: 0,
    platform: "desktop",
  });
});

test("standalone fixtures retain their engine identity", () => {
  expect(bugReportContextFromBoard(board)?.gameId).toBe("client-engine-game");
});

test("absent platform identity falls back to the engine identity", () => {
  expect(bugReportContextFromBoard(board, { gameId: null })?.gameId).toBe("client-engine-game");
});

test("no board produces no fabricated context", () => {
  expect(bugReportContextFromBoard(null)).toBeUndefined();
});

import { describe, expect, it } from "bun:test";

import {
  clearRequestedPostGameRecord,
  createInitialPostGameRecordRequestState,
  markPostGameRecordLoaded,
  markPostGameRecordRequested,
  resetPostGameRecordRequestStateForGame,
  shouldAutoLoadPostGameRecord,
} from "./record-request-state.js";

describe("PostGameSummaryDialog request lifecycle", () => {
  it("requests a game only once while the dialog stays open, even after a failed load", () => {
    let requestState = createInitialPostGameRecordRequestState();

    expect(
      shouldAutoLoadPostGameRecord({
        open: true,
        gameId: "game-1",
        requestState,
        isLoading: false,
      }),
    ).toBe(true);

    requestState = markPostGameRecordRequested(requestState, "game-1");

    expect(
      shouldAutoLoadPostGameRecord({
        open: true,
        gameId: "game-1",
        requestState,
        isLoading: false,
      }),
    ).toBe(false);
  });

  it("allows a fresh request after closing and reopening the dialog", () => {
    let requestState = markPostGameRecordRequested(
      createInitialPostGameRecordRequestState(),
      "game-1",
    );

    requestState = clearRequestedPostGameRecord(requestState);

    expect(
      shouldAutoLoadPostGameRecord({
        open: true,
        gameId: "game-1",
        requestState,
        isLoading: false,
      }),
    ).toBe(true);
  });

  it("requests a new game when the finished game id changes", () => {
    let requestState = markPostGameRecordLoaded(
      createInitialPostGameRecordRequestState(),
      "game-1",
    );

    requestState = resetPostGameRecordRequestStateForGame(requestState, "game-2");

    expect(
      shouldAutoLoadPostGameRecord({
        open: true,
        gameId: "game-2",
        requestState,
        isLoading: false,
      }),
    ).toBe(true);
  });
});

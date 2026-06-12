import { describe, expect, it } from "bun:test";
import {
  createInitialPostGameModalState,
  dismissPostGameModal,
  reopenPostGameModal,
  syncPostGameModalState,
} from "./modal-state.js";

describe("post-game modal state", () => {
  it("auto-opens the first finished game key", () => {
    const initial = createInitialPostGameModalState();

    const next = syncPostGameModalState(initial, "game-1:12");

    expect(next.open).toBe(true);
    expect(next.finishedGameKey).toBe("game-1:12");
    expect(next.autoOpenedFinishedGameKey).toBe("game-1:12");
  });

  it("does not re-open the same finished game after dismissal", () => {
    const opened = syncPostGameModalState(createInitialPostGameModalState(), "game-1:12");
    const dismissed = dismissPostGameModal(opened);

    const next = syncPostGameModalState(dismissed, "game-1:12");

    expect(next.open).toBe(false);
    expect(next.finishedGameKey).toBe("game-1:12");
    expect(next.autoOpenedFinishedGameKey).toBe("game-1:12");
  });

  it("auto-opens again when a new finished game key appears", () => {
    const opened = syncPostGameModalState(createInitialPostGameModalState(), "game-1:12");
    const dismissed = dismissPostGameModal(opened);

    const next = syncPostGameModalState(dismissed, "game-1:13");

    expect(next.open).toBe(true);
    expect(next.finishedGameKey).toBe("game-1:13");
    expect(next.autoOpenedFinishedGameKey).toBe("game-1:13");
  });

  it("resets when there is no finished game anymore", () => {
    const opened = syncPostGameModalState(createInitialPostGameModalState(), "game-1:12");
    const reopened = reopenPostGameModal(dismissPostGameModal(opened));

    const next = syncPostGameModalState(reopened, null);

    expect(next.open).toBe(false);
    expect(next.finishedGameKey).toBeNull();
    expect(next.autoOpenedFinishedGameKey).toBeNull();
  });
});

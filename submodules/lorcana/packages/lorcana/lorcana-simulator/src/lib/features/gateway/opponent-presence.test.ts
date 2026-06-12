import { afterEach, describe, expect, it, beforeEach } from "bun:test";
import { OpponentPresenceTracker } from "./opponent-presence.svelte.js";

describe("OpponentPresenceTracker", () => {
  let tracker: OpponentPresenceTracker;

  beforeEach(() => {
    tracker = new OpponentPresenceTracker();
  });

  afterEach(() => {
    tracker.dispose();
  });

  it("starts with opponent connected", () => {
    expect(tracker.opponentConnected).toBe(true);
    expect(tracker.disconnectedAtMs).toBeNull();
    expect(tracker.secondsRemaining).toBe(30);
    expect(tracker.canDrop).toBe(false);
  });

  it("marks opponent as disconnected on presence_change", () => {
    const now = new Date().toISOString();
    tracker.handlePresenceChange("disconnected", now);

    expect(tracker.opponentConnected).toBe(false);
    expect(tracker.disconnectedAtMs).toBeDefined();
    expect(tracker.secondsRemaining).toBeLessThanOrEqual(30);
    expect(tracker.secondsRemaining).toBeGreaterThanOrEqual(29);
  });

  it("marks opponent as connected on reconnect", () => {
    const now = new Date().toISOString();
    tracker.handlePresenceChange("disconnected", now);
    tracker.handlePresenceChange("connected");

    expect(tracker.opponentConnected).toBe(true);
    expect(tracker.disconnectedAtMs).toBeNull();
    expect(tracker.secondsRemaining).toBe(30);
    expect(tracker.canDrop).toBe(false);
  });

  it("canDrop becomes true after 30 seconds of disconnect", () => {
    // Simulate a disconnect that happened 31 seconds ago
    const thirtyOneSecondsAgo = new Date(Date.now() - 31_000).toISOString();
    tracker.handlePresenceChange("disconnected", thirtyOneSecondsAgo);

    expect(tracker.opponentConnected).toBe(false);
    expect(tracker.secondsRemaining).toBe(0);
    expect(tracker.canDrop).toBe(true);
  });

  it("secondsRemaining reflects elapsed time since disconnect", () => {
    const tenSecondsAgo = new Date(Date.now() - 10_000).toISOString();
    tracker.handlePresenceChange("disconnected", tenSecondsAgo);

    expect(tracker.secondsRemaining).toBe(20);
  });

  it("falls back to Date.now() when no disconnectedAt is provided", () => {
    tracker.handlePresenceChange("disconnected");

    expect(tracker.opponentConnected).toBe(false);
    expect(tracker.disconnectedAtMs).toBeDefined();
    // Should be approximately 30 seconds remaining
    expect(tracker.secondsRemaining).toBe(30);
  });

  it("resets countdown on rapid connect/disconnect cycles", () => {
    const now = new Date().toISOString();
    tracker.handlePresenceChange("disconnected", now);
    tracker.handlePresenceChange("connected");
    tracker.handlePresenceChange("disconnected", now);
    tracker.handlePresenceChange("connected");

    expect(tracker.opponentConnected).toBe(true);
    expect(tracker.secondsRemaining).toBe(30);
    expect(tracker.canDrop).toBe(false);
  });
});

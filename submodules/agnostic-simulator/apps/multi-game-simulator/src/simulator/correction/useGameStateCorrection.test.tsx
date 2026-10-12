// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGameStateCorrection } from "./useGameStateCorrection";

const gateway = vi.hoisted(() => ({
  listeners: new Map<string, Set<(payload: unknown) => void>>(),
  emit: vi.fn(),
  release: vi.fn(),
  wouldHoldEmit: vi.fn(() => false),
}));
vi.mock("../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => ({
    ...gateway,
    on(event: string, listener: (payload: unknown) => void) {
      const set = gateway.listeners.get(event) ?? new Set();
      set.add(listener);
      gateway.listeners.set(event, set);
      return () => set.delete(listener);
    },
  }),
}));
function receive(event: string, payload: unknown) {
  act(() => gateway.listeners.get(event)?.forEach((listener) => listener(payload)));
}
function mount(viewerId = "alice", connected = true) {
  const onError = vi.fn();
  return {
    ...renderHook(() =>
      useGameStateCorrection({
        gameSlug: "alpha-clash",
        gameId: "game-one",
        viewerId,
        stateVersion: 7,
        connected,
        onError,
      }),
    ),
    onError,
  };
}
beforeEach(() => {
  vi.clearAllMocks();
  gateway.listeners.clear();
  gateway.wouldHoldEmit.mockReturnValue(false);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("server-approved correction session", () => {
  it("waits for server acceptance and sends edits with the current version", () => {
    const { result } = mount();
    act(() => {
      result.current.request();
    });
    expect(gateway.emit).toHaveBeenCalledWith("proposal_send", {
      gameId: "game-one",
      actionType: "enable_manual_mode",
    });
    expect(result.current.enabled).toBe(false);
    expect(result.current.execute("manualSetHealth", { amount: 28 })).toBe(false);
    receive("proposal_resolved", {
      gameId: "game-one",
      actionType: "enable_manual_mode",
      resolution: "accepted",
    });
    expect(result.current.enabled).toBe(true);
    act(() => {
      result.current.execute("manualSetHealth", { targetPlayerId: "player-one", amount: 28 });
    });
    expect(gateway.emit).toHaveBeenLastCalledWith(
      "execute_move",
      expect.objectContaining({
        gameId: "game-one",
        expectedVersion: 7,
        moveType: "manualSetHealth",
        payload: { targetPlayerId: "player-one", amount: 28 },
        correlationId: expect.any(String),
      }),
    );
    act(() => {
      result.current.exit();
    });
    expect(result.current.enabled).toBe(true);
    receive("proposal_resolved", {
      gameId: "game-one",
      actionType: "disable_manual_mode",
      resolution: "accepted",
    });
    expect(result.current.enabled).toBe(false);
  });

  it("lets the receiving player accept or decline the opponent's request", () => {
    const { result } = mount("bob");
    receive("proposal_received", {
      gameId: "game-one",
      matchId: "match-one",
      actionType: "enable_manual_mode",
      senderPlayerId: "alice",
      deadline: Date.now() + 30_000,
    });
    expect(result.current.proposal?.senderPlayerId).toBe("alice");
    act(() => {
      result.current.decline();
    });
    expect(gateway.emit).toHaveBeenLastCalledWith("proposal_decline", {
      gameId: "game-one",
      actionType: "enable_manual_mode",
    });
    receive("proposal_resolved", {
      gameId: "game-one",
      actionType: "enable_manual_mode",
      resolution: "declined",
    });
    expect(result.current.proposal).toBeNull();
    expect(result.current.enabled).toBe(false);
    act(() => {
      result.current.accept();
    });
    expect(gateway.emit).toHaveBeenLastCalledWith("proposal_accept", {
      gameId: "game-one",
      actionType: "enable_manual_mode",
    });
  });

  it("restores mode and a pending request from the authoritative rejoin message", () => {
    const { result } = mount();
    receive("game_joined", { gameId: "game-one", manualModeEnabled: true });
    expect(result.current.enabled).toBe(true);
    receive("game_joined", {
      gameId: "game-one",
      pendingProposal: {
        actionType: "enable_manual_mode",
        senderPlayerId: "bob",
        deadline: Date.now() + 30_000,
      },
    });
    expect(result.current.enabled).toBe(false);
    expect(result.current.proposal?.senderPlayerId).toBe("bob");
    receive("proposal_resolved", {
      gameId: "another-game",
      actionType: "enable_manual_mode",
      resolution: "accepted",
    });
    expect(result.current.enabled).toBe(false);
  });

  it("expires an unanswered request without enabling mode", () => {
    vi.useFakeTimers();
    const { result } = mount();
    receive("proposal_received", {
      gameId: "game-one",
      actionType: "enable_manual_mode",
      senderPlayerId: "bob",
      deadline: Date.now() + 1000,
    });
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.proposal).toBeNull();
    expect(result.current.enabled).toBe(false);
  });

  it("reports rejected proposals and refuses edits while disconnected", () => {
    const { result, onError } = mount("alice", false);
    receive("proposal_accept:response", { status: "err", data: { message: "Request expired" } });
    expect(onError).toHaveBeenCalledWith("Request expired");
    receive("game_joined", { gameId: "game-one", manualModeEnabled: true });
    expect(result.current.execute("manualSetPortal", { open: true })).toBe(false);
    expect(result.current.request()).toBe(false);
    expect(gateway.emit).not.toHaveBeenCalled();
  });

  it("does not queue corrections or proposals while the gateway holds commands", () => {
    const { result } = mount();
    receive("game_joined", { gameId: "game-one", manualModeEnabled: true });
    gateway.wouldHoldEmit.mockReturnValue(true);
    expect(result.current.execute("manualSetPortal", { open: true })).toBe(false);
    expect(result.current.exit()).toBe(false);
    expect(gateway.emit).not.toHaveBeenCalled();
  });
});

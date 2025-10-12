import { describe, expect, it } from "bun:test";
import { createPlayerId } from "../types";
import type { InternalState } from "../types/state";
import { createGameOperations } from "./operations-impl";

// Helper to create PlayerId for tests
const playerId = createPlayerId;

describe("GameOperations", () => {
  const createTestState = (): InternalState => ({
    zones: {},
    cards: {},
    cardMetas: {},
    otp: undefined,
    pendingMulligan: undefined,
  });

  describe("OTP Operations", () => {
    it("should set OTP player", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      ops.setOTP(playerId("player-1"));

      expect(state.otp).toBe(playerId("player-1"));
    });

    it("should get OTP player", () => {
      const state = createTestState();
      state.otp = playerId("player-2");
      const ops = createGameOperations(state);

      const otp = ops.getOTP();

      expect(otp).toBe(playerId("player-2"));
    });

    it("should return undefined when OTP not set", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      const otp = ops.getOTP();

      expect(otp).toBeUndefined();
    });

    it("should overwrite existing OTP", () => {
      const state = createTestState();
      state.otp = playerId("player-1");
      const ops = createGameOperations(state);

      ops.setOTP(playerId("player-2"));

      expect(state.otp).toBe(playerId("player-2"));
    });
  });

  describe("Pending Mulligan Operations", () => {
    it("should set pending mulligan list", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      ops.setPendingMulligan([playerId("player-1"), playerId("player-2")]);

      expect(state.pendingMulligan).toEqual([
        playerId("player-1"),
        playerId("player-2"),
      ]);
    });

    it("should get pending mulligan list", () => {
      const state = createTestState();
      state.pendingMulligan = [playerId("player-1"), playerId("player-2")];
      const ops = createGameOperations(state);

      const pending = ops.getPendingMulligan();

      expect(pending).toEqual([playerId("player-1"), playerId("player-2")]);
    });

    it("should return copy of pending mulligan list to prevent mutation", () => {
      const state = createTestState();
      state.pendingMulligan = [playerId("player-1")];
      const ops = createGameOperations(state);

      const pending = ops.getPendingMulligan();
      pending.push(playerId("player-2"));

      expect(state.pendingMulligan).toEqual([playerId("player-1")]);
    });

    it("should return empty array when pending mulligan not set", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      const pending = ops.getPendingMulligan();

      expect(pending).toEqual([]);
    });

    it("should add player to pending mulligan list", () => {
      const state = createTestState();
      state.pendingMulligan = [playerId("player-1")];
      const ops = createGameOperations(state);

      ops.addPendingMulligan(playerId("player-2"));

      expect(state.pendingMulligan).toEqual([
        playerId("player-1"),
        playerId("player-2"),
      ]);
    });

    it("should not add duplicate player to pending mulligan list", () => {
      const state = createTestState();
      state.pendingMulligan = [playerId("player-1")];
      const ops = createGameOperations(state);

      ops.addPendingMulligan(playerId("player-1"));

      expect(state.pendingMulligan).toEqual([playerId("player-1")]);
    });

    it("should initialize list when adding to undefined pending mulligan", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      ops.addPendingMulligan(playerId("player-1"));

      expect(state.pendingMulligan).toEqual([playerId("player-1")]);
    });

    it("should remove player from pending mulligan list", () => {
      const state = createTestState();
      state.pendingMulligan = [
        playerId("player-1"),
        playerId("player-2"),
        playerId("player-3"),
      ];
      const ops = createGameOperations(state);

      ops.removePendingMulligan(playerId("player-2"));

      expect(state.pendingMulligan).toEqual([
        playerId("player-1"),
        playerId("player-3"),
      ]);
    });

    it("should handle removing player not in list", () => {
      const state = createTestState();
      state.pendingMulligan = [playerId("player-1")];
      const ops = createGameOperations(state);

      ops.removePendingMulligan(playerId("player-2"));

      expect(state.pendingMulligan).toEqual([playerId("player-1")]);
    });

    it("should handle removing from empty list", () => {
      const state = createTestState();
      state.pendingMulligan = [];
      const ops = createGameOperations(state);

      ops.removePendingMulligan(playerId("player-1"));

      expect(state.pendingMulligan).toEqual([]);
    });

    it("should handle removing from undefined list", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      ops.removePendingMulligan(playerId("player-1"));

      expect(state.pendingMulligan).toBeUndefined();
    });

    it("should replace entire list with setPendingMulligan", () => {
      const state = createTestState();
      state.pendingMulligan = [playerId("player-1"), playerId("player-2")];
      const ops = createGameOperations(state);

      ops.setPendingMulligan([playerId("player-3"), playerId("player-4")]);

      expect(state.pendingMulligan).toEqual([
        playerId("player-3"),
        playerId("player-4"),
      ]);
    });
  });

  describe("Choosing First Player Operations", () => {
    it("should set choosing first player", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      ops.setChoosingFirstPlayer(playerId("player-1"));

      expect(state.choosingFirstPlayer).toBe(playerId("player-1"));
    });

    it("should get choosing first player", () => {
      const state = createTestState();
      state.choosingFirstPlayer = playerId("player-2");
      const ops = createGameOperations(state);

      const chooser = ops.getChoosingFirstPlayer();

      expect(chooser).toBe(playerId("player-2"));
    });

    it("should return undefined when choosing first player not set", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      const chooser = ops.getChoosingFirstPlayer();

      expect(chooser).toBeUndefined();
    });

    it("should overwrite existing choosing first player", () => {
      const state = createTestState();
      state.choosingFirstPlayer = playerId("player-1");
      const ops = createGameOperations(state);

      ops.setChoosingFirstPlayer(playerId("player-2"));

      expect(state.choosingFirstPlayer).toBe(playerId("player-2"));
    });
  });

  describe("Integration", () => {
    it("should handle typical game setup flow", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      // Choose first player
      ops.setOTP(playerId("player-1"));

      // Set all players pending mulligan
      ops.setPendingMulligan([playerId("player-1"), playerId("player-2")]);

      // Verify state
      expect(ops.getOTP()).toBe(playerId("player-1"));
      expect(ops.getPendingMulligan()).toEqual([
        playerId("player-1"),
        playerId("player-2"),
      ]);

      // Player 1 decides to keep
      ops.removePendingMulligan(playerId("player-1"));
      expect(ops.getPendingMulligan()).toEqual([playerId("player-2")]);

      // Player 2 decides to keep
      ops.removePendingMulligan(playerId("player-2"));
      expect(ops.getPendingMulligan()).toEqual([]);
    });

    it("should handle complete first player selection flow", () => {
      const state = createTestState();
      const ops = createGameOperations(state);

      // 1. Randomly pick who gets to choose (simulated)
      ops.setChoosingFirstPlayer(playerId("player-1"));
      expect(ops.getChoosingFirstPlayer()).toBe(playerId("player-1"));

      // 2. That player chooses who goes first
      ops.setOTP(playerId("player-2"));
      expect(ops.getOTP()).toBe(playerId("player-2"));

      // 3. All players mulligan
      ops.setPendingMulligan([playerId("player-1"), playerId("player-2")]);
      expect(ops.getPendingMulligan()).toEqual([
        playerId("player-1"),
        playerId("player-2"),
      ]);
    });
  });
});

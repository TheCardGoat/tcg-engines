/**
 * Protocol Types Tests
 *
 * Phase 5: Network Protocol
 */

import { describe, it, expect } from "bun:test";
import {
  PROTOCOL_VERSION,
  isUpdateActionMessage,
  isSyncRequestMessage,
  isUpdatePatchMessage,
  isUpdateFullMessage,
  isSyncFullMessage,
  isUndoRequestMessage,
  isErrorMessage,
  validateProtocolMessage,
} from "./protocol-types";

describe("Protocol Types", () => {
  describe("Protocol Version", () => {
    it("should have correct protocol version", () => {
      expect(PROTOCOL_VERSION).toBe(5);
    });
  });

  describe("Message Type Guards", () => {
    it("should identify UPDATE_ACTION message", () => {
      const msg = {
        type: "UPDATE_ACTION",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        prevStateID: 0,
        command: { commandID: "cmd-1", move: "test", args: {} },
      };

      expect(isUpdateActionMessage(msg)).toBe(true);
      expect(isSyncRequestMessage(msg)).toBe(false);
    });

    it("should identify SYNC_REQUEST message", () => {
      const msg = {
        type: "SYNC_REQUEST",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
      };

      expect(isSyncRequestMessage(msg)).toBe(true);
      expect(isUpdateActionMessage(msg)).toBe(false);
    });

    it("should identify UNDO_REQUEST message", () => {
      const msg = {
        type: "UNDO_REQUEST",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        prevStateID: 1,
      };

      expect(isUndoRequestMessage(msg)).toBe(true);
      expect(isSyncRequestMessage(msg)).toBe(false);
    });

    it("should identify UPDATE_PATCH message", () => {
      const msg = {
        type: "UPDATE_PATCH",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        prevStateID: 0,
        stateID: 1,
        patchFormat: "immer",
        patchOps: [],
      };

      expect(isUpdatePatchMessage(msg)).toBe(true);
      expect(isUpdateFullMessage(msg)).toBe(false);
    });

    it("should identify UPDATE_FULL message", () => {
      const msg = {
        type: "UPDATE_FULL",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        stateID: 1,
        state: { G: {}, ctx: { status: { turn: 0, gameEnded: false } } },
      };

      expect(isUpdateFullMessage(msg)).toBe(true);
      expect(isUpdatePatchMessage(msg)).toBe(false);
    });

    it("should identify SYNC_FULL message", () => {
      const msg = {
        type: "SYNC_FULL",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        stateID: 1,
        state: { G: {}, ctx: { status: { turn: 0, gameEnded: false } } },
      };

      expect(isSyncFullMessage(msg)).toBe(true);
      expect(isErrorMessage(msg)).toBe(false);
    });

    it("should identify ERROR message", () => {
      const msg = {
        type: "ERROR",
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        code: "STALE_STATE",
        message: "State is stale",
      };

      expect(isErrorMessage(msg)).toBe(true);
      expect(isSyncFullMessage(msg)).toBe(false);
    });

    it("should reject non-object values", () => {
      expect(isUpdateActionMessage(null)).toBe(false);
      expect(isUpdateActionMessage(undefined)).toBe(false);
      expect(isUpdateActionMessage("string")).toBe(false);
      expect(isUpdateActionMessage(123)).toBe(false);
    });
  });

  describe("Message Validation", () => {
    it("should validate correct message", () => {
      const msg = {
        protocolVersion: PROTOCOL_VERSION,
        matchID: "test-match",
        type: "UPDATE_ACTION",
      };

      const result = validateProtocolMessage(msg);
      expect(result.valid).toBe(true);
    });

    it("should reject null message", () => {
      const result = validateProtocolMessage(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("object");
    });

    it("should reject message with wrong protocol version", () => {
      const msg = {
        protocolVersion: 999,
        matchID: "test-match",
      };

      const result = validateProtocolMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("protocol version");
    });

    it("should reject message without matchID", () => {
      const msg = {
        protocolVersion: PROTOCOL_VERSION,
      };

      const result = validateProtocolMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("matchID");
    });

    it("should reject message with invalid matchID type", () => {
      const msg = {
        protocolVersion: PROTOCOL_VERSION,
        matchID: 123,
      };

      const result = validateProtocolMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("matchID");
    });
  });
});

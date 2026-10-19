import { afterEach, describe, expect, it, vi } from "vitest";
import type { InteractionPreviewRequest, InteractionPreviewResult } from "@tcg/protocol";
import type { GatewayConnectionState, GatewayHandle } from "./types.js";
import { requestInteractionPreview } from "./interaction-preview.js";

function fixture() {
  const listeners = new Set<(event: string, payload: unknown) => void>();
  const disconnected = new Set<(reason: unknown) => void>();
  const emitted: { event: string; payload: unknown }[] = [];
  const state: GatewayConnectionState = {
    status: "connected",
    authenticated: true,
    authMethod: "ticket",
    connectionId: "s1",
    latencyMs: null,
    reconnectAttempt: 0,
    error: null,
    authStatus: "ok",
    authFailureReason: null,
  };
  const handle: Pick<
    GatewayHandle,
    "onAny" | "onDisconnected" | "emit" | "getState" | "wouldHoldEmit"
  > = {
    onAny: (callback) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    onDisconnected: (callback) => {
      disconnected.add(callback);
      return () => {
        disconnected.delete(callback);
      };
    },
    emit: (event, payload) => {
      emitted.push({ event, payload });
    },
    getState: () => state,
    wouldHoldEmit: () => false,
  };
  const request: InteractionPreviewRequest = {
    protocolVersion: 2,
    stateVersion: 7,
    actionId: "decision-1",
    values: { "variable:X": 32 },
  };
  const result: InteractionPreviewResult = {
    status: "incomplete",
    stateVersion: 7,
    action: {
      id: "decision-1",
      requestId: "request-7",
      intent: "choose-option",
      text: { key: "Choose modes" },
      enabled: true,
      inputs: [],
    },
    values: { "variable:X": 32 },
    ignoredInputIds: [],
  };
  const respond = (
    data: {
      event?: string;
      index?: number;
      gameId?: string;
      result?: unknown;
      correlationId?: string;
    } = {},
  ) => {
    const message = emitted[data.index ?? 0]?.payload;
    if (!message || typeof message !== "object" || !("correlationId" in message))
      throw new Error("Expected preview request");
    for (const listener of listeners)
      listener(data.event ?? "interaction_preview", {
        gameId: data.gameId ?? "g1",
        correlationId: data.correlationId ?? message.correlationId,
        result: data.result ?? result,
        message: "Server rejected preview",
      });
  };
  // Wire replies are strict: the success helper excludes error-only fields.
  const reply = (index = 0, response: unknown = result) => {
    const payload = emitted[index]?.payload;
    if (!payload || typeof payload !== "object" || !("correlationId" in payload))
      throw new Error("Expected request");
    for (const listener of listeners)
      listener("interaction_preview", {
        gameId: "g1",
        correlationId: payload.correlationId,
        result: response,
      });
  };
  return { handle, state, request, result, emitted, listeners, disconnected, respond, reply };
}
afterEach(() => vi.useRealTimers());

describe("requestInteractionPreview", () => {
  it("correlates concurrent drafts and cleans listeners after out-of-order replies", async () => {
    const { handle, request, emitted, listeners, disconnected, reply, result } = fixture();
    const first = requestInteractionPreview(handle, "g1", request);
    const second = requestInteractionPreview(handle, "g1", {
      ...request,
      values: { "variable:X": 33 },
    });
    expect(emitted).toHaveLength(2);
    reply(1, { ...result, values: { "variable:X": 33 } });
    await expect(second).resolves.toMatchObject({ values: { "variable:X": 33 } });
    expect(listeners.size).toBe(1);
    reply(0);
    await expect(first).resolves.toEqual(result);
    expect(listeners.size).toBe(0);
    expect(disconnected.size).toBe(0);
  });
  it("ignores replies for another game or correlation", async () => {
    const { handle, request, listeners, emitted, reply, result } = fixture();
    const pending = requestInteractionPreview(handle, "g1", request);
    const payload = emitted[0]?.payload;
    if (!payload || typeof payload !== "object" || !("correlationId" in payload))
      throw new Error("Expected request");
    for (const listener of listeners) {
      listener("interaction_preview", {
        gameId: "other",
        correlationId: payload.correlationId,
        result,
      });
      listener("interaction_preview", { gameId: "g1", correlationId: "other", result });
    }
    expect(listeners.size).toBe(1);
    reply();
    await expect(pending).resolves.toEqual(result);
  });
  it("cancels an obsolete draft and ignores its late reply", async () => {
    const { handle, request, listeners, reply } = fixture();
    const controller = new AbortController();
    const pending = requestInteractionPreview(handle, "g1", request, { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(listeners.size).toBe(0);
    reply();
  });
  it("rejects malformed or stale successful responses", async () => {
    for (const override of [
      { stateVersion: 8 },
      { action: { id: "other" } },
      { secretNativeState: { hidden: "card" } },
    ]) {
      const { handle, request, reply, result, listeners } = fixture();
      const pending = requestInteractionPreview(handle, "g1", request);
      reply(0, { ...result, ...override });
      await expect(pending).rejects.toThrow();
      expect(listeners.size).toBe(0);
    }
  });
  it("returns a stale-state refusal without treating it as an updated action form", async () => {
    const { handle, request, reply } = fixture();
    const pending = requestInteractionPreview(handle, "g1", request);
    const refusal = { status: "unavailable", stateVersion: 8, message: "Refresh the declaration" };
    reply(0, refusal);
    await expect(pending).resolves.toEqual(refusal);
  });
  it("cleans up on a correlated server error, disconnect, or timeout", async () => {
    vi.useFakeTimers();
    for (const failure of ["error", "disconnect", "timeout"]) {
      const { handle, request, respond, disconnected, listeners } = fixture();
      const pending = requestInteractionPreview(handle, "g1", request, { timeoutMs: 100 });
      const rejected = expect(pending).rejects.toThrow();
      if (failure === "error") respond({ event: "gateway_error" });
      else if (failure === "disconnect") for (const listener of disconnected) listener("lost");
      else await vi.advanceTimersByTimeAsync(100);
      await rejected;
      expect(listeners.size).toBe(0);
      expect(disconnected.size).toBe(0);
    }
  });
  it("does not enqueue previews while disconnected or refreshing credentials", async () => {
    const { handle, state, request, emitted, listeners } = fixture();
    state.status = "disconnected";
    await expect(requestInteractionPreview(handle, "g1", request)).rejects.toThrow("Connect");
    state.status = "connected";
    handle.wouldHoldEmit = () => true;
    await expect(requestInteractionPreview(handle, "g1", request)).rejects.toThrow("Connect");
    expect(emitted).toHaveLength(0);
    expect(listeners.size).toBe(0);
  });
});

import { describe, expect, it } from "vitest";
import { GatewayClientMessage, PreviewInteractionMessage } from "./schemas.js";
import { RawGatewayClientMessageSchema, RawGatewayServerMessageSchema } from "./gateway.js";

describe("hosted interaction preview envelopes", () => {
  const message = {
    type: "preview_interaction",
    gameId: "g1",
    correlationId: "draft-1",
    request: {
      protocolVersion: 2,
      stateVersion: 7,
      actionId: "decision-1",
      values: { "variable:X": 32 },
    },
  };
  it("accepts partial drafts consistently across gateway parsers", () => {
    for (const schema of [
      PreviewInteractionMessage,
      GatewayClientMessage,
      RawGatewayClientMessageSchema,
    ])
      expect(schema.safeParse(message).success).toBe(true);
  });
  it("rejects client actor authority, mutation guards and missing correlation", () => {
    for (const invalid of [
      { ...message, actorId: "other" },
      { ...message, gameProfileId: "other" },
      { ...message, expectedVersion: 7 },
      { ...message, correlationId: "" },
      { ...message, request: { ...message.request, stateVersion: -1 } },
      { ...message, request: { ...message.request, command: { move: "concede" } } },
    ]) {
      expect(GatewayClientMessage.safeParse(invalid).success).toBe(false);
      expect(RawGatewayClientMessageSchema.safeParse(invalid).success).toBe(false);
    }
  });
  it("accepts a correlated refusal and rejects native data in a result", () => {
    const result = { status: "unavailable", stateVersion: 8, message: "Refresh" };
    const response = {
      type: "interaction_preview",
      gameId: "g1",
      correlationId: "draft-1",
      result,
    };
    expect(RawGatewayServerMessageSchema.safeParse(response).success).toBe(true);
    expect(
      RawGatewayServerMessageSchema.safeParse({
        ...response,
        result: { ...result, pendingTriggers: [] },
      }).success,
    ).toBe(false);
  });
});

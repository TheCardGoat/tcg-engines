import { describe, expect, it } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, InteractionSubmission } from "@tcg/protocol";
import { onePieceSubmissionToPayload } from "./interaction-protocol.js";

describe("onePieceSubmissionToPayload", () => {
  it("preserves a single-card cost selection", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 7,
      actionId: "resolvePrompt",
      requestId: "one-piece:7:prompt-1",
      values: { cost: "card-1" },
    });

    expect(onePieceSubmissionToPayload(submission)).toEqual({
      moveType: "resolvePrompt",
      payload: {
        promptId: "prompt-1",
        selectedIds: ["card-1"],
      },
    });
  });

  it("rejects multiple prompt selection fields", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 7,
      actionId: "resolvePrompt",
      requestId: "one-piece:7:prompt-1",
      values: { selection: ["card-1"], cost: ["card-2"] },
    });

    expect(() => onePieceSubmissionToPayload(submission)).toThrow(
      "Only one of selection, cost, or order may be provided",
    );
  });
});

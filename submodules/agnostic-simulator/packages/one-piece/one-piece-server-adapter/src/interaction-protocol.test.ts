import { OnePieceTestEngine } from "@tcg/op-engine";
import { describe, expect, it } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, InteractionSubmission } from "@tcg/protocol";
import {
  buildOnePieceInteractionView,
  onePieceSubmissionToPayload,
} from "./interaction-protocol.js";

describe("onePieceSubmissionToPayload", () => {
  it("projects a numeric loop declaration and maps its submission", () => {
    const engine = OnePieceTestEngine.create({}, {});
    const view = engine.getView("south");
    view.decisions = [
      {
        id: "loop-1",
        gameId: "one-piece",
        priority: "active",
        actorId: "south",
        kind: "chooseNumber",
        title: "Declare loop repetitions",
        source: undefined,
        steps: [
          {
            id: "loop-1:iterations",
            kind: "chooseNumber",
            label: "Repetitions",
            min: 0,
            max: Number.MAX_SAFE_INTEGER,
            integer: true,
            field: "iterations",
          },
        ],
        submit: {
          commandType: "resolvePrompt",
          payloadSchemaVersion: 1,
          promptId: "loop-1",
          requiredStepIds: ["loop-1:iterations"],
        },
        canCancel: false,
      },
    ];
    const interaction = buildOnePieceInteractionView({
      actorId: "player-south",
      seat: "south",
      stateVersion: 7,
      playerView: view,
    });
    expect(interaction.actions[0]?.inputs).toEqual([
      {
        kind: "number",
        id: "iterations",
        text: { key: "Repetitions" },
        required: true,
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
      },
    ]);
    const submission = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 7,
      actionId: "resolvePrompt",
      requestId: "one-piece:7:loop-1",
      values: { iterations: 12 },
    });
    expect(onePieceSubmissionToPayload(submission)).toEqual({
      moveType: "resolvePrompt",
      payload: { promptId: "loop-1", iterations: 12 },
    });
    expect(JSON.stringify(interaction)).not.toContain("fingerprint");
  });

  it.each([-1, 0.5, Number.MAX_SAFE_INTEGER + 1])("rejects invalid loop count %s", (iterations) => {
    const submission = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 7,
      actionId: "resolvePrompt",
      requestId: "one-piece:7:loop-1",
      values: { iterations },
    });
    expect(() => onePieceSubmissionToPayload(submission)).toThrow(
      "Loop iterations must be a nonnegative safe integer",
    );
  });

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
      "Only one of selection, cost, order, or iterations may be provided",
    );
  });

  it("extracts One Piece setup values from action ids", () => {
    const joKenPo = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 7,
      actionId: "chooseJoKenPo:paper",
      requestId: "one-piece:7:chooseJoKenPo:paper",
      values: {},
    });
    const firstPlayer = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 8,
      actionId: "chooseFirstPlayer:north",
      requestId: "one-piece:8:chooseFirstPlayer:north",
      values: {},
    });

    expect(onePieceSubmissionToPayload(joKenPo)).toEqual({
      moveType: "chooseJoKenPo",
      payload: {
        choice: "paper",
      },
    });
    expect(onePieceSubmissionToPayload(firstPlayer)).toEqual({
      moveType: "chooseFirstPlayer",
      payload: {
        firstPlayer: "north",
      },
    });
  });
});

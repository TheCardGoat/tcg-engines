import { describe, expect, it } from "vitest";
import { decodeFabCommand } from "./moves.ts";

describe("FAB command decoder", () => {
  it.each([
    ["begin-play", { instanceId: "card-1" }],
    ["activate", { instanceId: "card-1" }],
    ["defend", { instanceIds: ["card-1"] }],
    [
      "answer-decision",
      { decisionId: "decision-1", stateVersion: 2, answer: { kind: "boolean", value: true } },
    ],
    ["pass", {}],
    ["end-turn", {}],
    ["concede", {}],
    ["arm-priority-hold", {}],
    ["set-automation-preferences", { priorityMode: "play-and-skip" }],
    [
      "set-optional-trigger-automation",
      {
        instanceId: "equipment-1",
        mode: "auto-accept",
        decision: { decisionId: "decision-4", stateVersion: 12 },
      },
    ],
  ] as const)("decodes the %s command variant", (move, payload) => {
    expect(decodeFabCommand(move, payload)).toMatchObject({ move });
  });

  it("accepts canonical fields and rejects legacy aliases or unknown keys", () => {
    expect(decodeFabCommand("begin-play", { instanceId: "card-1", from: "arsenal" })).toMatchObject(
      {
        move: "begin-play",
        instanceId: "card-1",
        from: "arsenal",
      },
    );
    expect(decodeFabCommand("begin-play", { cardId: "card-1" })).toBeNull();
    expect(decodeFabCommand("begin-play", { instanceId: "card-1", zone: "arsenal" })).toBeNull();
    expect(decodeFabCommand("defend", { instanceIds: ["card-1"], extra: true })).toBeNull();
    expect(decodeFabCommand("begin-play", { instanceId: "" })).toBeNull();
    expect(decodeFabCommand("begin-play", { instanceId: 1 })).toBeNull();
    expect(decodeFabCommand("begin-play", { instanceId: "card-1", from: "sideboard" })).toBeNull();
    expect(decodeFabCommand("activate", { instanceId: "card-1", cardId: "card-1" })).toBeNull();
    expect(decodeFabCommand("end-turn", { chooseArsenal: true })).toEqual({
      move: "end-turn",
      chooseArsenal: true,
    });
    expect(
      decodeFabCommand("end-turn", {
        chooseArsenal: true,
        arsenalInstanceId: "card-1",
      }),
    ).toBeNull();
    expect(decodeFabCommand("end-turn", { chooseArsenal: false })).toBeNull();
    expect(decodeFabCommand("defend", { instanceIds: [] })).toEqual({
      move: "defend",
      instanceIds: [],
    });
    expect(
      decodeFabCommand("answer-decision", {
        decisionId: "decision-1",
        stateVersion: "1",
        answer: null,
      }),
    ).toBeNull();
    expect(
      decodeFabCommand("answer-decision", {
        decisionId: "decision-1",
        stateVersion: 1,
        answer: { kind: "boolean", value: true },
        followUpAnswers: [{ kind: "numeric", value: 2 }],
      }),
    ).toEqual({
      move: "answer-decision",
      decisionId: "decision-1",
      stateVersion: 1,
      answer: { kind: "boolean", value: true },
      followUpAnswers: [{ kind: "numeric", value: 2 }],
    });
    expect(
      decodeFabCommand("answer-decision", {
        decisionId: "decision-1",
        stateVersion: 1,
        answer: { kind: "boolean", value: true },
        followUpAnswers: "not-an-array",
      }),
    ).toBeNull();
  });

  it("decodes every automation-preference patch shape and rejects unknown literals or extra keys", () => {
    for (const priorityMode of ["auto-pass", "always-hold", "play-and-skip"] as const) {
      expect(decodeFabCommand("set-automation-preferences", { priorityMode })).toEqual({
        move: "set-automation-preferences",
        preferences: { priorityMode },
      });
    }
    expect(decodeFabCommand("set-automation-preferences", { autoOrderTriggers: true })).toEqual({
      move: "set-automation-preferences",
      preferences: { autoOrderTriggers: true },
    });
    expect(
      decodeFabCommand("set-automation-preferences", { autoSelectSingletonTargets: true }),
    ).toEqual({
      move: "set-automation-preferences",
      preferences: { autoSelectSingletonTargets: true },
    });
    expect(
      decodeFabCommand("set-automation-preferences", {
        addPlayAndSkipHoldCardId: "WTR150",
      }),
    ).toEqual({
      move: "set-automation-preferences",
      preferences: { addPlayAndSkipHoldCardId: "WTR150" },
    });
    expect(
      decodeFabCommand("set-automation-preferences", {
        addInstantYieldCardId: "AZS021",
      }),
    ).toEqual({
      move: "set-automation-preferences",
      preferences: { addInstantYieldCardId: "AZS021" },
    });
    expect(decodeFabCommand("set-automation-preferences", {})).toBeNull();
    expect(
      decodeFabCommand("set-automation-preferences", { priorityMode: "sometimes-pass" }),
    ).toBeNull();
    expect(
      decodeFabCommand("set-automation-preferences", { priorityMode: "auto-pass", extra: 1 }),
    ).toBeNull();
    expect(decodeFabCommand("arm-priority-hold", { extra: 1 })).toBeNull();
  });
});

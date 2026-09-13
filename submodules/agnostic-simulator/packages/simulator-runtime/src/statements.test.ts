import type { SimulatorStatementAction, SimulatorStatementsState } from "@tcg/simulator-contract";
import { describe, expect, test } from "vitest";

import { appendSimulatorActivity, reduceSimulatorStatements } from "./statements";

const base = { actorId: "p1", actionId: "a1", at: 10 } as const;

function emptyState(): SimulatorStatementsState {
  return { statements: [], activity: [] };
}

function reduce(state: SimulatorStatementsState, action: SimulatorStatementAction) {
  return reduceSimulatorStatements(state, action);
}

describe("simulator statements", () => {
  test("publishes, replies, acknowledges, spotlights, and withdraws", () => {
    let state = reduce(emptyState(), {
      ...base,
      type: "publish_statement",
      statementId: "s1",
      text: "  Attack declared  ",
    });
    state = reduce(state, {
      ...base,
      actorId: "p2",
      actionId: "a2",
      type: "publish_statement",
      statementId: "s2",
      text: "Resolved",
      replyToId: "s1",
    });
    state = reduce(state, {
      ...base,
      actorId: "p2",
      actionId: "a3",
      type: "acknowledge_statement",
      statementId: "s1",
    });
    state = reduce(state, {
      ...base,
      actorId: "p2",
      actionId: "a4",
      type: "acknowledge_statement",
      statementId: "s1",
    });
    state = reduce(state, {
      ...base,
      actionId: "a5",
      type: "spotlight_statement",
      statementId: "s1",
    });
    state = reduce(state, {
      ...base,
      actionId: "a6",
      type: "withdraw_statement",
      statementId: "s1",
    });

    expect(state.statements[0]).toMatchObject({
      text: "Attack declared",
      withdrawnAt: 10,
      acknowledgements: ["p2"],
    });
    expect(state.statements[1]?.replyToId).toBe("s1");
    expect(state.spotlightStatementId).toBeUndefined();
    expect(state.activity.map((entry) => entry.summary)).toEqual([
      "published a statement",
      "replied to a statement",
      "acknowledged a statement",
      "acknowledged a statement",
      "spotlighted a statement",
      "withdrew a statement",
    ]);
  });

  test("validates references and author-only withdrawal", () => {
    expect(() =>
      reduce(emptyState(), {
        ...base,
        type: "publish_statement",
        statementId: "reply",
        text: "Reply",
        replyToId: "missing",
      }),
    ).toThrow("Unknown statement");

    const state = reduce(emptyState(), {
      ...base,
      type: "publish_statement",
      statementId: "s1",
      text: "Intent",
    });
    expect(() =>
      reduce(state, {
        ...base,
        actorId: "p2",
        actionId: "a2",
        type: "withdraw_statement",
        statementId: "s1",
      }),
    ).toThrow("Only the author");
  });

  test("caps statement text at 500 characters and rejects duplicate ids", () => {
    const state = reduce(emptyState(), {
      ...base,
      type: "publish_statement",
      statementId: "s1",
      text: `  ${"x".repeat(520)}  `,
    });
    expect(state.statements[0]?.text).toHaveLength(500);
    expect(() =>
      reduce(state, {
        ...base,
        actionId: "a2",
        type: "publish_statement",
        statementId: "s1",
        text: "duplicate",
      }),
    ).toThrow("already exists");
  });

  test("bounds activity while preserving the newest entries", () => {
    let state = emptyState();
    for (let index = 0; index < 205; index += 1) {
      state = appendSimulatorActivity(state, {
        id: `a${index}`,
        actorId: "p1",
        at: index,
        summary: `action ${index}`,
      });
    }
    expect(state.activity).toHaveLength(200);
    expect(state.activity[0]?.id).toBe("a5");
    expect(state.activity.at(-1)?.id).toBe("a204");
  });
});

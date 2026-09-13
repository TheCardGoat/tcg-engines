import { describe, expect, it } from "vitest";
import {
  createRiftboundClientMatchStateV1,
  parseRiftboundClientSnapshotV1,
  reduceRiftboundClientMatchStateV1,
} from "./state";

const base = { actorId: "p1", at: 10, actionId: "a1" } as const;

function fixture() {
  return createRiftboundClientMatchStateV1(
    ["p1", "p2"],
    {
      cardInstances: { c1: "unknown-1", c2: "unknown-2" },
      owners: { p1: ["c1", "c2"], p2: [] },
    },
    {
      "unknown-1": { name: "Legend", cardType: "Legend", domains: [] },
      "unknown-2": { name: "Unit", cardType: "Unit", domains: [] },
    },
  );
}

describe("RiftboundClientMatchStateV1 reducer", () => {
  it("parses persisted JSON snapshot envelopes without losing bootstrap card maps", () => {
    const state = fixture();
    const cardsMaps = {
      cardInstances: { c1: "unknown-1" },
      owners: { p1: ["c1"], p2: [] },
    };

    expect(parseRiftboundClientSnapshotV1(JSON.stringify({ state, cardsMaps }))).toEqual({
      state,
      cardsMaps,
    });
    expect(parseRiftboundClientSnapshotV1(JSON.stringify(state))).toEqual({ state });
    expect(parseRiftboundClientSnapshotV1("not-json")).toBeNull();
  });

  it("uses the runtime catalog to classify initial zones", () => {
    const state = fixture();
    expect(state.cards.c1?.zone).toBe("legend");
    expect(state.cards.c2?.zone).toBe("deck");
  });

  it("moves, flips, rotates, stacks, counts, draws and shuffles cards", () => {
    let state = fixture();
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      type: "shuffle",
      ownerId: "p1",
      zone: "deck",
      order: ["c2"],
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a2",
      type: "draw",
      ownerId: "p1",
      count: 1,
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a3",
      type: "move_card",
      cardId: "c1",
      zone: "play",
      x: 12,
      y: 24,
      stackId: "s1",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a4",
      type: "set_face",
      cardId: "c1",
      face: "down",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a5",
      type: "rotate",
      cardId: "c1",
      rotation: 90,
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a6",
      type: "set_counter",
      cardId: "c1",
      counter: "might",
      value: 3,
    });
    expect(state.cards.c1).toMatchObject({
      zone: "play",
      face: "down",
      rotation: 90,
      position: { x: 12, y: 24 },
      stackId: "s1",
      counters: { might: 3 },
    });
  });

  it("rejects attempts to change the opponent's cards or zones", () => {
    const state = fixture();

    expect(() =>
      reduceRiftboundClientMatchStateV1(state, {
        ...base,
        actorId: "p2",
        type: "move_card",
        cardId: "c1",
        zone: "play",
      }),
    ).toThrow("Players can only change their own cards and zones");
    expect(() =>
      reduceRiftboundClientMatchStateV1(state, {
        ...base,
        actorId: "p2",
        type: "draw",
        ownerId: "p1",
        count: 1,
      }),
    ).toThrow("Players can only change their own cards and zones");
  });

  it("supports replies, acknowledgements, spotlight, withdrawal and terminal state", () => {
    let state = fixture();
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      type: "publish_statement",
      statementId: "s1",
      text: "Attack declared",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actorId: "p2",
      actionId: "a2",
      type: "publish_statement",
      statementId: "s2",
      text: "Resolved",
      replyToId: "s1",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actorId: "p2",
      actionId: "a3",
      type: "acknowledge_statement",
      statementId: "s1",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a4",
      type: "spotlight_statement",
      statementId: "s1",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a5",
      type: "withdraw_statement",
      statementId: "s1",
    });
    state = reduceRiftboundClientMatchStateV1(state, {
      ...base,
      actionId: "a6",
      type: "end_game",
      winnerId: "p1",
      reason: "conceded",
    });
    expect(state.statements[0]).toMatchObject({ withdrawnAt: 10, acknowledgements: ["p2"] });
    expect(state.statements[1]?.replyToId).toBe("s1");
    expect(state.spotlightStatementId).toBeUndefined();
    expect(state.terminal).toMatchObject({ winnerId: "p1", reason: "conceded" });
  });
});

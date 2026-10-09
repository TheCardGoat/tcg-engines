import { expect, test } from "vite-plus/test";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const rest: Action = {
  action: "rest",
  target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
};
const active: Action = {
  action: "setActive",
  target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
};

test("11-1-1-2: a stable turn-gated optional cycle declares repetitions and stops after restore", () => {
  const card = getCard("EB01-005"),
    original = card.effects;
  try {
    card.effects = {
      effects: [
        { trigger: "activateMain", actions: [active, rest] },
        {
          trigger: "whenBecomesRested",
          optional: true,
          conditions: [{ condition: "turn", value: "your" }],
          actions: [active, rest],
        },
      ],
    };
    let e = OnePieceTestEngine.create({ leaderCardId: "ST01-001", character: [card] });
    const id = e.findCardInZone("south", "character", card);
    e.asSouth().activateMain(id);
    e.asSouth().acceptOptional();
    e.pendingDecision("loopIterations", "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: e.pendingDecision("loopIterations", "south").id,
      iterations: 3,
    });
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").status).toBe("active");
    expect(
      e.getView("south").logs.some((l) => l.message.includes("The loop repeats 3 times.")),
    ).toBe(true);
    e.asSouth().activateMain(id);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").logs.some((l) => l.message.includes("cannot be restarted"))).toBe(
      true,
    );
    card.effects.effects![1]!.conditions = [{ condition: "turn", value: "opponent" }];
    const falseGate = OnePieceTestEngine.create({ leaderCardId: "ST01-001", character: [card] });
    falseGate.asSouth().activateMain(falseGate.findCardInZone("south", "character", card));
    expect(falseGate.getView("south").prompts).toHaveLength(0);
    expect(falseGate.getView("south").status).toBe("active");
  } finally {
    card.effects = original;
  }
});

test("11-1-1-3: two stable turn gates preserve turn-player declarations and minimum stop", () => {
  const south = getCard("EB01-005"),
    north = getCard("EB01-018"),
    savedSouth = south.effects,
    savedNorth = north.effects;
  const opposing: Action = {
    action: "rest",
    target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
  };
  try {
    south.effects = {
      effects: [
        { trigger: "activateMain", actions: [opposing] },
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          optional: true,
          conditions: [{ condition: "turn", value: "your" }],
          actions: [active, opposing],
        },
      ],
    };
    north.effects = {
      effects: [
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          optional: true,
          conditions: [{ condition: "turn", value: "opponent" }],
          actions: [active, opposing],
        },
      ],
    };
    let e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: [south] },
      { leaderCardId: "ST01-001", character: [north] },
    );
    e.asSouth().activateMain(e.findCardInZone("south", "character", south));
    e.asNorth().acceptOptional();
    e.asSouth().acceptOptional();
    e.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: e.pendingDecision("loopIterations", "south").id,
      iterations: 5,
    });
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: e.pendingDecision("loopIterations", "north").id,
      iterations: 2,
    });
    const v = e.getView("south");
    expect(v.prompts).toHaveLength(0);
    expect(v.status).toBe("active");
    expect(v.logs.some((l) => l.message.includes("The loop repeats 2 times."))).toBe(true);
    expect(v.logs.findLast((l) => l.message.endsWith("stops the loop."))?.actor).toBe("north");
  } finally {
    south.effects = savedSouth;
    north.effects = savedNorth;
  }
});

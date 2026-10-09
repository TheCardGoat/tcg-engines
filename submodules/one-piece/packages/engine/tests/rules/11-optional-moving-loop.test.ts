import { expect, test } from "vite-plus/test";
import type { EffectBlock } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { optionalMovingSource } from "../../src/engine/optional-moving-loop.ts";
import { drainResolutionQueue } from "../../src/engine/queue.ts";
import { declareLoopIterations, observeOptionalLoop } from "../../src/engine/optional-loop.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const blocks: EffectBlock[] = [
  {
    trigger: "onPlay",
    actions: [
      {
        action: "ko",
        target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
      },
    ],
  },
  {
    trigger: "onKo",
    optional: true,
    actions: [
      {
        action: "play",
        source: { player: "self", zone: "trash" },
        count: { amount: 1 },
        self: true,
      },
    ],
  },
];

// Synthetic rules fixture; no catalog infinite loop is asserted.
test.each([0, 1, Number.MAX_SAFE_INTEGER])(
  "optional self-movement declares %s repetitions and restores the stopped state",
  (iterations) => {
    const card = getCard("EB01-005"),
      saved = card.effects;
    try {
      card.effects = { effects: blocks };
      let engine = OnePieceTestEngine.create({ hand: [card], activeDon: 3 });
      const source = engine.findCardInZone("south", "hand", card);
      engine.playCard(card, "south");
      engine.asSouth().acceptOptional();
      const decision = engine.pendingDecision("loopIterations", "south");
      const generation = engine.getState().cards[source]!.zoneChangeCounter;
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.exec({ type: "resolvePrompt", seat: "south", promptId: decision.id, iterations });
      expect(engine.getView("south").status).toBe("active");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
        source,
      );
      expect(engine.getState().cards[source]!.zoneChangeCounter).toBe(
        generation + (iterations > 0 ? 2 : 0),
      );
      expect(engine.getState().optionalLoopPlan).toBeUndefined();
      expect(engine.getState().stoppedOptionalLoops?.length).toBeGreaterThan(0);
    } finally {
      card.effects = saved;
    }
  },
);

test("saved moving evidence continues for the north controller", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = { effects: blocks };
    let e = OnePieceTestEngine.create(
      {},
      { hand: [card], activeDon: 3, deck: ["EB01-025", "EB01-025"] },
    );
    e.asSouth().endTurn();
    e.playCard(card, "north");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.asNorth().acceptOptional();
    e.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: e.pendingDecision("loopIterations", "north").id,
      iterations: 2,
    });
    expect(e.getView("north").status).toBe("active");
    expect(e.getView("north").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain(card.id);
  } finally {
    card.effects = saved;
  }
});

test.each(["old-reference", "other-card", "post-cost"])(
  "%s state cannot be certified as a moving optional loop",
  (unsupported) => {
    const card = getCard("EB01-005"),
      saved = card.effects;
    try {
      card.effects = {
        effects:
          unsupported === "post-cost"
            ? blocks.map((b) => ({
                ...b,
                postCostConditions: [{ condition: "turn", value: "your" }],
              }))
            : blocks,
      };
      let e = OnePieceTestEngine.create({ hand: [card], character: ["EB01-025"], activeDon: 3 });
      e.playCard(card, "south");
      if (unsupported !== "post-cost") {
        const state = JSON.parse(JSON.stringify(e.getState()));
        const source = e.findCardInZone("south", "trash", card);
        // Deliberately unsupported saved-reference fixtures. No mutation occurs
        // inside an executing command; restoration exercises the proof boundary.
        state.delayedEffectActions = [
          {
            sourceInstanceId:
              unsupported === "old-reference"
                ? source
                : e.findCardInZone("south", "character", "EB01-025"),
            controller: "south",
            sourceZoneChangeCounter: 0,
            action: { action: "draw", player: "self", amount: 1 },
            scheduledTurn: 99,
          },
        ];
        e = OnePieceTestEngine.fromState(state);
      }
      for (let n = 0; n < 3; n++) {
        e.asSouth().acceptOptional();
        expect(e.pendingDecision("effectOptional", "south")).toBeDefined();
      }
      e.asSouth().declineOptional();
      expect(e.getView("south").status).toBe("active");
      expect(e.getState().stoppedOptionalLoops).toBeUndefined();
    } finally {
      card.effects = saved;
    }
  },
);

test("an additional finite draw action is resolved each time, never shortcut", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = {
      effects: [
        {
          ...blocks[0]!,
          actions: [{ action: "draw", player: "self", amount: 1 }, ...blocks[0]!.actions],
        },
        blocks[1]!,
      ],
    };
    const e = OnePieceTestEngine.create({
      hand: [card],
      activeDon: 3,
      deck: ["EB01-025", "EB01-018", "EB01-025"],
    });
    e.playCard(card, "south");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.pendingDecision("effectOptional", "south")).toBeDefined();
    e.asSouth().acceptOptional();
    expect(e.getView("south").finishReason).toBe("emptyDeck");
    expect(e.getState().stoppedOptionalLoops).toBeUndefined();
  } finally {
    card.effects = saved;
  }
});

test("stopped moving evidence rejects the same cards in the same areas despite a new generation", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = { effects: blocks };
    const e = OnePieceTestEngine.create({ hand: [card], activeDon: 3 });
    const source = e.findCardInZone("south", "hand", card);
    e.playCard(card, "south");
    e.asSouth().acceptOptional();
    const before = JSON.parse(JSON.stringify(e.getState()));
    e.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: e.pendingDecision("loopIterations", "south").id,
      iterations: 0,
    });
    // Policy probe of a repeated boundary: no ordinary command can reactivate
    // this bare On K.O. while its source stays in trash. Preserve exact queue
    // topology and all card state; only the irrelevant generation advances.
    before.stoppedOptionalLoops = e.getState().stoppedOptionalLoops;
    before.optionalLoopPlan = undefined;
    before.optionalLoopEvidence = undefined;
    before.promptQueue = [];
    before.cards[source].zoneChangeCounter += 2;
    const boundary = before.resolutionQueue.shift();
    boundary.sourceZoneChangeCounter = before.cards[source].zoneChangeCounter;
    expect(observeOptionalLoop(before, boundary)).toBe("skip");
    before.players.south.activeDon += 1;
    expect(observeOptionalLoop(before, boundary)).toBe("continue");
  } finally {
    card.effects = saved;
  }
});

test("queued references to another card or an old source object prevent certification", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = { effects: blocks };
    const e = OnePieceTestEngine.create({ hand: [card], character: ["EB01-025"], activeDon: 3 });
    e.playCard(card, "south");
    const state = structuredClone(e.getState());
    const source = e.findCardInZone("south", "trash", card);
    const boundary = {
      id: "proof-boundary",
      kind: "effectBlock",
      sourceInstanceId: source,
      controller: "south",
      trigger: "onKo",
      blockIndex: 0,
      sourceZoneChangeCounter: state.cards[source]!.zoneChangeCounter,
    } as const;
    state.promptQueue = [];
    state.resolutionQueue = [];
    expect(optionalMovingSource(state, boundary)).toBe(source);
    state.resolutionQueue = [
      { ...boundary, id: "stale", sourceZoneChangeCounter: boundary.sourceZoneChangeCounter - 1 },
    ];
    expect(optionalMovingSource(state, boundary)).toBeUndefined();
    state.resolutionQueue = [
      {
        ...boundary,
        id: "other",
        sourceInstanceId: e.findCardInZone("south", "character", "EB01-025"),
        sourceZoneChangeCounter: 0,
      },
    ];
    expect(optionalMovingSource(state, boundary)).toBeUndefined();
  } finally {
    card.effects = saved;
  }
});

test("an opposing effect starts the non-turn player's moving declaration", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = { effects: blocks };
    const e = OnePieceTestEngine.create(
      { hand: ["ST01-015"], activeDon: 4 },
      { character: [card] },
    );
    const source = e.findCardInZone("north", "character", card);
    e.asSouth().play("ST01-015");
    e.asSouth().chooseTargets(source);
    e.asNorth().acceptOptional();
    // The first K.O. came from the opposing Event. Establish an identical
    // self-K.O. event before comparing complete cycles.
    e.asNorth().acceptOptional();
    e.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: e.pendingDecision("loopIterations", "north").id,
      iterations: 3,
    });
    expect(e.getView("north").activeSeat).toBe("south");
    expect(e.getView("north").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(source);
    expect(e.getView("north").status).toBe("active");
  } finally {
    card.effects = saved;
  }
});

test.each(["start", "return"] as const)(
  "a saved %s representative-cycle plan resumes safely",
  (phase) => {
    const card = getCard("EB01-005"),
      saved = card.effects;
    try {
      card.effects = { effects: blocks };
      const e = OnePieceTestEngine.create({ hand: [card], activeDon: 3 });
      const source = e.findCardInZone("south", "hand", card);
      e.playCard(card, "south");
      e.asSouth().acceptOptional();
      const state = structuredClone(e.getState());
      const generation = state.cards[source]!.zoneChangeCounter;
      // There is no public asynchronous interruption inside this atomic cycle.
      // Capture the exact internal post-handler/pre-drain checkpoint explicitly.
      expect(declareLoopIterations(state, "south", 1000000)).toBe(true);
      state.promptQueue = [];
      if (phase === "return") {
        const boundary = state.resolutionQueue.shift()!;
        if (boundary.kind !== "effectBlock") throw new Error("Expected saved On K.O. boundary");
        expect(observeOptionalLoop(state, boundary)).toBe("continue");
        expect(boundary.confirmed).toBe(true);
        state.resolutionQueue.unshift(boundary);
      }
      expect(state.optionalLoopPlan?.representativeCycle).toBe(phase);
      const restored = structuredClone(
        OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(state))).getState(),
      );
      drainResolutionQueue(restored);
      const result = OnePieceTestEngine.fromState(restored);
      expect(result.getView("south").status).toBe("active");
      expect(result.getView("south").prompts).toHaveLength(0);
      expect(result.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
        source,
      );
      expect(restored.cards[source]!.zoneChangeCounter).toBe(generation + 2);
      expect(restored.optionalLoopPlan).toBeUndefined();
    } finally {
      card.effects = saved;
    }
  },
);

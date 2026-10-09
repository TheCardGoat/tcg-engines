import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic CR1-3-8 instruction; no current printed simultaneous conflict is claimed.
test("simultaneous rest wins for the same DON in the cost area", () => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "simultaneousStateChange",
              groups: [
                {
                  state: "active",
                  target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
                },
                {
                  state: "rested",
                  target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
                },
              ],
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      activeDon: 2,
      restedDon: 1,
    });
    engine.asSouth().activateMain(engine.asSouth().leader());
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(engine.getView("south").players.south.restedDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  } finally {
    leader.effects = saved;
  }
});

function withDonReplacement(actions: import("@tcg/op-types").Action[], run: () => void) {
  const source = getCard("ST01-007"),
    replacement = getCard("PRB02-006"),
    savedSource = source.effects,
    savedReplacement = replacement.effects;
  try {
    source.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "simultaneousStateChange",
              groups: [
                {
                  state: "rested",
                  target: {
                    player: "opponent",
                    zones: ["costArea"],
                    count: { amount: 1, upTo: true },
                  },
                },
                {
                  state: "rested",
                  target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
                },
              ],
            },
          ],
        },
      ],
    };
    replacement.effects = {
      replacementEffects: [
        {
          replacedEvent: "rested",
          source: "opponentCharacterEffect",
          eventFilter: { targetSelf: true },
          replacementAction: { action: "sequence", actions },
        },
      ],
    };
    run();
  } finally {
    source.effects = savedSource;
    replacement.effects = savedReplacement;
  }
}

test.each([0, 1])(
  "returning active DON slot %s preserves the originally chosen token across an equal-count refill",
  (returnedIndex) => {
    withDonReplacement(
      [
        { action: "returnDon", player: "self", amount: 1, donState: "active" },
        { action: "addDon", count: { amount: 1 }, state: "active" },
      ],
      () => {
        let engine = OnePieceTestEngine.create(
          { character: ["ST01-007"] },
          { character: ["PRB02-006"], activeDon: 2 },
        );
        engine.asSouth().activateMain("ST01-007");
        const choice = engine.pendingDecision("effectSimultaneousStateSelection", "south");
        const step = choice.steps[0];
        if (step?.kind !== "selectEntity") throw new Error("Expected target choice");
        const token = step.candidates[0]!.ref.id;
        engine.resolveDecision(
          "effectSimultaneousStateSelection",
          { selectedIds: [token] },
          "south",
        );
        engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "north");
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        engine.resolveDecision(
          "effectReturnDon",
          { selectedIds: [`active-don:${returnedIndex}`] },
          "north",
        );
        expect(engine.getView("south").players.north.restedDon).toBe(returnedIndex === 0 ? 0 : 1);
        expect(engine.getView("south").players.north.activeDon).toBe(returnedIndex === 0 ? 2 : 1);
        expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
        expect(engine.getView("south").prompts).toHaveLength(0);
      },
    );
  },
);

test("nested grouped DON choices keep outer identities alive through JSON and invalid retries", () => {
  withDonReplacement(
    [
      {
        action: "simultaneousStateChange",
        groups: [
          {
            state: "rested",
            target: { player: "self", zones: ["costArea"], count: { amount: 1, upTo: true } },
          },
        ],
      },
      {
        action: "setActive",
        target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
      },
    ],
    () => {
      let engine = OnePieceTestEngine.create(
        { character: ["ST01-007"] },
        { character: ["PRB02-006"], activeDon: 2 },
      );
      engine.asSouth().activateMain("ST01-007");
      const outer = engine.pendingDecision("effectSimultaneousStateSelection", "south");
      const step = outer.steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected target choice");
      const first = step.candidates[0]!.ref.id,
        second = step.candidates[1]!.ref.id;
      engine.resolveDecision("effectSimultaneousStateSelection", { selectedIds: [first] }, "south");
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "north");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      const nested = engine.pendingDecision("effectSimultaneousStateSelection", "north");
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "north",
        promptId: nested.id,
        selectedIds: [first, first],
      });
      engine.resolveDecision(
        "effectSimultaneousStateSelection",
        { selectedIds: [second] },
        "north",
      );
      expect(engine.getView("south").players.north.activeDon).toBe(1);
      expect(engine.getView("south").players.north.restedDon).toBe(1);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});

test.each([0, 1])(
  "giving token %s then returning it does not revive a reference from its prior area",
  (givenIndex) => {
    withDonReplacement(
      [
        {
          action: "giveDon",
          count: { amount: 1 },
          donState: "active",
          target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
        },
        {
          action: "returnToHand",
          target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
        },
        {
          action: "setActive",
          target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
        },
      ],
      () => {
        let engine = OnePieceTestEngine.create(
          { character: ["ST01-007"] },
          { character: ["PRB02-006"], activeDon: 2 },
        );
        engine.asSouth().activateMain("ST01-007");
        const step = engine.pendingDecision("effectSimultaneousStateSelection", "south").steps[0];
        if (step?.kind !== "selectEntity") throw new Error("Expected target choice");
        const tokens = step.candidates.map((candidate) => candidate.ref.id);
        engine.resolveDecision(
          "effectSimultaneousStateSelection",
          { selectedIds: [tokens[0]!] },
          "south",
        );
        engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "north");
        const payment = engine.pendingDecision("effectDonTransferSelection", "north");
        engine.expectFailure({
          type: "resolvePrompt",
          seat: "north",
          promptId: payment.id,
          selectedIds: [tokens[0]!, tokens[0]!],
        });
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        engine.resolveDecision(
          "effectDonTransferSelection",
          { selectedIds: [tokens[givenIndex]!] },
          "north",
        );
        expect(engine.getView("south").players.north.activeDon).toBe(givenIndex === 0 ? 2 : 1);
        expect(engine.getView("south").players.north.restedDon).toBe(givenIndex === 0 ? 0 : 1);
        expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
        expect(engine.getView("north").players.north.hand.map((card) => card.cardId)).toContain(
          "PRB02-006",
        );
        expect(engine.getView("south").prompts).toHaveLength(0);
      },
    );
  },
);

test("an initially rested DON chosen to rest is still a no-op after a replacement readies it", () => {
  withDonReplacement(
    [
      {
        action: "setActive",
        target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
      },
    ],
    () => {
      const engine = OnePieceTestEngine.create(
        { character: ["ST01-007"] },
        { character: ["PRB02-006"], activeDon: 1, restedDon: 1 },
      );
      engine.asSouth().activateMain("ST01-007");
      const step = engine.pendingDecision("effectSimultaneousStateSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected target choice");
      engine.resolveDecision(
        "effectSimultaneousStateSelection",
        { selectedIds: [step.candidates[1]!.ref.id] },
        "south",
      );
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "north");
      expect(engine.getView("south").players.north.activeDon).toBe(2);
      expect(engine.getView("south").players.north.restedDon).toBe(0);
    },
  );
});

test("freeze follows DON through effect ready and rest and expires after its next Refresh", () => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "freeze",
              target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
            },
            {
              action: "setActive",
              target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
            },
            {
              action: "rest",
              target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
            },
          ],
        },
      ],
    };
    let engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", restedDon: 2, deck: ["ST02-002", "ST02-002", "ST02-002"] },
      { deck: ["ST02-002", "ST02-002", "ST02-002"] },
    );
    engine.asSouth().activateMain(engine.asSouth().leader());
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: ["rested-don:south:1"] },
      "south",
    );
    expect(engine.getView("south").players.south.restedDon).toBe(2);
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(1);
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(0);
  } finally {
    leader.effects = saved;
  }
});

test("readying an earlier rested DON preserves the frozen later token and its public label", () => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "freeze",
              target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
            },
            {
              action: "setActive",
              target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", restedDon: 2, deck: ["ST02-002", "ST02-002"] },
      { deck: ["ST02-002", "ST02-002"] },
    );
    engine.asSouth().activateMain(engine.asSouth().leader());
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: ["rested-don:south:1"] },
      "south",
    );
    const step = engine.pendingDecision("effectDonTransferSelection", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected physical DON choice");
    expect(step.candidates[1]?.label).toContain("cannot refresh next turn");
    engine.resolveDecision(
      "effectDonTransferSelection",
      { selectedIds: [step.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.restedDon).toBe(1);
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(1);
  } finally {
    leader.effects = saved;
  }
});

test.each([0, 1])("returning rested slot %s clears only that DON's freeze", (returnedIndex) => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "freeze",
              target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
            },
            { action: "returnDon", player: "self", amount: 1, donState: "rested" },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", restedDon: 2, deck: ["ST02-002", "ST02-002"] },
      { deck: ["ST02-002", "ST02-002"] },
    );
    engine.asSouth().activateMain(engine.asSouth().leader());
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: ["rested-don:south:1"] },
      "south",
    );
    engine.resolveDecision(
      "effectReturnDon",
      { selectedIds: [`rested-don:${returnedIndex}`] },
      "south",
    );
    expect(engine.getView("south").players.south.restedDon).toBe(1);
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(returnedIndex === 0 ? 1 : 0);
  } finally {
    leader.effects = saved;
  }
});

test("a frozen DON loses its restriction when given and later returned by Character removal", () => {
  const source = getCard("ST01-007"),
    saved = source.effects;
  try {
    source.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "freeze",
              target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
            },
            {
              action: "giveDon",
              donState: "rested",
              count: { amount: 1 },
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
            },
            {
              action: "returnToHand",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create(
      { character: ["ST01-007"], restedDon: 2, deck: ["ST02-002", "ST02-002"] },
      { deck: ["ST02-002", "ST02-002"] },
    );
    engine.asSouth().activateMain("ST01-007");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: ["rested-don:south:0"] },
      "south",
    );
    const step = engine.pendingDecision("effectDonTransferSelection", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected physical source choice");
    const frozen = step.candidates.find((candidate) => candidate.label.includes("cannot refresh"));
    expect(frozen).toBeDefined();
    engine.resolveDecision(
      "effectDonTransferSelection",
      { selectedIds: [frozen!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.restedDon).toBe(2);
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(0);
  } finally {
    source.effects = saved;
  }
});

test.each([false, true])(
  "an activation rest-DON cost chooses the %s frozen source without losing its identity",
  (payFrozen) => {
    const leader = getCard("ST01-001"),
      payer = getCard("EB01-005"),
      savedLeader = leader.effects,
      savedPayer = payer.effects;
    try {
      leader.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "freeze",
                target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
              },
              {
                action: "setActive",
                target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
              },
            ],
          },
        ],
      };
      payer.effects = {
        effects: [
          {
            trigger: "activateMain",
            costs: [{ cost: "restDon", amount: 1 }],
            actions: [{ action: "draw", amount: 1, player: "self" }],
          },
        ],
      };
      let engine = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          character: ["EB01-005"],
          restedDon: 2,
          deck: ["ST02-002", "ST02-002", "ST02-002"],
        },
        { deck: ["ST02-002", "ST02-002"] },
      );
      engine.asSouth().activateMain(engine.asSouth().leader());
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: ["rested-don:south:0"] },
        "south",
      );
      engine.asSouth().activateMain("EB01-005");
      const step = engine.pendingDecision("effectCostDonIdentity", "south").steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected activation source choice");
      const selected = step.candidates.find(
        (candidate) => candidate.label.includes("cannot refresh") === payFrozen,
      )!;
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectCostDonIdentity", { selectedIds: [selected.ref.id] }, "south");
      expect(engine.getView("south").players.south.hand).toHaveLength(1);
      expect(engine.getView("south").players.south.restedDon).toBe(1);
      engine.asSouth().endTurn();
      engine.asNorth().endTurn();
      expect(engine.getView("south").players.south.restedDon).toBe(payFrozen ? 1 : 0);
    } finally {
      leader.effects = savedLeader;
      payer.effects = savedPayer;
    }
  },
);

test("each-recipient physical sources are reserved atomically and publish one reaction per DON", () => {
  const observer = getCard("ST01-001"),
    saved = observer.effects;
  try {
    observer.effects = {
      effects: [
        {
          trigger: "whenDonGiven",
          eventFilter: { player: "self" },
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    };
    withDonReplacement(
      [
        {
          action: "giveDon",
          distribution: "each",
          count: { amount: 1 },
          donState: "active",
          target: { player: "self", zones: ["character"], count: { amount: "all" } },
        },
      ],
      () => {
        let engine = OnePieceTestEngine.create(
          { character: ["ST01-007"] },
          {
            leaderCardId: "ST01-001",
            character: ["PRB02-006", "EB01-005"],
            activeDon: 3,
            deck: ["ST02-002", "ST02-002", "ST02-002"],
          },
        );
        engine.asSouth().activateMain("ST01-007");
        const step = engine.pendingDecision("effectSimultaneousStateSelection", "south").steps[0];
        if (step?.kind !== "selectEntity") throw new Error("Expected target choice");
        const tokens = step.candidates.map((candidate) => candidate.ref.id);
        engine.resolveDecision(
          "effectSimultaneousStateSelection",
          { selectedIds: [tokens[0]!] },
          "south",
        );
        engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "north");
        engine.resolveDecision(
          "effectDonTransferSelection",
          { selectedIds: [tokens[1]!] },
          "north",
        );
        expect(engine.getView("north").players.north.characters[0]?.attachedDon).toBe(0);
        const second = engine.pendingDecision("effectDonTransferSelection", "north");
        engine.expectFailure({
          type: "resolvePrompt",
          seat: "north",
          promptId: second.id,
          selectedIds: [tokens[1]!],
        });
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        engine.resolveDecision(
          "effectDonTransferSelection",
          { selectedIds: [tokens[2]!] },
          "north",
        );
        expect(
          engine
            .getView("north")
            .players.north.characters.slice(0, 2)
            .map((card) => card?.attachedDon),
        ).toEqual([1, 1]);
        expect(engine.getView("north").players.north.restedDon).toBe(1);
        const order = engine.pendingDecision("readyEffectOrder", "north").steps[0];
        if (order?.kind !== "chooseOption") throw new Error("Expected two DON reactions");
        expect(order.options).toHaveLength(2);
        engine.resolveDecision("readyEffectOrder", { optionId: order.options[0]!.id }, "north");
        expect(engine.getView("north").players.north.hand).toHaveLength(2);
        expect(engine.getView("north").prompts).toHaveLength(0);
      },
    );
  } finally {
    observer.effects = saved;
  }
});

test("legacy saved freeze modifiers bind before a pending DON-count decision resumes", () => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "freeze",
              target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
            },
            {
              action: "setActive",
              target: { player: "self", zones: ["costArea"], count: { amount: 1, upTo: true } },
            },
            {
              action: "rest",
              target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
            },
          ],
        },
      ],
    };
    let engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", restedDon: 2, deck: ["ST02-002", "ST02-002"] },
      { deck: ["ST02-002", "ST02-002"] },
    );
    engine.asSouth().activateMain(engine.asSouth().leader());
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: ["rested-don:south:0"] },
      "south",
    );
    engine.pendingDecision("effectSetActiveDon", "south");
    // Explicit older-state migration fixture: the prior release saved virtual freeze targets only.
    const legacy: import("../../src/types.ts").MatchState = JSON.parse(
      JSON.stringify(engine.getState()),
    );
    delete legacy.donIdentities;
    for (const modifier of Object.values(legacy.modifiers)) delete modifier.donIdentity;
    engine = OnePieceTestEngine.fromState(legacy);
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    const step = engine.pendingDecision("effectDonTransferSelection", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected migrated physical source choice");
    const frozen = step.candidates.find((candidate) => candidate.label.includes("cannot refresh"))!;
    engine.resolveDecision("effectDonTransferSelection", { selectedIds: [frozen.ref.id] }, "south");
    engine.asSouth().endTurn();
    engine.asNorth().endTurn();
    expect(engine.getView("south").players.south.restedDon).toBe(1);
  } finally {
    leader.effects = saved;
  }
});

test("state-qualified simultaneous DON groups use their initial pools on both seats", () => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "simultaneousStateChange",
              groups: [
                {
                  state: "rested",
                  target: {
                    player: "both",
                    zones: ["costArea"],
                    filters: [{ filter: "state", value: "active" }],
                    count: { amount: "all" },
                  },
                },
                {
                  state: "active",
                  target: {
                    player: "both",
                    zones: ["costArea"],
                    filters: [{ filter: "state", value: "rested" }],
                    count: { amount: "all" },
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 2, restedDon: 1 },
      { activeDon: 1, restedDon: 2 },
    );
    engine.asSouth().activateMain(engine.asSouth().leader());
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(2);
    expect(engine.getView("south").players.north.activeDon).toBe(2);
    expect(engine.getView("south").players.north.restedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  } finally {
    leader.effects = saved;
  }
});

test("unsupported DON characteristic filters stop before any grouped mutation", () => {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "simultaneousStateChange",
              groups: [
                {
                  state: "rested",
                  target: {
                    player: "self",
                    zones: ["costArea"],
                    filters: [{ filter: "trait", value: "Navy", match: "exact" }],
                    count: { amount: "all" },
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create({ leaderCardId: "ST01-001", activeDon: 2 });
    engine.asSouth().activateMain(engine.asSouth().leader());
    expect(engine.getView("south").players.south.activeDon).toBe(2);
    expect(engine.getView("south").players.south.restedDon).toBe(0);
    expect(engine.getView("judge").prompts).toHaveLength(1);
    expect(engine.getView("judge").prompts[0]?.label).toContain("Judge review");
  } finally {
    leader.effects = saved;
  }
});

test.each(["active", "any"] as const)(
  "ordered DON payment uses the post-rest %s pool and keeps physical identity",
  (donState) => {
    const leader = getCard("ST01-001"),
      payer = getCard("EB01-005"),
      savedLeader = leader.effects,
      savedPayer = payer.effects;
    try {
      leader.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "freeze",
                target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
              },
              {
                action: "setActive",
                target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
              },
            ],
          },
        ],
      };
      payer.effects = {
        effects: [
          {
            trigger: "activateMain",
            costs: [
              { cost: "restDon", amount: 1 },
              { cost: "returnDon", amount: 1, donState },
            ],
            actions: [{ action: "draw", player: "self", amount: 1 }],
          },
        ],
      };
      let engine = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          character: ["EB01-005"],
          restedDon: 2,
          deck: ["ST02-002", "ST02-002", "ST02-002"],
        },
        { deck: ["ST02-002", "ST02-002"] },
      );
      engine.asSouth().activateMain(engine.asSouth().leader());
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: ["rested-don:south:0"] },
        "south",
      );
      engine.asSouth().activateMain("EB01-005");
      const step = engine.pendingDecision("effectCostDonIdentity", "south").steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected payment source choice");
      const frozen = step.candidates.find((candidate) =>
        candidate.label.includes("cannot refresh"),
      )!;
      engine.resolveDecision("effectCostDonIdentity", { selectedIds: [frozen.ref.id] }, "south");
      if (donState === "any") {
        const returnChoice = engine.pendingDecision("effectCostReturnDon", "south");
        const beforeInvalid = engine.getView("south").players.south;
        engine.expectFailure({
          type: "resolvePrompt",
          seat: "south",
          promptId: returnChoice.id,
          selectedIds: ["active-don:1"],
        });
        expect(engine.getView("south").players.south).toEqual(beforeInvalid);
        expect(beforeInvalid.activeDon).toBe(1);
        expect(beforeInvalid.restedDon).toBe(1);
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        // The frozen physical DON was rested by the first cost; return that
        // same token from its new pool, not an old active-pool index.
        engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
      }
      // For active-only, the sole remaining active DON pays automatically.
      expect(engine.getView("south").players.south.hand).toHaveLength(1);
      expect(engine.getView("south").players.south.activeDon).toBe(donState === "active" ? 0 : 1);
      expect(engine.getView("south").players.south.restedDon).toBe(donState === "active" ? 1 : 0);
      engine.asSouth().endTurn();
      engine.asNorth().endTurn();
      expect(engine.getView("south").players.south.restedDon).toBe(donState === "active" ? 1 : 0);
    } finally {
      leader.effects = savedLeader;
      payer.effects = savedPayer;
    }
  },
);

test.each(["active"] as const)(
  "ordered restCards payment precedes the %s return and keeps physical identity",
  (donState) => {
    const leader = getCard("ST01-001"),
      payer = getCard("EB01-005"),
      savedLeader = leader.effects,
      savedPayer = payer.effects;
    try {
      leader.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "freeze",
                target: { player: "self", zones: ["costArea"], count: { amount: 1 } },
              },
              {
                action: "setActive",
                target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
              },
            ],
          },
        ],
      };
      payer.effects = {
        effects: [
          {
            trigger: "activateMain",
            costs: [
              { cost: "restCards", amount: 1 },
              { cost: "returnDon", amount: 1, donState },
            ],
            actions: [{ action: "draw", player: "self", amount: 1 }],
          },
        ],
      };
      let engine = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          character: ["EB01-005"],
          restedDon: 2,
          deck: ["ST02-002", "ST02-002", "ST02-002"],
        },
        { deck: ["ST02-002", "ST02-002"] },
      );
      engine.asSouth().activateMain(engine.asSouth().leader());
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: ["rested-don:south:0"] },
        "south",
      );
      engine.asSouth().activateMain("EB01-005");
      const restChoice = engine.pendingDecision("effectCostRestCards", "south");
      const beforeInvalid = engine.getView("south").players.south;
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: restChoice.id,
        selectedIds: ["active-don:south:0", "active-don:south:0"],
      });
      expect(engine.getView("south").players.south).toEqual(beforeInvalid);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision(
        "effectCostRestCards",
        { selectedIds: ["active-don:south:0"] },
        "south",
      );
      // The second cost returns the other, still-active DON automatically.
      expect(engine.getView("south").players.south.hand).toHaveLength(1);
      expect(engine.getView("south").players.south.activeDon).toBe(donState === "active" ? 0 : 1);
      expect(engine.getView("south").players.south.restedDon).toBe(donState === "active" ? 1 : 0);
      engine.asSouth().endTurn();
      engine.asNorth().endTurn();
      expect(engine.getView("south").players.south.restedDon).toBe(donState === "active" ? 1 : 0);
    } finally {
      leader.effects = savedLeader;
      payer.effects = savedPayer;
    }
  },
);

import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { applyCommand, OnePieceTestEngine } from "../../src/index.ts";

// Rules 1-3-2-1, 1-3-3 and 8-4-4: selection follows the printed
// restrictions; no-op and prohibited state changes occur only at execution.
test("Izo may select an already-rested Galdino without triggering its rest reaction", () => {
  const engine = OnePieceTestEngine.create(
    { hand: ["OP01-033"], activeDon: 3 },
    {
      character: [{ card: getCard("PRB02-009"), rested: true }],
    },
  );
  const target = engine.findCardInZone("north", "character", "PRB02-009");
  engine.playCard("OP01-033");
  const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  if (choice?.kind !== "selectEntity") throw new Error("Expected Izo target choice.");
  expect(choice.candidates.map((c) => c.ref.id)).toContain(target);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
  expect(engine.getView("south").prompts).toHaveLength(0);
  expect(
    engine.getView("north").players.north.characters.find((c) => c?.instanceId === target)?.rested,
  ).toBe(true);
  expect(engine.getView("north").players.north.hand).toHaveLength(0);
});

test("Hody's mixed DON and Character selection permits an already-rested Character", () => {
  let engine = OnePieceTestEngine.create(
    { leaderCardId: "OP06-020" },
    {
      character: [{ card: getCard("EB01-005"), rested: true }],
      activeDon: 1,
    },
  );
  const target = engine.findCardInZone("north", "character", "EB01-005");
  engine.activateEffect(engine.leader("south"), "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const choice = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
  if (choice?.kind !== "payCost") throw new Error("Expected mixed rest choice.");
  expect(choice.candidates.map((c) => c.ref.id)).toEqual([target, "active-don:north:0"]);
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
  engine.resolveDecision("effectMixedRestSelection", { selectedIds: [target] }, "south");
  expect(engine.getView("north").players.north.activeDon).toBe(1);
  expect(engine.getView("south").prompts).toHaveLength(0);
});

test("an explicit active-only target still excludes rested cards", () => {
  const source = getCard("OP01-033");
  const original = source.effects;
  try {
    source.effects = {
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "state", value: "active" }],
              },
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create(
      { hand: [source], activeDon: 3 },
      {
        character: [{ card: getCard("EB01-005"), rested: true }],
      },
    );
    engine.playCard(source);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("north").players.north.characters.filter(Boolean)[0]?.rested).toBe(true);
  } finally {
    source.effects = original;
  }
});

test("a saved replacement continuation skips an already-rested sibling without reactions", () => {
  const source = getCard("OP01-033");
  const original = source.effects;
  try {
    // Synthetic multi-target rest isolates the continuation, using real Zoro and Galdino abilities.
    source.effects = {
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 2, upTo: true },
              },
            },
          ],
        },
      ],
    };
    let engine = OnePieceTestEngine.create(
      { hand: [source], activeDon: 3 },
      {
        character: ["PRB02-006", { card: getCard("PRB02-009"), rested: true }, "EB01-005"],
        activeDon: 1,
      },
    );
    const zoro = engine.findCardInZone("north", "character", "PRB02-006");
    const galdino = engine.findCardInZone("north", "character", "PRB02-009");
    engine.playCard(source);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [zoro, galdino] }, "south");
    engine.pendingDecision("effectRestReplacement", "north");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectRestReplacement", { optionId: "no" }, "north");
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("north").players.north.hand).toHaveLength(0);
    expect(
      engine.getView("north").players.north.characters.find((c) => c?.instanceId === zoro)?.rested,
    ).toBe(true);
    expect(
      engine.getView("north").players.north.characters.find((c) => c?.instanceId === galdino)
        ?.rested,
    ).toBe(true);
  } finally {
    source.effects = original;
  }
});

test("already-rested Zoro cannot replace a rest that is not performed", () => {
  const source = getCard("OP01-033");
  const original = source.effects;
  try {
    source.effects = {
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create(
      { hand: [source], activeDon: 3 },
      {
        character: [{ card: getCard("PRB02-006"), rested: true }, "EB01-005"],
      },
    );
    const zoro = engine.findCardInZone("north", "character", "PRB02-006");
    engine.playCard(source);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [zoro] }, "south");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine.getView("north").players.north.characters.find((c) => c?.cardId === "EB01-005")
        ?.rested,
    ).toBe(false);
  } finally {
    source.effects = original;
  }
});

test("Hody may select a rested DON slot without changing either pool", () => {
  let engine = OnePieceTestEngine.create({ leaderCardId: "OP06-020" }, { restedDon: 1 });
  engine.activateEffect(engine.leader("south"), "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const step = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
  if (step?.kind !== "payCost") throw new Error("Expected DON selection.");
  expect(step.candidates.map((c) => c.ref.id)).toEqual(["rested-don:north:0"]);
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
  engine.resolveDecision(
    "effectMixedRestSelection",
    { selectedIds: ["rested-don:north:0"] },
    "south",
  );
  expect(engine.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 1 });
  expect(engine.getView("south").prompts).toHaveLength(0);
});

test("Viola's pure DON effect distinguishes active and rested selections", () => {
  let engine = OnePieceTestEngine.create(
    { character: ["OP04-021"], activeDon: 2 },
    { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }], activeDon: 1, restedDon: 1 },
    { firstPlayer: "south", activeSeat: "north" },
  );
  engine.declareAttack(
    engine.findCardInZone("north", "character", "EB01-018"),
    engine.leader("south"),
    "north",
  );
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const step = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
  if (step?.kind !== "payCost") throw new Error("Expected DON selection.");
  expect(step.candidates.map((c) => c.ref.id)).toEqual([
    "active-don:north:0",
    "rested-don:north:0",
  ]);
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
  engine.resolveDecision(
    "effectMixedRestSelection",
    { selectedIds: ["rested-don:north:0"] },
    "south",
  );
  expect(engine.getView("north").players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
  expect(engine.getView("south").prompts).toHaveLength(0);
});

test.each([false, true])(
  "mixed rest slots survive replacement after an earlier DON, reverse=%s",
  (reverse) => {
    const source = getCard("OP01-033");
    const original = source.effects;
    try {
      source.effects = {
        effects: [
          {
            trigger: "onPlay",
            actions: [
              {
                action: "rest",
                target: {
                  player: "opponent",
                  zones: ["character", "costArea"],
                  count: { amount: 3, upTo: true },
                },
              },
            ],
          },
        ],
      };
      let engine = OnePieceTestEngine.create(
        { hand: [source], activeDon: 3 },
        {
          character: ["PRB02-006", "EB01-005"],
          activeDon: 2,
        },
      );
      const zoro = engine.findCardInZone("north", "character", "PRB02-006");
      engine.playCard(source);
      engine.resolveDecision(
        "effectMixedRestSelection",
        {
          selectedIds: [
            `active-don:north:${reverse ? 1 : 0}`,
            zoro,
            `active-don:north:${reverse ? 0 : 1}`,
          ],
        },
        "south",
      );
      engine.pendingDecision("effectRestReplacement", "north");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectRestReplacement", { optionId: "no" }, "north");
      expect(engine.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 2 });
      expect(
        engine.getView("north").players.north.characters.find((c) => c?.instanceId === zoro)
          ?.rested,
      ).toBe(true);
      expect(engine.getView("south").prompts).toHaveLength(0);
    } finally {
      source.effects = original;
    }
  },
);

test.each(["wrong owner", "missing slot", "duplicate"])(
  "rejects %s DON selection and permits a valid retry",
  (invalid) => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP06-020" },
      { activeDon: 1, restedDon: 1 },
    );
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const prompt = engine.pendingDecision("effectMixedRestSelection", "south");
    const selectedIds =
      invalid === "wrong owner"
        ? ["rested-don:south:0"]
        : invalid === "missing slot"
          ? ["rested-don:north:5"]
          : ["rested-don:north:0", "rested-don:north:0"];
    const result = applyCommand(engine.getState(), {
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds,
    });
    expect(result.accepted).toBe(false);
    const recovered = OnePieceTestEngine.fromState(result.state);
    expect(recovered.getView("north").players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
    recovered.pendingDecision("effectMixedRestSelection", "south");
    recovered.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: ["rested-don:north:0"] },
      "south",
    );
    expect(recovered.getView("north").players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(recovered.getView("south").prompts).toHaveLength(0);
  },
);

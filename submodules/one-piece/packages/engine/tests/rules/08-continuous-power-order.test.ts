import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Explicit native-grammar fixtures for CR8-1-3-3-5, not printed Brook abilities.
function withNumericPair(mode: "power" | "mixed", run: (card: ReturnType<typeof getCard>) => void) {
  const card = getCard("ST01-011");
  const original = card.effects;
  try {
    card.effects = {
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "modifyPower",
              duration: "permanent",
              value: 1000,
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [
                  mode === "power"
                    ? { filter: "power", comparison: "gte", value: 4000 }
                    : { filter: "cost", comparison: "gte", value: 2 },
                ],
              },
            },
          ],
        },
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            mode === "power"
              ? {
                  action: "modifyPower",
                  duration: "permanent",
                  value: -1000,
                  target: {
                    player: "self",
                    zones: ["character"],
                    self: true,
                    count: { amount: 1 },
                    filters: [{ filter: "power", comparison: "lte", value: 4000 }],
                  },
                }
              : {
                  action: "modifyCost",
                  value: -1,
                  target: {
                    player: "self",
                    zones: ["character"],
                    self: true,
                    count: { amount: 1 },
                    filters: [{ filter: "power", comparison: "lte", value: 4000 }],
                  },
                },
          ],
        },
      ],
    };
    run(card);
  } finally {
    card.effects = original;
  }
}

function chooseOrder(e: OnePieceTestEngine, index: number, seat: "south" | "north" = "south") {
  const decision = e.pendingDecision("continuousCostOrder", seat);
  const step = decision.steps[0];
  if (step?.kind !== "chooseOption") throw Error("Expected numeric effect order");
  e.resolveDecision("continuousCostOrder", { optionId: step.options[index]!.id }, seat);
}

test.each([
  { mode: "power" as const, first: 0, power: 5000, cost: 2 },
  { mode: "power" as const, first: 1, power: 3000, cost: 2 },
  { mode: "mixed" as const, first: 0, power: 5000, cost: 2 },
  { mode: "mixed" as const, first: 1, power: 4000, cost: 1 },
])("$mode order $first settles power $power and cost $cost", ({ mode, first, power, cost }) =>
  withNumericPair(mode, (card) => {
    let e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    e.pendingDecision("continuousCostOrder", "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    chooseOrder(e, first);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      power,
      cost,
      attachedDon: 1,
    });
    expect(e.getView("south").prompts).toHaveLength(0);
  }),
);

test("mixed numeric order rejects wrong-seat and invalid replies and restores the saved choice", () =>
  withNumericPair("mixed", (card) => {
    let e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    const decision = e.pendingDecision("continuousCostOrder", "south");
    const step = decision.steps[0];
    if (step?.kind !== "chooseOption") throw Error("Expected order");
    const optionId = step.options[1]!.id;
    for (const [seat, answer] of [
      ["north", optionId],
      ["south", "invalid"],
    ] as const) {
      const result = e.expectFailure({
        type: "resolvePrompt",
        seat,
        promptId: decision.id,
        optionId: answer,
      });
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(result.state)));
      expect(e.pendingDecision("continuousCostOrder", "south").id).toBe(decision.id);
      expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(1);
    }
    e.resolveDecision("continuousCostOrder", { optionId }, "south");
    expect(e.getView("south").players.south.characters[0]).toMatchObject({ power: 4000, cost: 1 });
    e.expectFailure({ type: "resolvePrompt", seat: "south", promptId: decision.id, optionId });
  }));

test("mixed numeric controllers settle active player first, then the other player", () =>
  withNumericPair("mixed", (card) => {
    for (const effect of card.effects?.permanentEffects ?? []) {
      effect.conditions = [
        {
          condition: "zoneCount",
          player: "any",
          zone: "character",
          comparison: "gte",
          value: 1,
          filters: [{ filter: "name", value: "Doma" }],
        },
      ];
      for (const action of effect.actions)
        if (action.action === "modifyCost")
          action.target.filters = [{ filter: "power", comparison: "lte", value: 3000 }];
    }
    const e = OnePieceTestEngine.create(
      { character: [card], hand: ["EB01-005"], activeDon: 1 },
      { character: [card] },
    );
    e.asSouth().play("EB01-005");
    expect(e.getView("south").prompts[0]?.seat).toBe("south");
    chooseOrder(e, 0);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({ power: 4000, cost: 2 });
    expect(e.getView("north").prompts[0]?.seat).toBe("north");
    chooseOrder(e, 1, "north");
    expect(e.getView("north").players.north.characters[0]).toMatchObject({ power: 3000, cost: 1 });
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test.each([0, 1])(
  "mixed actions within a single permanent block retain printed order %i",
  (first) =>
    withNumericPair("mixed", (card) => {
      const effects = card.effects!.permanentEffects!;
      const actions = [effects[first]!.actions[0]!, effects[1 - first]!.actions[0]!];
      card.effects = { permanentEffects: [{ conditions: effects[0]!.conditions, actions }] };
      const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
      e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("south").players.south.characters[0]).toMatchObject(
        first === 0 ? { power: 5000, cost: 2 } : { power: 4000, cost: 1 },
      );
    }),
);

test("turn transition removes conditional numeric effects and opponent-turn DON power", () =>
  withNumericPair("power", (card) => {
    for (const effect of card.effects!.permanentEffects!)
      effect.conditions!.push({ condition: "turn", value: "your" });
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    chooseOrder(e, 0);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      power: 3000,
      attachedDon: 1,
    });
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("selected power controls actual attack damage and accepts a later Character Counter", () =>
  withNumericPair("power", (card) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: card.id, playedOnTurn: 0 }], activeDon: 1 },
      { hand: ["ST03-004"], life: ["EB01-005", "EB01-005"] },
    );
    const id = e.findCardInZone("south", "character", card);
    e.asSouth().attachDon(id, 1);
    chooseOrder(e, 0);
    e.asSouth().attack(id, e.leader("north"));
    e.asNorth().chooseCounter("ST03-004");
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST03-004");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test.each([0, 1])("different-name scaling retains cross-cost dependency order %i", (first) =>
  withNumericPair("mixed", (card) => {
    const action = card.effects!.permanentEffects![0]!.actions[0]!;
    if (action.action !== "modifyPower") throw Error("Expected power action");
    action.target.filters = [];
    action.valuePerDifferentNameOn = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: "all" },
      filters: [{ filter: "cost", comparison: "gte", value: 2 }],
    };
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    chooseOrder(e, first);
    expect(e.getView("south").players.south.characters[0]).toMatchObject(
      first === 0 ? { power: 5000, cost: 2 } : { power: 4000, cost: 1 },
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  }),
);

test.each(["direct", "negation"] as const)(
  "numeric base-setting feedback has an explicit %s capability boundary",
  (dependency) =>
    withNumericPair("mixed", (card) => {
      card.effects!.permanentEffects!.push({
        conditions:
          dependency === "direct"
            ? [
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [{ filter: "cost", comparison: "lte", value: 1 }],
                },
              ]
            : [],
        actions: [
          {
            action: "setBasePower",
            target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
            value: 7000,
          },
        ],
      });
      if (dependency === "negation")
        card.effects!.permanentEffects!.push({
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [{ filter: "power", comparison: "gte", value: 8000 }],
            },
          ],
          actions: [
            {
              action: "negateEffects",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
              duration: "permanent",
            },
          ],
        });
      const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
      e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
      expect(e.getState().continuousCosts?.unsupported).toBe(true);
      expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
      expect(e.getState().status).toBe("active");
    }),
);

test("the next power-filtered action waits for the chosen numeric settlement", () =>
  withNumericPair("power", (card) => {
    card.effects = {
      ...card.effects,
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "giveDon",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
              count: { amount: 1 },
              donState: "rested",
            },
            {
              action: "ko",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                chosenBy: "self",
                filters: [{ filter: "power", comparison: "lte", value: 3000 }],
              },
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create({ character: [card], restedDon: 1 });
    const id = e.findCardInZone("south", "character", card);
    e.asSouth().activateMain(id);
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(id);
    chooseOrder(e, 1);
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("Expected K.O. target");
    expect(step.candidates.map((c) => c.ref.id)).toContain(id);
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("negative settled power is retained instead of being floored like cost", () =>
  withNumericPair("power", (card) => {
    const action = card.effects!.permanentEffects![1]!.actions[0]!;
    if (action.action !== "modifyPower") throw Error("Expected power action");
    action.value = -6000;
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    chooseOrder(e, 1);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({ power: -2000, cost: 2 });
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("power order ignores 24 independent hand discounts without combinatorial enumeration", () =>
  withNumericPair("power", (card) => {
    const discount = getCard("EB01-005");
    const original = discount.effects;
    try {
      discount.effects = {
        permanentEffects: [
          {
            actions: [
              {
                action: "modifyCost",
                value: -1,
                target: { player: "self", zones: ["hand"], self: true, count: { amount: 1 } },
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create({
        character: [card],
        hand: Array.from({ length: 24 }, () => discount),
        activeDon: 1,
      });
      e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
      const step = e.pendingDecision("continuousCostOrder", "south").steps[0];
      if (step?.kind !== "chooseOption") throw Error("Expected power order");
      expect(step.options).toHaveLength(2);
      expect(step.options.map((option) => option.label)).toEqual([
        "Brook: permanent effect 1, +1000 power",
        "Brook: permanent effect 2, -1000 power",
      ]);
      expect(e.getView("north").decisions).toHaveLength(0);
      chooseOrder(e, 0);
      expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
      expect(e.getView("south").players.south.hand).toHaveLength(24);
      expect(e.getView("south").players.south.hand.every((c) => c.cost === 0)).toBe(true);
      expect(e.getView("south").prompts).toHaveLength(0);
    } finally {
      discount.effects = original;
    }
  }));

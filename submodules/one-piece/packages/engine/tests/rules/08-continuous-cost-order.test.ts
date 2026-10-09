import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Explicit rules fixture, not a printed card: both native permanent effects
// become valid with one DON. CR8-1-3-3-5 lets their controller choose the order.
test.each([
  { first: 0, cost: 3 },
  { first: 1, cost: 1 },
])("continuous cost order chooses effect $first and settles at $cost", ({ first, cost }) => {
  const card = getCard("ST01-011");
  if (card.cardType !== "character") throw Error("Expected Character");
  const original = { cost: card.cost, effects: card.effects };
  try {
    card.cost = 2;
    card.effects = {
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [{ filter: "cost", comparison: "gte", value: 2 }],
              },
              value: 1,
            },
          ],
        },
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              value: -1,
            },
          ],
        },
      ],
    };
    let e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    const id = e.findCardInZone("south", "character", card);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(2);
    e.asSouth().attachDon(id, 1);
    const choice = e.pendingDecision("continuousCostOrder", "south");
    const step = choice.steps[0];
    if (step?.kind !== "chooseOption") throw Error("Expected continuous order choice");
    expect(step.options).toHaveLength(2);
    const optionId = step.options[first]!.id;
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("continuousCostOrder", { optionId }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(cost);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(cost);
  } finally {
    card.cost = original.cost;
    card.effects = original.effects;
  }
});

function withCostPair(run: (card: ReturnType<typeof getCard>) => void) {
  const card = getCard("ST01-011");
  if (card.cardType !== "character") throw Error("Expected Character");
  const original = { cost: card.cost, effects: card.effects };
  try {
    card.cost = 2;
    card.effects = {
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [{ filter: "cost", comparison: "gte", value: 2 }],
              },
              value: 1,
            },
          ],
        },
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              value: -1,
            },
          ],
        },
      ],
    };
    run(card);
  } finally {
    card.cost = original.cost;
    card.effects = original.effects;
  }
}

function option(e: OnePieceTestEngine, index: number, seat: "south" | "north" = "south") {
  const decision = e.pendingDecision("continuousCostOrder", seat);
  const step = decision.steps[0];
  if (step?.kind !== "chooseOption") throw Error("Expected order choice");
  return { decision, id: step.options[index]!.id };
}

test("invalid order input is atomic and the saved choice remains retryable", () =>
  withCostPair((card) => {
    let e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    const { decision, id } = option(e, 1);
    const before = e.getView("south").players;
    for (const [seat, optionId] of [
      ["north", id],
      ["south", "invalid"],
    ] as const) {
      const rejected = e.expectFailure({
        type: "resolvePrompt",
        seat,
        promptId: decision.id,
        optionId,
      });
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(rejected.state)));
      expect(e.getView("south").players).toEqual(before);
      expect(e.pendingDecision("continuousCostOrder", "south").id).toBe(decision.id);
    }
    e.resolveDecision("continuousCostOrder", { optionId: id }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
    e.expectFailure({ type: "resolvePrompt", seat: "south", promptId: decision.id, optionId: id });
  }));

test("the active controller settles before the other controller", () =>
  withCostPair((card) => {
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
    }
    const e = OnePieceTestEngine.create(
      { character: [card], hand: ["EB01-005"], activeDon: 1 },
      { character: [card] },
    );
    e.asSouth().play("EB01-005");
    expect(e.getView("south").prompts[0]?.seat).toBe("south");
    e.resolveDecision("continuousCostOrder", { optionId: option(e, 1).id }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
    expect(e.getView("north").prompts[0]?.seat).toBe("north");
    e.resolveDecision("continuousCostOrder", { optionId: option(e, 0, "north").id }, "north");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("a cost-dependent next action waits for settlement after DON is given", () =>
  withCostPair((card) => {
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
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
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
    e.resolveDecision("continuousCostOrder", { optionId: option(e, 1).id }, "south");
    const target = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw Error("Expected KO target");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(id);
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("turn expiry clears settled contributions when permanent conditions cease", () =>
  withCostPair((card) => {
    for (const effect of card.effects?.permanentEffects ?? [])
      effect.conditions?.push({ condition: "turn", value: "your" });
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    e.resolveDecision("continuousCostOrder", { optionId: option(e, 1).id }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("commuting effects do not ask the player for an irrelevant order", () =>
  withCostPair((card) => {
    for (const effect of card.effects?.permanentEffects ?? [])
      for (const action of effect.actions) {
        if (action.action === "modifyCost")
          action.target.filters = [{ filter: "cost", comparison: "gte", value: 0 }];
      }
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(1);
  }));

test.each([false, true])(
  "actions within one permanent block keep printed order (reverse %s)",
  (reverse) =>
    withCostPair((card) => {
      const blocks = card.effects!.permanentEffects!;
      const actions = blocks.flatMap((block) => block.actions);
      if (reverse) actions.reverse();
      card.effects = {
        permanentEffects: [
          { conditions: [{ condition: "donAttached", amount: 1 }], actions },
          {
            actions: [
              {
                action: "modifyCost",
                target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
                value: 0,
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
      e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(reverse ? 1 : 3);
      expect(e.getView("south").prompts).toHaveLength(0);
    }),
);

test("many independent hand discounts commute without factorial order enumeration", () =>
  withCostPair((card) => {
    const discount = getCard("ST03-004");
    const original = discount.effects;
    try {
      discount.effects = {
        permanentEffects: [
          {
            actions: [
              {
                action: "modifyCost",
                target: { player: "self", zones: ["hand"], self: true, count: { amount: 1 } },
                value: -1,
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
      const choice = option(e, 1);
      const step = choice.decision.steps[0];
      if (step?.kind !== "chooseOption") throw Error("Expected cost choice");
      expect(step.options).toHaveLength(2);
      expect(e.getView("north").decisions).toHaveLength(0);
      e.resolveDecision("continuousCostOrder", { optionId: choice.id }, "south");
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
      expect(e.getView("south").players.south.hand).toHaveLength(24);
      expect(e.getView("south").prompts).toHaveLength(0);
    } finally {
      discount.effects = original;
    }
  }));

test("a cyclic ordering branch does not suppress another stable player choice", () =>
  withCostPair((card) => {
    const second = card.effects!.permanentEffects![1]!.actions[0]!;
    if (second.action !== "modifyCost") throw Error("Expected cost modifier");
    second.target.filters = [{ filter: "cost", comparison: "eq", value: 2 }];
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    expect(e.getState().capabilityHistory).toHaveLength(0);
    e.resolveDecision("continuousCostOrder", { optionId: option(e, 0).id }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(3);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("accepted judge source removal invalidates an old continuous choice without deadlock", () =>
  withCostPair((card) => {
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    const id = e.findCardInZone("south", "character", card);
    e.asSouth().attachDon(id, 1);
    const previous = option(e, 0).decision.id;
    e.exec({ type: "judgeMoveCard", seat: "judge", instanceId: id, owner: "south", zone: "trash" });
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getState().promptQueue.find((p) => p.id === previous)?.status).toBe("cancelled");
    e.asSouth().endTurn();
    expect(e.getState().activeSeat).toBe("north");
  }));

test("paid costs pause before post-cost conditions and resume once after a saved order choice", () =>
  withCostPair((card) => {
    for (const effect of card.effects!.permanentEffects!)
      effect.conditions = [{ condition: "handCount", player: "self", comparison: "eq", value: 0 }];
    card.effects = {
      ...card.effects,
      effects: [
        {
          trigger: "activateMain",
          oncePerTurn: true,
          costs: [{ cost: "trashFromHand", amount: 1 }],
          postCostConditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [{ filter: "cost", comparison: "lte", value: 1 }],
            },
          ],
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    };
    let e = OnePieceTestEngine.create({
      character: [card],
      hand: ["EB01-005"],
      deck: ["ST03-004", "ST01-012"],
    });
    const id = e.findCardInZone("south", "character", card);
    const discard = e.findCardInZone("south", "hand", "EB01-005");
    e.asSouth().activateMain(id);
    const selected = option(e, 1).id;
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(discard);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("continuousCostOrder", { optionId: selected }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST03-004"]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
    // A new payable hand card remains, so rejection proves the OPT, not missing cost.
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: id,
      trigger: "activateMain",
    });
  }));

test("a paid DON prefix settles before the next cost target selection", () =>
  withCostPair((card) => {
    for (const effect of card.effects!.permanentEffects!)
      effect.conditions = [{ condition: "activeDonCount", comparison: "eq", value: 0 }];
    card.effects = {
      ...card.effects,
      effects: [
        {
          trigger: "activateMain",
          oncePerTurn: true,
          costs: [
            { cost: "returnDon", amount: 1 },
            {
              cost: "returnCharacterToDeck",
              amount: 1,
              position: "bottom",
              filters: [{ filter: "cost", comparison: "lte", value: 1 }],
            },
          ],
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    };
    let e = OnePieceTestEngine.create({
      character: [card, "EB01-005", "EB01-005"],
      activeDon: 1,
      deck: ["ST03-004", "ST01-012"],
    });
    const id = e.findCardInZone("south", "character", card);
    const donDeck = e.getView("south").players.south.donDeckCount;
    e.asSouth().activateMain(id);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(donDeck + 1);
    const selected = option(e, 1).id;
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("continuousCostOrder", { optionId: selected }, "south");
    const decision = e.getView("south").decisions[0];
    const step = decision?.steps[0];
    if (step?.kind !== "payCost") throw Error("Expected Character payment choice");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(id);
    e.resolveDecision("effectCostReturnCharacterToDeck", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).not.toContain(id);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST03-004"]);
    expect(e.getView("south").players.south.donDeckCount).toBe(donDeck + 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("a replayed physical card does not inherit the previous generation's order", () =>
  withCostPair((card) => {
    card.effects = {
      ...card.effects,
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "returnToHand",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 4 });
    const id = e.findCardInZone("south", "character", card);
    e.asSouth().attachDon(id, 1);
    const old = option(e, 1).id;
    e.resolveDecision("continuousCostOrder", { optionId: old }, "south");
    e.asSouth().activateMain(id);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(id);
    e.asSouth().play(card);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(2);
    e.asSouth().attachDon(id, 1);
    const current = option(e, 0);
    expect(current.id).not.toBe(old);
    e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: current.decision.id,
      optionId: old,
    });
    e.resolveDecision("continuousCostOrder", { optionId: current.id }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(3);
    expect(e.getView("south").prompts).toHaveLength(0);
  }));

test("an unavoidable cyclic cost component is explicit and does not falsely draw the game", () =>
  withCostPair((card) => {
    const effect = card.effects!.permanentEffects![0]!;
    const action = effect.actions[0]!;
    if (action.action !== "modifyCost") throw Error("Expected cost modifier");
    action.target.filters = [{ filter: "cost", comparison: "eq", value: 2 }];
    card.effects = { permanentEffects: [effect] };
    const e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
    expect(e.getState().capabilityHistory.map((issue) => issue.code)).toContain(
      "continuous-cost:settlement",
    );
    expect(
      e.getView("judge").prompts.some((prompt) => prompt.label.includes("continuous cost")),
    ).toBe(true);
    expect(e.getState().status).toBe("active");
    expect(e.getState().winner).toBeNull();
  }));

test.each([
  { first: 0, keyword: false, entryRead: true },
  { first: 1, keyword: false, entryRead: true },
  { first: 0, keyword: true, entryRead: true },
  { first: 1, keyword: true, entryRead: true },
  { first: 0, keyword: false, entryRead: false },
  { first: 1, keyword: false, entryRead: false },
])(
  "numeric negation dependencies retain both legal effect orders ($first first, keyword $keyword, entry read $entryRead)",
  ({ first, keyword, entryRead }) => {
    const a = getCard("ST01-011");
    const b = getCard("ST03-004");
    const c = getCard("EB01-005");
    if (a.cardType !== "character" || b.cardType !== "character")
      throw Error("Expected Characters");
    const originals = { a: a.effects, b: b.effects, c: c.effects, aCost: a.cost, bCost: b.cost };
    try {
      a.cost = 2;
      b.cost = 2;
      a.effects = {
        permanentEffects: [
          {
            conditions: [{ condition: "activeDonCount", comparison: "eq", value: 0 }],
            actions: [
              {
                action: "modifyCost",
                target: {
                  player: "self",
                  zones: ["character"],
                  self: true,
                  count: { amount: 1 },
                  filters: entryRead
                    ? [{ filter: "cost", comparison: "gte", value: 2 }]
                    : undefined,
                },
                value: 1,
              },
            ],
          },
        ],
      };
      b.effects = {
        permanentEffects: [
          {
            conditions: [{ condition: "activeDonCount", comparison: "eq", value: 0 }],
            actions: [
              {
                action: "modifyCost",
                target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
                value: -1,
              },
            ],
          },
        ],
      };
      c.effects = {
        permanentEffects: [
          {
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  { filter: "name", value: b.name },
                  { filter: "cost", comparison: "lte", value: 1 },
                ],
              },
            ],
            actions: [
              {
                action: "negateEffects",
                duration: "permanent",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: "all" },
                  filters: [{ filter: "name", value: a.name }],
                },
              },
            ],
          },
          {
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  { filter: "name", value: a.name },
                  { filter: "cost", comparison: "gte", value: 3 },
                ],
              },
            ],
            actions: [
              {
                action: "negateEffects",
                duration: "permanent",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: "all" },
                  filters: [{ filter: "name", value: b.name }],
                },
              },
            ],
          },
        ],
      };
      if (keyword) {
        const negations = c.effects!.permanentEffects!;
        const low = negations[0]!;
        const high = negations[1]!;
        const grants = [
          {
            conditions: low.conditions,
            actions: [
              {
                action: "grantKeyword" as const,
                keyword: "blocker" as const,
                duration: "permanent" as const,
                target: {
                  player: "self" as const,
                  zones: ["character" as const],
                  count: { amount: "all" as const },
                  filters: [{ filter: "name" as const, value: b.name }],
                },
              },
            ],
          },
          {
            conditions: high.conditions,
            actions: [
              {
                action: "grantKeyword" as const,
                keyword: "rush" as const,
                duration: "permanent" as const,
                target: {
                  player: "self" as const,
                  zones: ["character" as const],
                  count: { amount: "all" as const },
                  filters: [{ filter: "name" as const, value: a.name }],
                },
              },
            ],
          },
        ];
        low.conditions = [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              { filter: "name", value: b.name },
              { filter: "hasKeyword", value: "blocker" },
            ],
          },
        ];
        high.conditions = [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              { filter: "name", value: a.name },
              { filter: "hasKeyword", value: "rush" },
            ],
          },
        ];
        c.effects!.permanentEffects = [...grants, ...negations];
      }
      const e = OnePieceTestEngine.create({ character: [a, b, c], activeDon: 1 });
      e.asSouth().attachDon(e.findCardInZone("south", "character", c), 1);
      const choice = option(e, first);
      e.resolveDecision("continuousCostOrder", { optionId: choice.id }, "south");
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(first === 0 ? 3 : 2);
      expect(e.getView("south").players.south.characters[1]?.cost).toBe(first === 0 ? 2 : 1);
      expect(e.getView("south").prompts).toHaveLength(0);
    } finally {
      a.effects = originals.a;
      b.effects = originals.b;
      c.effects = originals.c;
      a.cost = originals.aCost;
      b.cost = originals.bCost;
    }
  },
);

test.each([0, 1])(
  "keyword-only numeric predicates choose cost order without a negation source (%i)",
  (first) =>
    withCostPair((card) => {
      const provider = getCard("EB01-005");
      const original = provider.effects;
      try {
        const blocks = card.effects!.permanentEffects!;
        for (let index = 0; index < blocks.length; index++) {
          const action = blocks[index]!.actions[0]!;
          if (action.action !== "modifyCost") throw Error("Expected cost modifier");
          action.target.filters = [
            { filter: "hasKeyword", value: index === 0 ? "rush" : "blocker" },
          ];
        }
        provider.effects = {
          permanentEffects: [
            {
              conditions: [
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [
                    { filter: "name", value: card.name },
                    { filter: "cost", comparison: "gte", value: 2 },
                  ],
                },
              ],
              actions: [
                {
                  action: "grantKeyword",
                  keyword: "rush",
                  duration: "permanent",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: { amount: "all" },
                    filters: [{ filter: "name", value: card.name }],
                  },
                },
              ],
            },
            {
              conditions: [
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [
                    { filter: "name", value: card.name },
                    { filter: "cost", comparison: "lte", value: 2 },
                  ],
                },
              ],
              actions: [
                {
                  action: "grantKeyword",
                  keyword: "blocker",
                  duration: "permanent",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: { amount: "all" },
                    filters: [{ filter: "name", value: card.name }],
                  },
                },
              ],
            },
          ],
        };
        const e = OnePieceTestEngine.create({ character: [card, provider], activeDon: 1 });
        e.asSouth().attachDon(e.findCardInZone("south", "character", card), 1);
        e.resolveDecision("continuousCostOrder", { optionId: option(e, first).id }, "south");
        expect(e.getView("south").players.south.characters[0]?.cost).toBe(first === 0 ? 3 : 1);
        expect(e.getView("south").prompts).toHaveLength(0);
      } finally {
        provider.effects = original;
      }
    }),
);

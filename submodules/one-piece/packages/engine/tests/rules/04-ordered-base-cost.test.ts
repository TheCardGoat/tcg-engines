import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Explicit rules fixture, not a printed card: both native permanent effects
// become valid with one DON. CR8-1-3-3-5 lets their controller choose the order.
test.each([
  { first: 0, cost: 2 },
  { first: 1, cost: 4 },
])("base cost order chooses effect $first and settles at $cost", ({ first, cost }) => {
  const card = getCard("ST01-011");
  if (card.cardType !== "character") throw Error("Expected Character");
  const original = { cost: card.cost, effects: card.effects };
  try {
    card.cost = 6;
    card.effects = {
      effects: [
        { trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] },
      ],
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "setBaseCost",
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [{ filter: "power", comparison: "gte", value: 4000 }],
              },
              value: 2,
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
                filters: [{ filter: "cost", comparison: "gte", value: 3 }],
              },
              value: 2,
            },
          ],
        },
      ],
    };
    let e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
    const id = e.findCardInZone("south", "character", card);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(6);
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
    e.asSouth().activateMain(id);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(cost);
  } finally {
    card.cost = original.cost;
    card.effects = original.effects;
  }
});

function fixture(effects: Record<string, import("@tcg/op-types").CardEffects>, run: () => void) {
  const saved = Object.entries(effects).map(([id, value]) => {
    const card = getCard(id);
    const old = card.effects;
    card.effects = value;
    return { card, old };
  });
  try {
    run();
  } finally {
    for (const { card, old } of saved) card.effects = old;
  }
}
const self: import("@tcg/op-types").Target = {
  player: "self",
  zones: ["character"],
  self: true,
  count: { amount: 1 },
};
const powerGate: import("@tcg/op-types").Condition = {
  condition: "cardState",
  target: "this",
  property: "power",
  comparison: "gte",
  value: 4000,
};
const brook: import("@tcg/op-types").Target = {
  player: "self",
  zones: ["character"],
  count: { amount: "all" },
  filters: [{ filter: "name", value: "Brook" }],
};
function cost(e: OnePieceTestEngine, seat: "south" | "north" = "south") {
  return e.getView(seat).players[seat].characters.find((c) => c?.cardId === "ST01-011")?.cost;
}

test.each(["selector", "block", "action"] as const)(
  "fixed power %s gate changes cost through public DON attachment",
  (gate) => {
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              conditions: gate === "block" ? [powerGate] : [],
              actions: [
                {
                  action: "setBaseCost",
                  value: 0,
                  condition: gate === "action" ? powerGate : undefined,
                  target:
                    gate === "selector"
                      ? { ...self, filters: [{ filter: "power", comparison: "gte", value: 4000 }] }
                      : self,
                },
              ],
            },
            { actions: [{ action: "modifyCost", target: self, value: 1 }] },
          ],
        },
      },
      () => {
        const e = OnePieceTestEngine.create({ character: ["ST01-011"], activeDon: 1 });
        expect(cost(e)).toBe(3);
        e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
        expect(cost(e)).toBe(1);
        expect(e.getView("south").prompts).toHaveLength(0);
        e.asSouth().endTurn();
        expect(cost(e)).toBe(3);
      },
    );
  },
);

test.each(["power", "basePower"] as const)(
  "resolved %s is a fixed eligible input and expires",
  (kind) => {
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              actions: [
                {
                  action: "setBaseCost",
                  value: 0,
                  target: {
                    ...self,
                    filters: [{ filter: "power", comparison: "gte", value: 4000 }],
                  },
                },
              ],
            },
          ],
        },
        "EB01-005": {
          effects: [
            {
              trigger: "activateMain",
              actions: [
                kind === "power"
                  ? { action: "modifyPower", target: brook, value: 1000, duration: "thisTurn" }
                  : { action: "setBasePower", target: brook, value: 4000, duration: "thisTurn" },
              ],
            },
          ],
        },
      },
      () => {
        let e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"] });
        expect(cost(e)).toBe(2);
        e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        expect(cost(e)).toBe(0);
        e.asSouth().endTurn();
        expect(cost(e)).toBe(2);
      },
    );
  },
);

test.each([
  { setting: 0, add: 1, result: 1 },
  { setting: -2, add: 3, result: 1 },
  { setting: 4, add: -1, result: 3 },
])("raw setting $setting with additive $add gives $result", ({ setting, add, result }) => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            actions: [
              { action: "setBaseCost", value: setting, target: self },
              { action: "modifyCost", target: self, value: add },
            ],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011"], activeDon: 1 });
      e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
      expect(cost(e)).toBe(result);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("highest setting wins across permanent blocks and a resolved setting", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          { actions: [{ action: "setBaseCost", value: 0, target: self }] },
          { actions: [{ action: "setBaseCost", value: 3, target: self }] },
        ],
      },
      "EB01-005": {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "setBaseCost", value: 4, target: brook }],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"] });
      expect(cost(e)).toBe(3);
      e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
      expect(cost(e)).toBe(4);
      e.asSouth().endTurn();
      expect(cost(e)).toBe(3);
    },
  );
});

test.each(["cost", "baseCost", "dynamicCost", "powerWriter", "negation"] as const)(
  "base-cost admission distinguishes feedback from unrelated effects: %s",
  (mode) => {
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              actions: [
                {
                  action: "setBaseCost",
                  value: 0,
                  target: {
                    ...self,
                    filters: [
                      mode === "dynamicCost"
                        ? { filter: "dynamicCost", comparison: "gte", source: "selfLifeCount" }
                        : {
                            filter: mode === "cost" || mode === "baseCost" ? mode : "power",
                            comparison: "gte",
                            value: 1,
                          },
                    ],
                  },
                },
              ],
            },
            ...(mode === "powerWriter"
              ? [
                  {
                    actions: [
                      {
                        action: "modifyPower" as const,
                        target: self,
                        value: 1000,
                        duration: "permanent" as const,
                      },
                    ],
                  },
                ]
              : []),
          ],
        },
        ...(mode === "negation"
          ? {
              "OP02-106": {
                permanentEffects: [
                  { actions: [{ action: "negateEffects", target: self, duration: "permanent" }] },
                ],
              },
            }
          : {}),
      },
      () => {
        const e = OnePieceTestEngine.create({
          character: mode === "negation" ? ["ST01-011", "OP02-106"] : ["ST01-011"],
          activeDon: 1,
        });
        e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
        expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(
          mode !== "powerWriter" && mode !== "negation",
        );
        if (mode === "powerWriter" || mode === "negation") expect(cost(e)).toBe(0);
      },
    );
  },
);

test("DON power is fixed only for the active seat, then switches on the next turn", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            actions: [
              {
                action: "setBaseCost",
                value: 0,
                target: { ...self, filters: [{ filter: "power", comparison: "gte", value: 4000 }] },
              },
            ],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create(
        { character: [{ card: getCard("ST01-011"), attachedDon: 1 }], activeDon: 1 },
        { character: [{ card: getCard("ST01-011"), attachedDon: 1 }], activeDon: 1 },
      );
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(cost(e)).toBe(0);
      expect(cost(e, "north")).toBe(2);
      e.asSouth().endTurn();
      e.asNorth().attachDon(e.findCardInZone("north", "character", "ST01-011"), 1);
      expect(cost(e)).toBe(2);
      expect(cost(e, "north")).toBe(0);
      expect(e.getView("north").prompts).toHaveLength(0);
    },
  );
});

test("source removal and replay rebuild its base-cost contribution", () => {
  fixture(
    {
      "ST02-002": {
        permanentEffects: [{ actions: [{ action: "setBaseCost", value: 0, target: brook }] }],
      },
      "EB01-005": {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "returnToHand",
                target: { ...brook, filters: [{ filter: "name", value: "Vito" }] },
              },
            ],
          },
        ],
      },
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["ST02-002", "ST01-011", "EB01-005"],
        activeDon: 3,
      });
      expect(cost(e)).toBe(0);
      e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
      expect(cost(e)).toBe(2);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().play("ST02-002");
      expect(cost(e)).toBe(0);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("hand self base-cost settings participate before public play", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          { actions: [{ action: "setBaseCost", value: 0, target: { ...self, zones: ["hand"] } }] },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ hand: ["ST01-011"], activeDon: 0 });
      expect(e.getView("south").players.south.hand[0]?.cost).toBe(0);
      e.asSouth().play("ST01-011");
      expect(cost(e)).toBe(2);
    },
  );
});

test.each([0, 1])(
  "base-cost predicates read provisional order and saved settled bases (%i)",
  (first) => {
    const card = getCard("ST01-011");
    if (card.cardType !== "character") throw Error("Expected Character");
    const printed = card.cost;
    card.cost = 6;
    try {
      fixture(
        {
          "ST01-011": {
            permanentEffects: [
              {
                conditions: [{ condition: "donAttached", amount: 1 }],
                actions: [{ action: "setBaseCost", value: 2, target: self }],
              },
              {
                conditions: [{ condition: "donAttached", amount: 1 }],
                actions: [
                  {
                    action: "modifyCost",
                    value: 2,
                    target: {
                      ...self,
                      filters: [
                        {
                          filter: "anyOf",
                          filters: [
                            { filter: "baseCost", comparison: "gte", value: 3 },
                            { filter: "cost", comparison: "gte", value: 3 },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
            effects: [
              {
                trigger: "activateMain",
                actions: [
                  {
                    action: "modifyPower",
                    target: {
                      ...self,
                      filters: [{ filter: "baseCost", comparison: "eq", value: 2 }],
                    },
                    value: 1000,
                    duration: "thisTurn",
                  },
                ],
              },
            ],
          },
        },
        () => {
          let e = OnePieceTestEngine.create({ character: [card], activeDon: 1 });
          const id = e.findCardInZone("south", "character", card);
          e.asSouth().attachDon(id, 1);
          const step = e.pendingDecision("continuousCostOrder", "south").steps[0];
          if (step?.kind !== "chooseOption") throw Error("Expected numeric order");
          const optionId = step.options[first]!.id;
          e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
          e.resolveDecision("continuousCostOrder", { optionId }, "south");
          expect(cost(e)).toBe(first === 0 ? 2 : 4);
          e.asSouth().activateMain(id);
          expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
          expect(cost(e)).toBe(first === 0 ? 2 : 4);
          expect(e.getView("south").prompts).toHaveLength(0);
        },
      );
    } finally {
      card.cost = printed;
    }
  },
);

test.each([false, true])(
  "an irrelevant setter preserves existing resolved-power stages (setter=%s)",
  (includeSetter) => {
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              conditions: [{ condition: "donAttached", amount: 1 }],
              actions: [
                {
                  action: "modifyCost",
                  value: 2,
                  target: {
                    ...self,
                    filters: [
                      {
                        filter: "anyOf",
                        filters: [
                          { filter: "power", comparison: "lte", value: 4000 },
                          { filter: "cost", comparison: "gte", value: 4 },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        "EB01-005": {
          effects: [
            {
              trigger: "activateMain",
              actions: [
                { action: "modifyPower", target: brook, value: 1000, duration: "thisTurn" },
              ],
            },
          ],
          permanentEffects: includeSetter
            ? [
                {
                  actions: [
                    {
                      action: "setBaseCost",
                      target: {
                        ...self,
                        filters: [{ filter: "power", comparison: "gte", value: 99000 }],
                      },
                      value: 0,
                    },
                  ],
                },
              ]
            : [],
        },
      },
      () => {
        const e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"], activeDon: 1 });
        e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
        e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
        expect(cost(e)).toBe(4);
        expect(e.getView("south").prompts).toHaveLength(0);
      },
    );
  },
);

test("legacy snapshots without base-cost maps settle from empty contributions", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            conditions: [{ condition: "donAttached", amount: 1 }],
            actions: [{ action: "setBaseCost", value: 0, target: self }],
          },
        ],
      },
    },
    () => {
      let e = OnePieceTestEngine.create({ character: ["ST01-011"], activeDon: 1 });
      // Explicit old-save compatibility fixture; no base setting is active yet.
      const snapshot = e.getState();
      const old: typeof snapshot = JSON.parse(JSON.stringify(snapshot));
      if (old.continuousCosts) {
        delete old.continuousCosts.baseCostContributions;
        delete old.continuousCosts.baseCostValues;
      }
      e = OnePieceTestEngine.fromState(old);
      e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
      expect(cost(e)).toBe(0);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("a hand self-discount does not activate its sibling field power setter", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            actions: [
              {
                action: "setBaseCost",
                value: 0,
                target: { ...self, filters: [{ filter: "power", comparison: "gte", value: 4000 }] },
              },
            ],
          },
        ],
      },
      "EB01-005": {
        permanentEffects: [
          {
            actions: [
              { action: "modifyCost", target: { ...self, zones: ["hand"] }, value: -1 },
              {
                action: "setBasePower",
                target: {
                  ...brook,
                  filters: [...brook.filters!, { filter: "cost", comparison: "gte", value: 0 }],
                },
                value: 1000,
              },
            ],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["ST01-011"],
        hand: ["EB01-005"],
        activeDon: 1,
      });
      e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
      expect(cost(e)).toBe(0);
      expect(e.getView("south").players.south.hand[0]?.cost).toBe(0);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("a returned target loses its DON and cannot retain its earlier base setting", () => {
  fixture(
    {
      "ST02-002": {
        permanentEffects: [
          {
            actions: [
              {
                action: "setBaseCost",
                value: 0,
                target: {
                  ...brook,
                  filters: [...brook.filters!, { filter: "power", comparison: "gte", value: 4000 }],
                },
              },
            ],
          },
        ],
      },
      "EB01-005": {
        effects: [
          { trigger: "activateMain", actions: [{ action: "returnToHand", target: brook }] },
        ],
      },
      "ST01-011": {},
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["ST02-002", "ST01-011", "EB01-005"],
        activeDon: 3,
      });
      const target = e.findCardInZone("south", "character", "ST01-011");
      e.asSouth().attachDon(target, 1);
      expect(cost(e)).toBe(0);
      e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().play("ST01-011");
      expect(cost(e)).toBe(2);
      expect(
        e.getView("south").players.south.characters.find((c) => c?.cardId === "ST01-011")?.power,
      ).toBe(3000);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

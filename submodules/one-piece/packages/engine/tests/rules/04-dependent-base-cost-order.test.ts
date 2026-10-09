import { getCard } from "@tcg/op-cards";
import type { Action, CardEffects, Condition, Target } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

const self: Target = { player: "self", zones: ["character"], self: true, count: { amount: 1 } };
const domaInPlay: Condition = {
  condition: "hasCard",
  player: "self",
  zone: "character",
  filters: [{ filter: "name", value: "Doma" }],
};
const cases: Array<{
  read: "cost" | "baseCost" | "power";
  threshold: number;
  upstream: Extract<Action, { action: "modifyCost" | "modifyPower" | "setBaseCost" }>;
}> = [
  { read: "cost", threshold: 4, upstream: { action: "modifyCost", target: self, value: 1 } },
  { read: "baseCost", threshold: 4, upstream: { action: "setBaseCost", target: self, value: 4 } },
  {
    read: "power",
    threshold: 6000,
    upstream: { action: "modifyPower", target: self, value: 1000, duration: "permanent" },
  },
];

// Synthetic native effects, not printed Brook/Vito/Doma abilities. CR8-1-3-3-5
// repeats permanent processing until stable. Only Vito's value is read, so
// Brook's base-cost setting cannot alter its own eligibility (CR4-9-2-2).
test.each(
  cases.flatMap((scenario) =>
    (["south", "north"] as const).flatMap((seat) =>
      [false, true].map((mixed) => ({ ...scenario, seat, mixed })),
    ),
  ),
)(
  "an acyclic $read dependency settles after public play for $seat (mixed=$mixed)",
  ({ read, threshold, upstream, seat, mixed }) => {
    const brook = getCard("ST01-011");
    const vito = getCard("ST02-002");
    const doma = getCard("EB01-005");
    if (brook.cardType !== "character" || vito.cardType !== "character")
      throw Error("Expected Characters");
    const beforeBrook = { cost: brook.cost, effects: brook.effects };
    const beforeVito = { cost: vito.cost, power: vito.power, effects: vito.effects };
    const beforeDoma = doma.effects;
    try {
      brook.cost = 6;
      vito.cost = 3;
      vito.power = 5000;
      doma.effects = {};
      brook.effects = {
        permanentEffects: [
          {
            conditions: [
              domaInPlay,
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  { filter: "name", value: "Vito" },
                  { filter: read, comparison: "gte", value: threshold },
                ],
              },
            ],
            actions: [{ action: "setBaseCost", target: self, value: 2 }],
          },
        ],
      };
      vito.effects = { permanentEffects: [{ conditions: [domaInPlay], actions: [upstream] }] };
      const board = {
        character: mixed ? [brook, vito, "OP17-112", "OP17-107"] : [brook, vito],
        hand: [doma],
        activeDon: 1,
      };
      const opponent = mixed
        ? { leaderCardId: "OP04-039", character: ["OP15-092", "OP14-053"], trash: 30 }
        : {};
      let e = OnePieceTestEngine.create(
        seat === "south" ? board : opponent,
        seat === "north" ? board : opponent,
        { activeSeat: seat },
      );
      expect(e.getView(seat).players[seat].characters[0]?.cost).toBe(6);
      (seat === "south" ? e.asSouth() : e.asNorth()).play(doma);
      expect(e.getView("judge").prompts).toHaveLength(0);
      expect(e.getView(seat).players[seat].characters[0]?.cost).toBe(2);
      expect(e.getView(seat).players[seat].characters[1]).toMatchObject(
        read === "power" ? { cost: 3, power: 6000 } : { cost: 4, power: 5000 },
      );
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      expect(e.getView(seat).players[seat].characters[0]?.cost).toBe(2);
      expect(e.getView(seat).prompts).toHaveLength(0);
      if (mixed) {
        const other = seat === "south" ? "north" : "south";
        expect(e.getView(seat).players[seat].characters[3]?.power).toBe(8000);
        expect(e.getView(seat).players[other].leader.power).toBe(7000);
        expect(e.getView(seat).players[other].characters[1]?.power).toBe(7000);
      }
    } finally {
      Object.assign(brook, beforeBrook);
      Object.assign(vito, beforeVito);
      doma.effects = beforeDoma;
    }
  },
);

function fixture(effects: Record<string, CardEffects>, run: () => void) {
  const saved = Object.entries(effects).map(([id, effects]) => {
    const card = getCard(id);
    const old = card.effects;
    card.effects = effects;
    return { card, old };
  });
  try {
    run();
  } finally {
    for (const { card, old } of saved) card.effects = old;
  }
}
const brookTarget: Target = {
  player: "self",
  zones: ["character"],
  count: { amount: "all" },
  filters: [{ filter: "name", value: "Brook" }],
};
const vitoCost: Condition = {
  condition: "hasCard",
  player: "self",
  zone: "character",
  filters: [
    { filter: "name", value: "Vito" },
    { filter: "cost", comparison: "gte", value: 4 },
  ],
};
const brookCost: Condition = {
  condition: "hasCard",
  player: "self",
  zone: "character",
  filters: [
    { filter: "name", value: "Brook" },
    { filter: "cost", comparison: "lte", value: 2 },
  ],
};

test.each([
  "powerCycle",
  "keywordCycle",
  "attributeBridge",
  "keywordBridge",
  "negationBridge",
  "nestedCycle",
  "unknown",
] as const)("dependent setter keeps unresolved %s explicit", (mode) => {
  const keyword = mode === "keywordCycle" || mode === "keywordBridge";
  const gate: Condition =
    mode === "powerCycle"
      ? {
          condition: "hasCard",
          player: "self",
          zone: "character",
          filters: [
            { filter: "name", value: "Vito" },
            { filter: "power", comparison: "gte", value: 6000 },
          ],
        }
      : mode === "nestedCycle"
        ? { condition: "compound", operator: "or", conditions: [vitoCost, brookCost] }
        : mode === "unknown"
          ? JSON.parse('{"condition":"futureNumericCondition"}')
          : vitoCost;
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            conditions: keyword || mode === "attributeBridge" ? [] : [gate],
            actions: [
              {
                action: "setBaseCost",
                value: 0,
                target: keyword
                  ? { ...self, filters: [{ filter: "hasKeyword", value: "rush" }] }
                  : mode === "attributeBridge"
                    ? { ...self, filters: [{ filter: "attribute", value: "slash" }] }
                    : self,
              },
            ],
          },
        ],
      },
      "ST02-002": {
        permanentEffects: [
          mode === "powerCycle"
            ? {
                conditions: [brookCost],
                actions: [
                  { action: "modifyPower", target: self, value: 1000, duration: "permanent" },
                ],
              }
            : { actions: [{ action: "modifyCost", target: self, value: 1 }] },
        ],
      },
      "EB01-005": {
        permanentEffects: keyword
          ? [
              {
                conditions: [mode === "keywordCycle" ? brookCost : vitoCost],
                actions: [
                  {
                    action: "grantKeyword",
                    keyword: "rush",
                    target: brookTarget,
                    duration: "permanent",
                  },
                ],
              },
            ]
          : mode === "attributeBridge"
            ? [
                {
                  conditions: [vitoCost],
                  actions: [
                    {
                      action: "grantAttribute",
                      value: "slash",
                      target: brookTarget,
                      duration: "permanent",
                    },
                  ],
                },
              ]
            : mode === "negationBridge"
              ? [
                  {
                    conditions: [vitoCost],
                    actions: [
                      { action: "negateEffects", target: brookTarget, duration: "permanent" },
                    ],
                  },
                ]
              : [],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["ST01-011", "ST02-002", "EB01-005"],
        activeDon: 1,
      });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
    },
  );
});

test.each(["unrelated", "fixed"] as const)(
  "%s keyword grants do not cause blanket rejection",
  (kind) => {
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              conditions: kind === "unrelated" ? [vitoCost] : [],
              actions: [
                {
                  action: "setBaseCost",
                  value: 0,
                  target:
                    kind === "fixed"
                      ? { ...self, filters: [{ filter: "hasKeyword", value: "rush" }] }
                      : self,
                },
              ],
            },
          ],
        },
        "ST02-002": {
          permanentEffects: [{ actions: [{ action: "modifyCost", target: self, value: 1 }] }],
        },
        "EB01-005": {
          permanentEffects: [
            {
              conditions: kind === "unrelated" ? [vitoCost] : [],
              actions: [
                {
                  action: "grantKeyword",
                  keyword: "rush",
                  target: kind === "unrelated" ? self : brookTarget,
                  duration: "permanent",
                },
              ],
            },
          ],
        },
      },
      () => {
        const e = OnePieceTestEngine.create({
          character: ["ST01-011", "ST02-002", "EB01-005"],
          activeDon: 1,
        });
        e.asSouth().attachDon(e.leader("south"), 1);
        expect(e.getView("south").players.south.characters[0]?.cost).toBe(0);
        expect(e.getView("south").prompts).toHaveLength(0);
      },
    );
  },
);

test.each([0, 1])(
  "downstream additive self-dependency retains order and saved history (%i)",
  (first) => {
    const brook = getCard("ST01-011");
    if (brook.cardType !== "character") throw Error("Expected Character");
    const printed = brook.cost;
    brook.cost = 6;
    try {
      fixture(
        {
          "ST01-011": {
            permanentEffects: [
              {
                conditions: [domaInPlay, vitoCost],
                actions: [{ action: "setBaseCost", target: self, value: 2 }],
              },
              {
                conditions: [domaInPlay],
                actions: [
                  {
                    action: "modifyCost",
                    target: { ...self, filters: [{ filter: "cost", comparison: "gte", value: 3 }] },
                    value: 2,
                  },
                ],
              },
            ],
            effects: [
              { trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] },
            ],
          },
          "ST02-002": {
            permanentEffects: [
              {
                conditions: [domaInPlay],
                actions: [{ action: "modifyCost", target: self, value: 1 }],
              },
            ],
          },
          "EB01-005": {},
        },
        () => {
          let e = OnePieceTestEngine.create({
            character: ["ST01-011", "ST02-002"],
            hand: ["EB01-005"],
            activeDon: 1,
          });
          e.asSouth().play("EB01-005");
          const brookId = e.findCardInZone("south", "character", brook);
          const vitoId = e.findCardInZone("south", "character", "ST02-002");
          let step = e.pendingDecision("continuousCostOrder", "south").steps[0];
          if (step?.kind !== "chooseOption") throw Error("Expected numeric order");
          const upstream = step.options.find((o) => o.targetId === vitoId);
          if (upstream)
            e.resolveDecision("continuousCostOrder", { optionId: upstream.id }, "south");
          step = e.pendingDecision("continuousCostOrder", "south").steps[0];
          if (step?.kind !== "chooseOption") throw Error("Expected downstream order");
          const optionId = step.options.filter((o) => o.targetId === brookId)[first]!.id;
          e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
          e.resolveDecision("continuousCostOrder", { optionId }, "south");
          expect(e.getView("south").players.south.characters[0]?.cost).toBe(first === 0 ? 2 : 4);
          e.asSouth().activateMain(brookId);
          expect(e.getView("south").players.south.characters[0]?.cost).toBe(first === 0 ? 2 : 4);
          expect(e.getView("south").prompts).toHaveLength(0);
        },
      );
    } finally {
      brook.cost = printed;
    }
  },
);

test("an immutable false action gate excludes feedback until the turn changes", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            actions: [
              {
                action: "setBaseCost",
                value: 0,
                target: { ...self, filters: [{ filter: "cost", comparison: "gte", value: 1 }] },
                condition: { condition: "turn", value: "opponent" },
              },
            ],
          },
          { conditions: [vitoCost], actions: [{ action: "setBaseCost", value: 1, target: self }] },
        ],
      },
      "ST02-002": {
        permanentEffects: [{ actions: [{ action: "modifyCost", value: 1, target: self }] }],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011", "ST02-002"], activeDon: 1 });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(1);
      e.asSouth().endTurn();
      expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
    },
  );
});

test.each(["action", "zoneCount", "zoneValueTotal", "compound"] as const)(
  "typed %s gate reads only the scoped upstream card",
  (kind) => {
    const condition: Condition =
      kind === "zoneCount"
        ? {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            filters: vitoCost.filters,
            comparison: "gte",
            value: 1,
          }
        : kind === "zoneValueTotal"
          ? {
              condition: "zoneValueTotal",
              player: "self",
              zone: "character",
              filters: [{ filter: "name", value: "Vito" }],
              property: "cost",
              comparison: "gte",
              value: 4,
            }
          : kind === "compound"
            ? {
                condition: "compound",
                operator: "or",
                conditions: [
                  {
                    condition: "hasCard",
                    player: "self",
                    zone: "character",
                    filters: [{ filter: "name", value: "Absent" }],
                  },
                  vitoCost,
                ],
              }
            : vitoCost;
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              conditions: kind === "action" ? [] : [condition],
              actions: [
                {
                  action: "setBaseCost",
                  target: self,
                  value: 0,
                  condition: kind === "action" ? condition : undefined,
                },
              ],
            },
          ],
        },
        "ST02-002": {
          permanentEffects: [{ actions: [{ action: "modifyCost", target: self, value: 1 }] }],
        },
      },
      () => {
        const e = OnePieceTestEngine.create({ character: ["ST01-011", "ST02-002"], activeDon: 1 });
        e.asSouth().attachDon(e.leader("south"), 1);
        expect(e.getView("south").players.south.characters[0]?.cost).toBe(0);
        expect(e.getView("south").prompts).toHaveLength(0);
      },
    );
  },
);

test("payment-only discounts do not write current cost in the dependency graph", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          { conditions: [vitoCost], actions: [{ action: "setBaseCost", target: self, value: 0 }] },
        ],
      },
      "ST02-002": {
        permanentEffects: [
          { actions: [{ action: "modifyCost", target: self, value: 1 }] },
          {
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  { filter: "name", value: "Brook" },
                  { filter: "cost", comparison: "lte", value: 2 },
                ],
              },
            ],
            actions: [{ action: "modifyCost", target: self, value: -2, paymentOnly: true }],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011", "ST02-002"], activeDon: 1 });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("judge").prompts).toHaveLength(0);
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(0);
      expect(e.getView("south").players.south.characters[1]?.cost).toBe(4);
    },
  );
});

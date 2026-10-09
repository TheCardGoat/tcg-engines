import { getCard } from "@tcg/op-cards";
import type { CardEffects, Target } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic native rules program, not printed Brook/Doma abilities.
// CR8-1-3-3-5 orders permanent effects; CR4-9-2-1 picks the highest base setting.
test.each(
  ["none", "north", "linlin", "vista", "baseRead", "field"].flatMap((mixed) => [
    { first: 0, power: 2000, mixed },
    { first: 1, power: 4000, mixed },
  ]),
)(
  "constant base power order $first settles at $power after public play and restore ($mixed)",
  ({ first, power, mixed }) => {
    const seat = mixed === "north" ? "north" : "south";
    const card = getCard("ST01-011");
    const doma = getCard("EB01-005");
    if (card.cardType !== "character") throw Error("Expected Character");
    const saved = { power: card.power, effects: card.effects };
    const domaEffects = doma.effects;
    try {
      card.power = 6000;
      doma.effects = {};
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions:
              mixed === "baseRead"
                ? [
                    {
                      action: "modifyCost",
                      target: {
                        player: "self",
                        zones: ["character"],
                        self: true,
                        count: { amount: 1 },
                        filters: [{ filter: "basePower", comparison: "eq", value: 2000 }],
                      },
                      value: 1,
                      duration: "thisTurn",
                    },
                  ]
                : [{ action: "draw", player: "self", amount: 1 }],
          },
        ],
        permanentEffects: [
          {
            conditions: [
              {
                condition: "zoneCount",
                player: "self",
                zone: "character",
                comparison: "gte",
                value: 1,
                filters: [{ filter: "name", value: "Doma" }],
              },
            ],
            actions: [
              {
                action: "setBasePower",
                target:
                  mixed === "field"
                    ? {
                        player: "self",
                        zones: ["field"],
                        count: { amount: "all" },
                        filters: [{ filter: "name", value: "Brook" }],
                      }
                    : { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
                value: 2000,
              },
            ],
          },
          {
            conditions: [
              {
                condition: "zoneCount",
                player: "self",
                zone: "character",
                comparison: "gte",
                value: 1,
                filters: [{ filter: "name", value: "Doma" }],
              },
            ],
            actions: [
              {
                action: "modifyPower",
                target: {
                  player: "self",
                  zones: ["character"],
                  self: true,
                  count: { amount: 1 },
                  filters:
                    mixed === "baseRead"
                      ? [
                          {
                            filter: "anyOf",
                            filters: [
                              { filter: "basePower", comparison: "gte", value: 3000 },
                              { filter: "power", comparison: "gte", value: 3000 },
                            ],
                          },
                        ]
                      : [{ filter: "power", comparison: "gte", value: 3000 }],
                },
                value: 2000,
                duration: "permanent",
              },
            ],
          },
        ],
      };
      let e =
        mixed === "north"
          ? OnePieceTestEngine.create(
              {},
              { character: [card], hand: [doma], activeDon: 1 },
              { activeSeat: "north" },
            )
          : OnePieceTestEngine.create(
              {
                character: mixed === "linlin" ? [card, "OP17-112", "OP17-107", "OP13-084"] : [card],
                hand: [doma],
                activeDon: 1,
                trash: mixed === "linlin" ? 10 : 0,
              },
              mixed === "linlin"
                ? { character: ["OP15-070", "OP15-071"] }
                : mixed === "vista"
                  ? { leaderCardId: "OP04-039", character: ["OP15-092", "OP14-053"], trash: 30 }
                  : {},
            );
      expect(e.getView("south").players[seat].characters[0]?.power).toBe(6000);
      (seat === "south" ? e.asSouth() : e.asNorth()).play(doma);
      const step = e.pendingDecision("continuousCostOrder", seat).steps[0];
      if (step?.kind !== "chooseOption") throw Error("Expected numeric order choice");
      const id = e.findCardInZone(seat, "character", card);
      const options = step.options.filter((option) => option.targetId === id);
      expect(options).toHaveLength(2);
      const optionId = options[first]!.id;
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("continuousCostOrder", { optionId }, seat);
      expect(e.getView("south").players[seat].characters[0]?.power).toBe(power);
      expect(e.getView("south").prompts).toHaveLength(0);
      (seat === "south" ? e.asSouth() : e.asNorth()).activateMain(id);
      expect(e.getView("south").players[seat].characters[0]?.power).toBe(power);
      expect(e.getView("south").prompts).toHaveLength(0);
      if (mixed === "baseRead")
        expect(e.getView("south").players[seat].characters[0]?.cost).toBe(3);
      if (mixed === "linlin") {
        expect(e.getView("south").players[seat].characters[2]?.power).toBe(8000);
        expect(e.getView("south").players[seat].characters[3]?.power).toBe(7000);
        expect(
          e
            .getView("south")
            .players.north.characters.slice(0, 2)
            .map((c) => c?.power),
        ).toEqual([6000, 6000]);
      }
      if (mixed === "vista") {
        expect(e.getView("south").players.north.leader.power).toBe(7000);
        expect(
          e
            .getView("south")
            .players.north.characters.slice(0, 2)
            .map((c) => c?.power),
        ).toEqual([10000, 7000]);
      }
    } finally {
      Object.assign(card, saved);
      doma.effects = domaEffects;
    }
  },
);

const self: Target = { player: "self", zones: ["character"], self: true, count: { amount: 1 } };
const brook: Target = {
  player: "self",
  zones: ["character"],
  count: { amount: "all" },
  filters: [{ filter: "name", value: "Brook" }],
};
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
function power(e: OnePieceTestEngine) {
  return e.getView("south").players.south.characters.find((c) => c?.cardId === "ST01-011")?.power;
}

test.each([
  { base: -2000, add: 1000, expected: -1000 },
  { base: 0, add: 1000, expected: 1000 },
  { base: 6000, add: -1000, expected: 5000 },
])("base $base and additive $add retain signed power", ({ base, add, expected }) => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            actions: [
              { action: "setBasePower", target: self, value: base },
              { action: "modifyPower", target: self, value: add, duration: "permanent" },
            ],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011"], activeDon: 1 });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(power(e)).toBe(expected);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("highest permanent/resolved setting and staged resolved addition expire normally", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            actions: [
              { action: "setBasePower", target: self, value: 2000 },
              { action: "setBasePower", target: self, value: 4000 },
            ],
          },
        ],
      },
      "EB01-005": {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              { action: "setBasePower", target: brook, value: 5000, duration: "thisTurn" },
              { action: "modifyPower", target: brook, value: 1000, duration: "thisTurn" },
            ],
          },
        ],
      },
    },
    () => {
      let e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"] });
      expect(power(e)).toBe(4000);
      e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      expect(power(e)).toBe(6000);
      e.asSouth().endTurn();
      expect(power(e)).toBe(4000);
    },
  );
});

test("duplicate physical setters keep independent DON eligibility and generation", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            conditions: [{ condition: "donAttached", amount: 1 }],
            actions: [{ action: "setBasePower", target: self, value: 6000 }],
          },
        ],
      },
      "EB01-005": {
        effects: [
          { trigger: "activateMain", actions: [{ action: "returnToHand", target: brook }] },
        ],
      },
    },
    () => {
      let e = OnePieceTestEngine.create({
        character: ["ST01-011", "ST01-011", "EB01-005"],
        activeDon: 3,
      });
      const first = e.findCardInZone("south", "character", "ST01-011");
      e.asSouth().attachDon(first, 1);
      expect(
        e
          .getView("south")
          .players.south.characters.slice(0, 2)
          .map((c) => c?.power),
      ).toEqual([7000, 3000]);
      e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().play("ST01-011");
      expect(power(e)).toBe(3000);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});

test("source departure removes its setting and a replay restores it", () => {
  fixture(
    {
      "ST02-002": {
        permanentEffects: [{ actions: [{ action: "setBasePower", target: brook, value: 6000 }] }],
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
      const e = OnePieceTestEngine.create({
        character: ["ST01-011", "ST02-002", "EB01-005"],
        activeDon: 3,
      });
      expect(power(e)).toBe(6000);
      e.asSouth().activateMain(e.findCardInZone("south", "character", "EB01-005"));
      expect(power(e)).toBe(3000);
      e.asSouth().play("ST02-002");
      expect(power(e)).toBe(6000);
    },
  );
});

test.each(["direct", "keyword", "attribute", "negation", "nestedOr"] as const)(
  "connected legacy feedback through %s is not frozen",
  (bridge) => {
    const daifuku: Target = {
      player: "self",
      zones: ["character"],
      count: { amount: "all" },
      filters: [{ filter: "name", value: "Charlotte Daifuku" }],
    };
    const legacyTarget: Target = {
      ...daifuku,
      filters: [
        ...daifuku.filters!,
        bridge === "keyword"
          ? { filter: "hasKeyword", value: "rush" }
          : bridge === "attribute"
            ? { filter: "attribute", value: "slash" }
            : { filter: "basePower", comparison: "eq", value: 4000 },
      ],
    };
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            {
              actions: [
                {
                  action: "setBasePower",
                  value: 2000,
                  target: bridge === "direct" || bridge === "nestedOr" ? daifuku : self,
                },
              ],
            },
          ],
        },
        "EB01-005": {
          permanentEffects: [
            {
              actions: [
                {
                  action: "setBasePower",
                  value: 8000,
                  target:
                    bridge === "nestedOr"
                      ? {
                          ...legacyTarget,
                          filters: [
                            {
                              filter: "anyOf",
                              groups: [
                                [{ filter: "name", value: "Brook" }],
                                [{ filter: "basePower", comparison: "eq", value: 4000 }],
                              ],
                            },
                          ],
                        }
                      : legacyTarget,
                },
              ],
            },
            ...(bridge === "keyword" || bridge === "attribute" || bridge === "negation"
              ? [
                  {
                    conditions: [
                      {
                        condition: "hasCard" as const,
                        player: "self" as const,
                        zone: "character" as const,
                        filters: [
                          { filter: "name" as const, value: "Brook" },
                          { filter: "power" as const, comparison: "gte" as const, value: 1000 },
                        ],
                      },
                    ],
                    actions: [
                      bridge === "keyword"
                        ? {
                            action: "grantKeyword" as const,
                            target: daifuku,
                            keyword: "rush" as const,
                            duration: "permanent" as const,
                          }
                        : bridge === "attribute"
                          ? {
                              action: "grantAttribute" as const,
                              target: daifuku,
                              value: "slash" as const,
                              duration: "permanent" as const,
                            }
                          : {
                              action: "negateEffects" as const,
                              target: self,
                              duration: "permanent" as const,
                            },
                    ],
                  },
                ]
              : []),
          ],
        },
      },
      () => {
        const e = OnePieceTestEngine.create({
          character: ["ST01-011", "EB01-005", "OP17-107"],
          activeDon: 1,
        });
        e.asSouth().attachDon(e.leader("south"), 1);
        expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
      },
    );
  },
);

test("old saved numeric states without base-power maps default to empty", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            conditions: [{ condition: "donAttached", amount: 1 }],
            actions: [{ action: "setBasePower", target: self, value: 6000 }],
          },
        ],
      },
    },
    () => {
      let e = OnePieceTestEngine.create({ character: ["ST01-011"], activeDon: 1 });
      const old: ReturnType<typeof e.getState> = JSON.parse(JSON.stringify(e.getState()));
      if (old.continuousCosts) {
        delete old.continuousCosts.basePowerContributions;
        delete old.continuousCosts.basePowerValues;
      }
      e = OnePieceTestEngine.fromState(old);
      e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-011"), 1);
      expect(power(e)).toBe(7000);
      e.asSouth().endTurn();
      expect(power(e)).toBe(6000);
    },
  );
});

test("unknown nested target predicates cannot certify legacy isolation", () => {
  // Boundary fixture for a future native discriminator, not valid printed text.
  const unknown: Target = JSON.parse(
    JSON.stringify({
      ...brook,
      filters: [
        {
          filter: "anyOf",
          groups: [[{ filter: "name", value: "Missing" }], [{ filter: "futureNumericPredicate" }]],
        },
      ],
    }),
  );
  fixture(
    {
      "ST01-011": {
        permanentEffects: [{ actions: [{ action: "setBasePower", target: self, value: 2000 }] }],
      },
      "EB01-005": {
        permanentEffects: [{ actions: [{ action: "setBasePower", target: unknown, value: 8000 }] }],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"], activeDon: 1 });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
    },
  );
});

test.each(["sourceTotal", "targetOptional"] as const)(
  "a qualified Leader copy is not admitted as a deterministic bare copy: %s",
  (qualifier) => {
    const leader: Target = { player: "self", zones: ["leader"], count: { amount: 1 } };
    fixture(
      {
        "ST01-011": {
          permanentEffects: [
            { actions: [{ action: "setBasePower", target: leader, value: 7000 }] },
          ],
        },
        "EB01-005": {
          permanentEffects: [
            {
              actions: [
                {
                  action: "setBasePowerFrom",
                  target:
                    qualifier === "targetOptional"
                      ? { ...self, count: { amount: 1, upTo: true } }
                      : self,
                  source:
                    qualifier === "sourceTotal"
                      ? {
                          ...leader,
                          totalConstraint: { property: "power", comparison: "gte", value: 6000 },
                        }
                      : leader,
                  duration: "permanent",
                },
              ],
            },
          ],
        },
      },
      () => {
        const e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"], activeDon: 1 });
        e.asSouth().attachDon(e.leader("south"), 1);
        expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
      },
    );
  },
);

test("an unrelated ordered setter does not admit previously unsupported current-power feedback", () => {
  fixture(
    {
      "ST01-011": {
        permanentEffects: [{ actions: [{ action: "setBasePower", target: self, value: 2000 }] }],
      },
      "EB01-005": {
        permanentEffects: [
          {
            actions: [
              {
                action: "setBasePower",
                target: { ...self, filters: [{ filter: "power", comparison: "gte", value: 3000 }] },
                value: 1000,
              },
            ],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["ST01-011", "EB01-005"], activeDon: 1 });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
    },
  );
});

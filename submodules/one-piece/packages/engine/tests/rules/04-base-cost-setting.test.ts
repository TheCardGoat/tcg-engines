import { getCard } from "@tcg/op-cards";
import type { Action, CardEffects, Target } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic native-grammar fixtures for CR4-9-2-2, not printed card abilities.
const brook: Target = {
  player: "self",
  zones: ["character"],
  count: { amount: "all" },
  filters: [{ filter: "name", value: "Brook" }],
};
const self: Target = { player: "self", zones: ["character"], self: true, count: { amount: 1 } };
function main(actions: Action[]): CardEffects {
  return { effects: [{ trigger: "activateMain", actions }] };
}
function fixture(effects: Record<string, CardEffects>, run: () => void) {
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
function activate(e: OnePieceTestEngine, id = "EB01-005") {
  e.asSouth().activateMain(e.findCardInZone("south", "character", id));
}
function target(e: OnePieceTestEngine) {
  return e.getView("south").players.south.characters.find((c) => c?.cardId === "ST01-011");
}

test("base setting plus additive cost differs from absolute current-cost setting", () =>
  fixture(
    {
      "EB01-005": main([
        { action: "setBaseCost", target: brook, value: 4 },
        { action: "modifyCost", target: brook, value: -1, duration: "thisTurn" },
      ]),
      "ST02-002": main([
        { action: "setCost", target: brook, value: 0 },
        {
          action: "modifyPower",
          target: {
            ...brook,
            filters: [...brook.filters!, { filter: "baseCost", comparison: "eq", value: 4 }],
          },
          value: 1000,
          duration: "thisTurn",
        },
      ]),
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["EB01-005", "ST02-002", "ST01-011"] });
      activate(e);
      expect(target(e)?.cost).toBe(3);
      activate(e, "ST02-002");
      expect(target(e)).toMatchObject({ cost: 0, power: 4000 });
      e.asSouth().endTurn();
      expect(target(e)).toMatchObject({ cost: 0, power: 3000 });
    },
  ));

test.each([
  [4, 1],
  [1, 4],
])("highest resolved base setter wins in order %i then %i", (first, second) =>
  fixture(
    {
      "EB01-005": main([
        { action: "setBaseCost", target: brook, value: first },
        { action: "setBaseCost", target: brook, value: second },
      ]),
    },
    () => {
      let e = OnePieceTestEngine.create({ character: ["EB01-005", "ST01-011"] });
      activate(e);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      expect(target(e)?.cost).toBe(4);
      e.asSouth().endTurn();
      expect(target(e)?.cost).toBe(2);
    },
  ),
);

test("printed cost does not compete with a lower base setter", () =>
  fixture({ "EB01-005": main([{ action: "setBaseCost", target: brook, value: 0 }]) }, () => {
    const e = OnePieceTestEngine.create({ character: ["EB01-005", "ST01-011"] });
    activate(e);
    expect(target(e)?.cost).toBe(0);
    e.asSouth().endTurn();
    expect(target(e)?.cost).toBe(2);
  }));

test("negative base remains raw in arithmetic while base filters observe zero", () =>
  fixture(
    {
      "EB01-005": main([
        { action: "setBaseCost", target: brook, value: -2 },
        { action: "modifyCost", target: brook, value: 3, duration: "thisTurn" },
        {
          action: "modifyPower",
          target: {
            ...brook,
            filters: [...brook.filters!, { filter: "baseCost", comparison: "eq", value: 0 }],
          },
          value: 1000,
          duration: "thisTurn",
        },
      ]),
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["EB01-005", "ST01-011"] });
      activate(e);
      expect(target(e)).toMatchObject({ cost: 1, power: 4000 });
      e.asSouth().endTurn();
      expect(target(e)).toMatchObject({ cost: 2, power: 3000 });
    },
  ));

test("permanent and resolved setters compete; source removal leaves the resolved setting", () =>
  fixture(
    {
      "ST02-002": {
        permanentEffects: [{ actions: [{ action: "setBaseCost", target: brook, value: 4 }] }],
      },
      "EB01-005": main([
        { action: "setBaseCost", target: brook, value: 3 },
        {
          action: "ko",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: "all" },
            filters: [{ filter: "name", value: "Vito" }],
          },
        },
      ]),
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["EB01-005", "ST01-011", "ST02-002"] });
      expect(target(e)?.cost).toBe(4);
      activate(e);
      expect(target(e)?.cost).toBe(3);
      expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
      e.asSouth().endTurn();
      expect(target(e)?.cost).toBe(2);
    },
  ));

test("resolved setting survives source removal but not target leaving and replay", () =>
  fixture(
    {
      "EB01-005": main([
        { action: "setBaseCost", target: brook, value: 1, duration: "permanent" },
        { action: "ko", target: self },
      ]),
      "ST02-002": main([{ action: "returnToHand", target: brook }]),
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005", "ST01-011", "ST02-002"],
        activeDon: 2,
      });
      const id = e.findCardInZone("south", "character", "ST01-011");
      activate(e);
      expect(target(e)?.cost).toBe(1);
      activate(e, "ST02-002");
      expect(e.getView("south").players.south.hand.find((c) => c.instanceId === id)?.cost).toBe(2);
      e.asSouth().play("ST01-011");
      expect(target(e)).toMatchObject({ instanceId: id, cost: 2 });
    },
  ));

const eventHand: Target = {
  player: "self",
  zones: ["hand"],
  count: { amount: "all" },
  filters: [{ filter: "cardCategory", value: "event" }],
};
test.each(
  (["main", "counter", "effect"] as const).flatMap((mode) =>
    [false, true].map((dynamic) => ({ mode, dynamic })),
  ),
)(
  "$mode Event activation keeps base-cost snapshots separate from live dynamic cost ($dynamic)",
  ({ mode, dynamic }) =>
    fixture(
      {
        "EB01-005": {
          effects: [
            {
              trigger: "activateMain",
              actions: [
                { action: "setBaseCost", target: eventHand, value: 4, duration: "permanent" },
                ...(mode === "effect"
                  ? [
                      {
                        action: "activateEvent" as const,
                        target: eventHand,
                        effectTrigger: "main" as const,
                      },
                    ]
                  : []),
              ],
            },
            {
              trigger: "whenYouActivateEvent",
              eventFilter: {
                filters: [
                  {
                    filter: "anyOf",
                    filters: [{ filter: "baseCost", comparison: "eq", value: 4 }],
                  },
                  ...(dynamic
                    ? [
                        {
                          filter: "dynamicCost" as const,
                          comparison: "gte" as const,
                          source: "selfLifeCount" as const,
                        },
                      ]
                    : []),
                ],
              },
              conditions: [
                { condition: "activatedEvent", baseCost: { comparison: "eq", value: 4 } },
              ],
              actions: [{ action: "draw", player: "self", amount: 1 }],
            },
          ],
        },
        "ST03-017": {
          effects: [
            { trigger: "main", actions: [] },
            { trigger: "counter", actions: [] },
          ],
        },
      },
      () => {
        let e = OnePieceTestEngine.create({
          character: ["EB01-005"],
          hand: ["ST03-017"],
          life: ["EB01-005", "EB01-005", "EB01-005"],
          activeDon: 4,
          deck: ["ST03-004", "EB01-005", "ST01-012"],
        });
        activate(e);
        if (mode !== "effect") expect(e.getView("south").players.south.hand[0]?.cost).toBe(4);
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        if (mode === "main") e.asSouth().play("ST03-017");
        if (mode === "counter") {
          e.asSouth().endTurn();
          e.asNorth().attack(e.leader("north"), e.leader("south"));
          e.asSouth().chooseCounter("ST03-017");
          if (!dynamic) e.asSouth().chooseCounter();
        }
        // After activation the Event is in trash: live cost is 2, while its
        // activation base-cost snapshot remains 4. Life count is 3.
        const handIds = e.getView("south").players.south.hand.map((c) => c.cardId);
        if (dynamic) expect(handIds).not.toContain("ST03-004");
        else expect(handIds).toContain("ST03-004");
        expect(e.getView("south").players.south.deckCount).toBe(dynamic ? 3 : 2);
        expect(
          e.getView("south").players.south.trash.find((c) => c.cardId === "ST03-017")?.cost,
        ).toBe(2);
        expect(e.getView("south").players.south.activeDon).toBe(mode === "effect" ? 4 : 0);
      },
    ),
);

test("self-hand numeric base feedback pauses explicitly at the current capability boundary", () =>
  fixture(
    {
      "ST01-011": {
        permanentEffects: [
          {
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "hand",
                filters: [{ filter: "cost", comparison: "gte", value: 2 }],
              },
            ],
            actions: [
              {
                action: "setBaseCost",
                target: { player: "self", zones: ["hand"], self: true, count: { amount: 1 } },
                value: 1,
              },
            ],
          },
        ],
      },
    },
    () => {
      const e = OnePieceTestEngine.create({ hand: ["ST01-011"], activeDon: 1 });
      e.asSouth().attachDon(e.leader("south"), 1);
      expect(e.getState().continuousCosts?.unsupported).toBe(true);
      expect(e.getView("judge").prompts.some((p) => p.seat === "judge")).toBe(true);
    },
  ));

test("a base setting on a hand card does not follow it through deck and back to hand", () =>
  fixture(
    {
      "EB01-005": main([
        {
          action: "setBaseCost",
          target: { player: "self", zones: ["hand"], count: { amount: "all" } },
          value: 0,
          duration: "permanent",
        },
        {
          action: "returnToDeck",
          target: { player: "self", zones: ["hand"], count: { amount: "all" } },
          position: "top",
        },
        { action: "draw", player: "self", amount: 1 },
      ]),
    },
    () => {
      const e = OnePieceTestEngine.create({
        character: ["EB01-005"],
        hand: ["ST01-011"],
        deck: ["ST03-004", "ST01-012"],
      });
      const id = e.findCardInZone("south", "hand", "ST01-011");
      activate(e);
      expect(e.getView("south").players.south.hand).toMatchObject([{ instanceId: id, cost: 2 }]);
      expect(e.getView("south").players.south.deckCount).toBe(2);
    },
  ));

test("negating a permanent source suspends its base setter until expiry", () =>
  fixture(
    {
      "ST02-002": {
        permanentEffects: [{ actions: [{ action: "setBaseCost", target: brook, value: 4 }] }],
      },
      "EB01-005": main([
        {
          action: "negateEffects",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: "all" },
            filters: [{ filter: "name", value: "Vito" }],
          },
          duration: "thisTurn",
        },
      ]),
    },
    () => {
      const e = OnePieceTestEngine.create({ character: ["EB01-005", "ST02-002", "ST01-011"] });
      expect(target(e)?.cost).toBe(4);
      activate(e);
      expect(target(e)?.cost).toBe(2);
      e.asSouth().endTurn();
      expect(target(e)?.cost).toBe(4);
    },
  ));

test.each([0, 1])("numeric cost ordering uses effective base3 for branch %i", (first) =>
  fixture(
    {
      "EB01-005": main([
        { action: "setBaseCost", target: brook, value: 3 },
        { action: "giveDon", target: brook, count: { amount: 1 }, donState: "rested" },
      ]),
      "ST01-011": {
        permanentEffects: [
          {
            conditions: [{ condition: "donAttached", amount: 1 }],
            actions: [
              {
                action: "modifyCost",
                target: { ...self, filters: [{ filter: "cost", comparison: "gte", value: 3 }] },
                value: 1,
              },
            ],
          },
          {
            conditions: [{ condition: "donAttached", amount: 1 }],
            actions: [
              {
                action: "modifyCost",
                target: { ...self, filters: [{ filter: "cost", comparison: "lte", value: 3 }] },
                value: -1,
              },
            ],
          },
        ],
      },
    },
    () => {
      let e = OnePieceTestEngine.create({ character: ["EB01-005", "ST01-011"], restedDon: 1 });
      activate(e);
      const step = e.pendingDecision("continuousCostOrder", "south").steps[0];
      if (step?.kind !== "chooseOption") throw Error("Expected numeric order");
      const optionId = step.options[first]!.id;
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("continuousCostOrder", { optionId }, "south");
      expect(target(e)).toMatchObject({ cost: first === 0 ? 4 : 2, attachedDon: 1 });
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  ),
);

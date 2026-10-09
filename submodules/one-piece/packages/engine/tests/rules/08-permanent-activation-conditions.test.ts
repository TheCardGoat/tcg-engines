import type { Condition, EffectBlock, Target } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const target: Target = {
  player: "self",
  zones: ["character"],
  count: { amount: "all" },
  filters: [{ filter: "name", value: "Doma" }],
};
const draw: EffectBlock = {
  trigger: "activateMain",
  conditions: [{ condition: "turn", value: "your" }],
  costs: [{ cost: "restDon", amount: 1 }],
  actions: [{ action: "draw", player: "self", amount: 1 }],
};

// Synthetic native rules fixtures: no printed card currently grants these
// permanent requirements. Conditions combine under CR8-3-2-2; these tests
// do not assert an order for permanent added activation costs.
function withPermanentConditions(
  options: {
    qualifying?: Condition[];
    actionCondition?: Condition;
    added: Condition[];
    player?: "self" | "opponent";
    giverEffects?: EffectBlock[];
    recipientEffect?: EffectBlock;
  },
  run: () => void,
) {
  const giver = getCard("ST01-007"),
    recipient = getCard("EB01-005");
  const oldGiver = giver.effects,
    oldRecipient = recipient.effects;
  try {
    giver.effects = {
      permanentEffects: [
        {
          conditions: options.qualifying,
          actions: [
            {
              action: "addActivationConditions",
              target: { ...target, player: options.player ?? "self" },
              conditions: options.added,
              condition: options.actionCondition,
              effectTypes: ["activateMain"],
              duration: "permanent",
            },
          ],
        },
      ],
      effects: options.giverEffects,
    };
    recipient.effects = { effects: [options.recipientEffect ?? draw] };
    run();
  } finally {
    giver.effects = oldGiver;
    recipient.effects = oldRecipient;
  }
}

function rejectDoma(engine: OnePieceTestEngine) {
  const result = engine.expectFailure({
    type: "activateEffect",
    seat: "south",
    trigger: "activateMain",
    sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
  });
  expect(OnePieceTestEngine.fromState(result.state).getView("south").players.south.activeDon).toBe(
    1,
  );
}

test.each([
  { donorHand: 1, recipientHand: 0, allowed: false },
  { donorHand: 1, recipientHand: 2, allowed: true },
  { donorHand: 0, recipientHand: 0, allowed: true },
])("8-3-2-2: donor and recipient condition contexts remain distinct: %j", (fixture) =>
  withPermanentConditions(
    {
      player: "opponent",
      qualifying: [{ condition: "handCount", player: "self", comparison: "eq", value: 1 }],
      added: [{ condition: "handCount", player: "self", comparison: "gte", value: 2 }],
    },
    () => {
      const engine = OnePieceTestEngine.create(
        {
          character: ["EB01-005"],
          activeDon: 1,
          hand: fixture.recipientHand ? ["ST01-002", "ST01-003"] : [],
          deck: ["ST01-004", "ST01-005"],
        },
        { character: ["ST01-007"], hand: fixture.donorHand ? ["ST01-006"] : [] },
      );
      if (!fixture.allowed) {
        rejectDoma(engine);
        expect(engine.getView("south").players.south.hand).toHaveLength(0);
        expect(engine.getView("south").players.south.deckCount).toBe(2);
      } else {
        engine.asSouth().activateMain("EB01-005");
        expect(engine.getView("south").players.south.activeDon).toBe(0);
        expect(engine.getView("south").players.south.hand).toHaveLength(fixture.recipientHand + 1);
        expect(engine.getView("south").players.south.deckCount).toBe(1);
      }
    },
  ),
);

test.each(["removed", "negated"] as const)(
  "permanent condition stops when its provider is %s",
  (mode) =>
    withPermanentConditions(
      {
        added: [{ condition: "handCount", player: "self", comparison: "gte", value: 2 }],
        giverEffects: [
          {
            trigger: "activateMain",
            actions:
              mode === "removed"
                ? [
                    {
                      action: "trashFromField",
                      target: {
                        player: "self",
                        self: true,
                        zones: ["character"],
                        count: { amount: 1 },
                      },
                    },
                  ]
                : [
                    {
                      action: "negateEffects",
                      target: {
                        player: "self",
                        self: true,
                        zones: ["character"],
                        count: { amount: 1 },
                      },
                      duration: "thisTurn",
                    },
                  ],
          },
        ],
      },
      () => {
        const engine = OnePieceTestEngine.create({
          character: ["ST01-007", "EB01-005"],
          activeDon: 1,
          hand: [],
          deck: ["ST01-004", "ST01-005"],
        });
        rejectDoma(engine);
        engine.asSouth().activateMain("ST01-007");
        engine.asSouth().activateMain("EB01-005");
        expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
          "ST01-004",
        ]);
        expect(engine.getView("south").players.south.activeDon).toBe(0);
        expect(engine.getView("south").prompts).toHaveLength(0);
      },
    ),
);

test("permanent, resolved, and printed activation conditions all apply", () =>
  withPermanentConditions(
    {
      added: [{ condition: "handCount", player: "self", comparison: "gte", value: 1 }],
      qualifying: [{ condition: "donAttached", amount: 1 }],
      giverEffects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "addActivationConditions",
              target,
              conditions: [{ condition: "lifeCount", player: "self", comparison: "gte", value: 2 }],
              duration: "thisTurn",
            },
          ],
        },
      ],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        character: ["ST01-007", "EB01-005"],
        activeDon: 2,
        hand: ["ST01-002"],
        life: ["ST01-003"],
        deck: ["ST01-004", "ST01-005"],
      });
      engine.asSouth().attachDon("ST01-007", 1);
      engine.asSouth().activateMain("ST01-007");
      rejectDoma(engine);
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(engine.getView("south").players.south.deckCount).toBe(2);
    },
  ));

test("a saved payment keeps its activated conditions after hand size changes", () =>
  withPermanentConditions(
    {
      added: [{ condition: "handCount", player: "self", comparison: "gte", value: 2 }],
      recipientEffect: {
        trigger: "activateMain",
        costs: [{ cost: "trashFromHand", amount: 1 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    },
    () => {
      let engine = OnePieceTestEngine.create({
        character: ["ST01-007", "EB01-005"],
        hand: ["ST01-002", "ST01-003"],
        deck: ["ST01-004", "ST01-005"],
      });
      engine.asSouth().activateMain("EB01-005");
      engine.pendingDecision("effectCostTrashFromHand", "south");
      const payment = engine.findCardInZone("south", "hand", "ST01-002");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment] }, "south");
      expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-003",
        "ST01-004",
      ]);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  ));

test("an action-level provider gate becomes live without testing the recipient's DON", () =>
  withPermanentConditions(
    {
      actionCondition: { condition: "donAttached", amount: 1 },
      added: [{ condition: "handCount", player: "self", comparison: "gte", value: 2 }],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        character: ["ST01-007", "EB01-005"],
        activeDon: 3,
        hand: [],
        deck: ["ST01-004", "ST01-005", "ST01-006"],
      });
      engine.asSouth().activateMain("EB01-005");
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-004",
      ]);
      engine.asSouth().attachDon("ST01-007", 1);
      rejectDoma(engine);
      expect(engine.getView("south").players.south.deckCount).toBe(2);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  ));

test("a permanent requirement scoped to Activate Main does not block On Play", () =>
  withPermanentConditions(
    {
      added: [{ condition: "handCount", player: "self", comparison: "gte", value: 5 }],
      recipientEffect: {
        trigger: "onPlay",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    },
    () => {
      const engine = OnePieceTestEngine.create({
        character: ["ST01-007"],
        activeDon: 1,
        hand: ["EB01-005"],
        deck: ["ST01-004", "ST01-005"],
      });
      engine.asSouth().play("EB01-005");
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-004",
      ]);
      expect(engine.getView("south").players.south.deckCount).toBe(1);
      expect(engine.getView("south").players.south.activeDon).toBe(0);
    },
  ));

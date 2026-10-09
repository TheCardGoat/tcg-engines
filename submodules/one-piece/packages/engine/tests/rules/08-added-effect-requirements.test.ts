import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { EffectBlock } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const recipient = {
  player: "self",
  zones: ["character"],
  filters: [{ filter: "name", value: "Doma" }],
  count: { amount: 1 },
} as const;

// Synthetic native effects, not a claim about current printed catalog cards.
function withRequirements(grants: EffectBlock[], effect: EffectBlock, run: () => void) {
  const giver = getCard("ST01-007");
  const target = getCard("EB01-005");
  const oldGiver = giver.effects;
  const oldTarget = target.effects;
  try {
    giver.effects = { effects: grants };
    target.effects = { effects: [effect] };
    run();
  } finally {
    giver.effects = oldGiver;
    target.effects = oldTarget;
  }
}

test("8-3-1-2: printed payment precedes added payment and survives a saved cost choice", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              ...recipient,
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
            },
            costs: [{ cost: "trashFromHand", amount: 1 }],
            duration: "thisTurn",
          },
        ],
      },
    ],
    {
      trigger: "activateMain",
      costs: [{ cost: "returnDon", amount: 1 }],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      let engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 2,
        hand: ["ST01-002", "ST01-003"],
        deck: ["ST01-004", "ST01-005"],
      });
      engine.asSouth().activateMain("ST01-007");
      engine.asSouth().activateMain("EB01-005");
      const discarded = engine.findCardInZone("south", "hand", "ST01-002");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discarded] }, "south");
      expect(engine.getView("south").players.south.activeDon).toBe(1);
      expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-003",
        "ST01-004",
      ]);
    },
  ));

test("8-3-1-2: separate added hand payments use distinct saved choices in resolution order", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [{ cost: "trashFromHand", amount: 1 }],
            duration: "thisTurn",
          },
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [
              { cost: "trashFromHand", amount: 1, filters: [{ filter: "name", value: "Karoo" }] },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
    {
      trigger: "activateMain",
      costs: [{ cost: "restDon", amount: 1 }],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      let engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 1,
        hand: ["ST01-002", "ST01-003", "ST01-003", "ST01-004"],
        deck: ["ST01-005", "ST01-006"],
      });
      engine.asSouth().activateMain("ST01-007");
      engine.asSouth().activateMain("EB01-005");
      expect(engine.getView("south").players.south.activeDon).toBe(0);
      const first = engine.findCardInZone("south", "hand", "ST01-002");
      const second = engine.findCardInZone("south", "hand", "ST01-003");
      engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [first] }, "south");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [second] }, "south");
      expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "ST01-002",
        "ST01-003",
      ]);
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-003",
        "ST01-004",
        "ST01-005",
      ]);
    },
  ));

test("8-3-1-2: overlapping added hand payments reject activation before any printed payment", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [
              { cost: "trashFromHand", amount: 1 },
              { cost: "trashFromHand", amount: 1 },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
    {
      trigger: "activateMain",
      costs: [{ cost: "restDon", amount: 1 }],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 1,
        hand: ["ST01-002"],
        deck: ["ST01-005", "ST01-006"],
      });
      engine.asSouth().activateMain("ST01-007");
      const result = engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
        trigger: "activateMain",
      });
      const view = OnePieceTestEngine.fromState(result.state).getView("south");
      expect(view.players.south.activeDon).toBe(1);
      expect(view.players.south.hand.map((card) => card.cardId)).toEqual(["ST01-002"]);
      expect(view.players.south.trash).toHaveLength(0);
    },
  ));

test("8-3-2-2: all added conditions gate activation and expire at the end of the turn", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationConditions",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            conditions: [
              { condition: "donAttached", amount: 1 },
              { condition: "handCount", player: "self", comparison: "gte", value: 1 },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
    { trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] },
    () => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          character: ["ST01-007", "EB01-005"],
          activeDon: 1,
          hand: ["ST01-002"],
          deck: ["ST01-003", "ST01-004", "ST01-005", "ST01-006"],
        },
        { deck: ["ST06-009", "ST06-006"] },
      );
      engine.asSouth().activateMain("ST01-007");
      const doma = engine.findCardInZone("south", "character", "EB01-005");
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: doma,
        trigger: "activateMain",
      });
      engine.asSouth().attachDon(doma, 1);
      engine.asSouth().activateMain(doma);
      expect(engine.getView("south").players.south.hand).toHaveLength(2);
      engine.asSouth().endTurn();
      engine.asNorth().endTurn();
      expect(
        engine.getView("south").players.south.characters.find((card) => card?.instanceId === doma)
          ?.attachedDon,
      ).toBe(0);
      engine.asSouth().activateMain(doma);
      expect(engine.getView("south").players.south.hand).toHaveLength(4);
    },
  ));

test("8-3-1-2: a source trashed by its printed cost still pays the added cost and resolves", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [{ cost: "restDon", amount: 1 }],
            duration: "thisTurn",
          },
        ],
      },
    ],
    {
      trigger: "activateMain",
      costs: [{ cost: "trashThisCard" }],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 1,
        deck: ["ST01-002", "ST01-003"],
      });
      engine.asSouth().activateMain("ST01-007");
      engine.asSouth().activateMain("EB01-005");
      expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
        "EB01-005",
      ]);
      expect(engine.getView("south").players.south.activeDon).toBe(0);
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
    },
  ));

test("8-3-1-2: resting then returning the same DON is affordable, but the reverse order is not", () => {
  for (const restFirst of [true, false])
    withRequirements(
      [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "addActivationCosts",
              target: {
                player: "self",
                zones: ["character"],
                filters: [{ filter: "name", value: "Doma" }],
                count: { amount: 1 },
              },
              costs: [
                restFirst ? { cost: "returnDon", amount: 1 } : { cost: "restDon", amount: 1 },
              ],
              duration: "thisTurn",
            },
          ],
        },
      ],
      {
        trigger: "activateMain",
        costs: [restFirst ? { cost: "restDon", amount: 1 } : { cost: "returnDon", amount: 1 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
      () => {
        const engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: ["ST01-007", "EB01-005"],
          activeDon: 1,
          deck: ["ST01-002", "ST01-003"],
        });
        engine.asSouth().activateMain("ST01-007");
        if (restFirst) {
          engine.asSouth().activateMain("EB01-005");
          expect(engine.getView("south").players.south.activeDon).toBe(0);
          expect(engine.getView("south").players.south.restedDon).toBe(0);
          expect(engine.getView("south").players.south.hand).toHaveLength(1);
        } else {
          const result = engine.expectFailure({
            type: "activateEffect",
            seat: "south",
            sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
            trigger: "activateMain",
          });
          expect(
            OnePieceTestEngine.fromState(result.state).getView("south").players.south.activeDon,
          ).toBe(1);
        }
      },
    );
});

test("8-3-1-2: printed alternatives are paid before the added hand payment", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [{ cost: "trashFromHand", amount: 1 }],
            duration: "thisTurn",
          },
        ],
      },
    ],
    {
      trigger: "activateMain",
      alternativeCosts: [[{ cost: "restDon", amount: 1 }], [{ cost: "returnDon", amount: 1 }]],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 1,
        hand: ["ST01-002", "ST01-003"],
        deck: ["ST01-004", "ST01-005"],
      });
      engine.asSouth().activateMain("ST01-007");
      engine.asSouth().activateMain("EB01-005");
      engine.resolveDecision("effectAlternativeCost", { optionId: "0" }, "south");
      expect(engine.getView("south").players.south.activeDon).toBe(0);
      expect(engine.getView("south").players.south.restedDon).toBe(1);
      engine.resolveDecision(
        "effectCostTrashFromHand",
        { selectedIds: [engine.findCardInZone("south", "hand", "ST01-002")] },
        "south",
      );
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-003",
        "ST01-004",
      ]);
    },
  ));

test("8-3-2-2: added DON conditions qualify an auto effect at attack timing", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationConditions",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            conditions: [{ condition: "donAttached", amount: 1 }],
            effectTypes: ["whenAttacking"],
            duration: "thisTurn",
          },
        ],
      },
    ],
    { trigger: "whenAttacking", actions: [{ action: "draw", player: "self", amount: 1 }] },
    () => {
      for (const attached of [0, 1]) {
        const engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: ["ST01-007", "EB01-005"],
          activeDon: 1,
          deck: ["ST01-002", "ST01-003"],
        });
        engine.asSouth().activateMain("ST01-007");
        if (attached) engine.asSouth().attachDon("EB01-005", 1);
        engine.asSouth().attack("EB01-005", engine.leader("north"));
        expect(engine.getView("south").players.south.hand).toHaveLength(attached);
      }
    },
  ));

test("8-3-1-2: resolved requirements survive the giver leaving but not recipient reentry", () => {
  for (const removeRecipient of [false, true])
    withRequirements(
      [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "addActivationCosts",
              target: {
                player: "self",
                zones: ["character"],
                filters: [{ filter: "name", value: "Doma" }],
                count: { amount: 1 },
              },
              costs: [{ cost: "restDon", amount: 2 }],
              duration: "permanent",
            },
            {
              action: "returnToHand",
              target: removeRecipient
                ? {
                    player: "self",
                    zones: ["character"],
                    filters: [{ filter: "name", value: "Doma" }],
                    count: { amount: 1 },
                  }
                : { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
            },
          ],
        },
      ],
      { trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] },
      () => {
        const engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: ["ST01-007", "EB01-005"],
          activeDon: 1,
          deck: ["ST01-002", "ST01-003"],
        });
        engine.asSouth().activateMain("ST01-007");
        if (removeRecipient) {
          engine.asSouth().play("EB01-005");
          engine.asSouth().activateMain("EB01-005");
          expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
            "ST01-002",
          ]);
        } else {
          const failure = engine.expectFailure({
            type: "activateEffect",
            seat: "south",
            sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
            trigger: "activateMain",
          });
          const view = OnePieceTestEngine.fromState(failure.state).getView("south");
          expect(view.players.south.hand.map((card) => card.cardId)).toEqual(["ST01-007"]);
          expect(view.players.south.activeDon).toBe(1);
        }
      },
    );
});

test("8-3-1-2: Life-to-hand can supply an added hand payment, but the reverse cannot", () => {
  for (const lifeFirst of [true, false])
    withRequirements(
      [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "addActivationCosts",
              target: {
                player: "self",
                zones: ["character"],
                filters: [{ filter: "name", value: "Doma" }],
                count: { amount: 1 },
              },
              costs: [
                lifeFirst
                  ? { cost: "trashFromHand", amount: 1 }
                  : { cost: "addLifeToHand", amount: 1, position: "top" },
              ],
              duration: "thisTurn",
            },
          ],
        },
      ],
      {
        trigger: "activateMain",
        costs: [
          lifeFirst
            ? { cost: "addLifeToHand", amount: 1, position: "top" }
            : { cost: "trashFromHand", amount: 1 },
        ],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
      () => {
        const engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: ["ST01-007", "EB01-005"],
          life: ["ST01-002"],
          deck: ["ST01-003", "ST01-004"],
        });
        engine.asSouth().activateMain("ST01-007");
        if (lifeFirst) {
          engine.asSouth().activateMain("EB01-005");
          expect(engine.getView("south").players.south.lifeCount).toBe(0);
          expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toEqual([
            "ST01-002",
          ]);
          expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
            "ST01-003",
          ]);
        } else {
          const result = engine.expectFailure({
            type: "activateEffect",
            seat: "south",
            sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
            trigger: "activateMain",
          });
          expect(
            OnePieceTestEngine.fromState(result.state).getView("south").players.south.lifeCount,
          ).toBe(1);
        }
      },
    );
});

test("8-3-1-2: invalid explicit hand IDs reject before the printed DON payment", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [{ cost: "trashFromHand", amount: 1 }],
            duration: "thisTurn",
          },
        ],
      },
    ],
    {
      trigger: "activateMain",
      costs: [{ cost: "restDon", amount: 1 }],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 1,
        hand: ["ST01-002"],
        deck: ["ST01-003", "ST01-004"],
      });
      engine.asSouth().activateMain("ST01-007");
      const result = engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
        trigger: "activateMain",
        trashHandIds: [engine.leader("south")],
      });
      const view = OnePieceTestEngine.fromState(result.state).getView("south");
      expect(view.players.south.activeDon).toBe(1);
      expect(view.players.south.hand.map((card) => card.cardId)).toEqual(["ST01-002"]);
      expect(view.players.south.trash).toHaveLength(0);
    },
  ));

test("8-3-2-2: satisfying DON alone does not bypass another added condition", () =>
  withRequirements(
    [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationConditions",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            conditions: [
              { condition: "donAttached", amount: 1 },
              { condition: "handCount", player: "self", comparison: "gte", value: 1 },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
    { trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] },
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST01-007", "EB01-005"],
        activeDon: 1,
        deck: ["ST01-002", "ST01-003"],
      });
      engine.asSouth().activateMain("ST01-007");
      engine.asSouth().attachDon("EB01-005", 1);
      const result = engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: engine.findCardInZone("south", "character", "EB01-005"),
        trigger: "activateMain",
      });
      expect(
        OnePieceTestEngine.fromState(result.state).getView("south").players.south.hand,
      ).toHaveLength(0);
    },
  ));

// A child-process timeout can stop a synchronous combinatorial regression.
const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true };
  return nextResolve(specifier, context);
}`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;

test("8-3-1-2: impossible large hand payments complete under an external watchdog", () => {
  const output = execFileSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--disable-warning=ExperimentalWarning",
      "--import",
      `data:text/javascript,${encodeURIComponent(register)}`,
      fileURLToPath(new URL("./08-added-effect-requirements.fixture.ts", import.meta.url)),
    ],
    { timeout: 8000, encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  expect(JSON.parse(output)).toEqual({ rejected: true, handCount: 40, trashCount: 0, prompts: 0 });
}, 12000);

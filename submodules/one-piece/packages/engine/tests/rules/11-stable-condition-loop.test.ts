import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";
import type { Action, Condition } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { MandatoryLoopDetector } from "../../src/engine/mandatory-loop.ts";
import { stableConditionsMatch } from "../../src/engine/loop-transition.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const target = { player: "self", zones: ["character"], self: true, count: { amount: 1 } } as const;
const actions: Action[] = [
  { action: "setActive", target: { ...target, zones: ["character"] } },
  { action: "rest", target: { ...target, zones: ["character"] } },
];
const gates: Array<{ label: string; yes: Condition; no: Condition }> = [
  {
    label: "name exact",
    yes: { condition: "leaderName", name: "Monkey.D.Luffy" },
    no: { condition: "leaderName", name: "Nami" },
  },
  {
    label: "name includes",
    yes: { condition: "leaderName", name: "Luffy", match: "includes" },
    no: { condition: "leaderName", name: "Nami", match: "includes" },
  },
  {
    label: "trait exact",
    yes: { condition: "leaderTrait", trait: "Straw Hat Crew", match: "exact" },
    no: { condition: "leaderTrait", trait: "Navy", match: "exact" },
  },
  {
    label: "trait includes",
    yes: { condition: "leaderTrait", trait: "Straw Hat", match: "includes" },
    no: { condition: "leaderTrait", trait: "Navy", match: "includes" },
  },
  {
    label: "own hand",
    yes: { condition: "handCount", player: "self", comparison: "eq", value: 1 },
    no: { condition: "handCount", player: "self", comparison: "gt", value: 1 },
  },
  {
    label: "opposing hand",
    yes: { condition: "handCount", player: "opponent", comparison: "lte", value: 1 },
    no: { condition: "handCount", player: "opponent", comparison: "gt", value: 1 },
  },
  {
    label: "own Life",
    yes: { condition: "lifeCount", player: "self", comparison: "gte", value: 2 },
    no: { condition: "lifeCount", player: "self", comparison: "lt", value: 2 },
  },
  {
    label: "opposing Life",
    yes: { condition: "lifeCount", player: "opponent", comparison: "eq", value: 3 },
    no: { condition: "lifeCount", player: "opponent", comparison: "lte", value: 2 },
  },
  {
    label: "active DON default",
    yes: { condition: "activeDonCount", comparison: "eq", value: 2 },
    no: { condition: "activeDonCount", comparison: "lt", value: 2 },
  },
  {
    label: "opposing active DON",
    yes: { condition: "activeDonCount", player: "opponent", comparison: "eq", value: 1 },
    no: { condition: "activeDonCount", player: "opponent", comparison: "gte", value: 2 },
  },
  {
    label: "own field DON",
    yes: { condition: "donFieldCount", player: "self", comparison: "eq", value: 3 },
    no: { condition: "donFieldCount", player: "self", comparison: "gt", value: 3 },
  },
  {
    label: "opposing rested DON",
    yes: {
      condition: "donFieldCount",
      player: "opponent",
      state: "rested",
      comparison: "eq",
      value: 2,
    },
    no: {
      condition: "donFieldCount",
      player: "opponent",
      state: "rested",
      comparison: "lt",
      value: 2,
    },
  },
];

// Synthetic rules fixtures: no catalog infinite rest/ready pair is claimed.
test.each(gates)(
  "stable $label gate declares a loop, restores, stops, and rejects unchanged restart",
  ({ yes, no }) => {
    const card = getCard("EB01-005"),
      saved = card.effects;
    try {
      card.effects = {
        effects: [
          { trigger: "activateMain", actions },
          {
            trigger: "whenBecomesRested",
            eventFilter: { targetSelf: true },
            optional: true,
            conditions: [yes],
            actions,
          },
        ],
      };
      let e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          character: [card],
          hand: ["EB01-025"],
          life: 2,
          activeDon: 2,
          restedDon: 1,
        },
        { hand: ["EB01-025"], life: 3, activeDon: 1, restedDon: 2 },
      );
      const id = e.findCardInZone("south", "character", card);
      e.asSouth().activateMain(id);
      e.asSouth().acceptOptional();
      e.pendingDecision("loopIterations", "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.exec({
        type: "resolvePrompt",
        seat: "south",
        promptId: e.pendingDecision("loopIterations", "south").id,
        iterations: 1000000,
      });
      expect(e.getView("south").status).toBe("active");
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("south").players.south.handCount).toBe(1);
      e.asSouth().activateMain(id);
      expect(
        e.getView("south").logs.some((log) => log.message.includes("cannot be restarted")),
      ).toBe(true);
      card.effects.effects![1]!.conditions = [no];
      const falseGate = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          character: [card],
          hand: ["EB01-025"],
          life: 2,
          activeDon: 2,
          restedDon: 1,
        },
        { hand: ["EB01-025"], life: 3, activeDon: 1, restedDon: 2 },
      );
      falseGate.asSouth().activateMain(falseGate.findCardInZone("south", "character", card));
      expect(falseGate.getView("south").status).toBe("active");
      expect(falseGate.getView("south").prompts).toHaveLength(0);
    } finally {
      card.effects = saved;
    }
  },
);

const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) { if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true }; return nextResolve(specifier, context); }`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;
const fixture = fileURLToPath(new URL("./11-stable-condition-loop.fixture.ts", import.meta.url));
test.each(["mandatory", "finite"])(
  "%s stable-gate cycle has a bounded public result",
  (mode) => {
    const output = execFileSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--disable-warning=ExperimentalWarning",
        "--import",
        `data:text/javascript,${encodeURIComponent(register)}`,
        fixture,
        mode,
      ],
      { timeout: 10000, encoding: "utf8", maxBuffer: 1024 * 1024 },
    );
    expect(JSON.parse(output)).toMatchObject(
      mode === "mandatory"
        ? { status: "finished", finishReason: "draw", prompts: 0 }
        : { status: "active", finishReason: null, hand: 2, deck: 1, prompts: 0 },
    );
  },
  15000,
);

test("the non-turn player's stable gates use its own Leader and resource counts", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "rest",
              target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
            },
          ],
        },
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          optional: true,
          conditions: [
            { condition: "leaderTrait", trait: "Navy", match: "exact" },
            { condition: "handCount", player: "self", comparison: "eq", value: 1 },
            { condition: "lifeCount", player: "opponent", comparison: "eq", value: 2 },
          ],
          actions,
        },
      ],
    };
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: [card], life: 2 },
      { leaderCardId: "ST06-001", character: [card], hand: ["EB01-025"], life: 3 },
    );
    e.asSouth().activateMain(e.findCardInZone("south", "character", card));
    e.asNorth().acceptOptional();
    // The first rest came from south; establish the repeated north-source event.
    e.asNorth().acceptOptional();
    e.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: e.pendingDecision("loopIterations", "north").id,
      iterations: 0,
    });
    expect(e.getView("north").status).toBe("active");
    expect(e.getView("north").prompts).toHaveLength(0);
    expect(e.getView("north").activeSeat).toBe("south");
  } finally {
    card.effects = saved;
  }
});

// Internal proof-policy tests complement public command scenarios above. They
// prevent widening the generation-normalizing path or history dependencies.
test("moving proof remains turn-only and unaudited condition families stay excluded", () => {
  const e = OnePieceTestEngine.create(
    {
      leaderCardId: "ST01-001",
      character: ["EB01-005"],
      hand: ["EB01-025"],
      life: 2,
      activeDon: 2,
      restedDon: 1,
    },
    { hand: ["EB01-025"], life: 3, activeDon: 1, restedDon: 2 },
  );
  const state = e.getState(),
    id = e.findCardInZone("south", "character", "EB01-005");
  for (const { yes } of gates) {
    expect(stableConditionsMatch(state, "south", id, [yes], "restReady")).toBe(true);
    expect(stableConditionsMatch(state, "south", id, [yes], "moving")).toBe(false);
    expect(
      stableConditionsMatch(
        state,
        "south",
        id,
        [Object.assign({}, yes, { futureHistoryDependency: true })],
        "restReady",
      ),
    ).toBe(false);
  }
  expect(
    stableConditionsMatch(state, "south", id, [{ condition: "turn", value: "your" }], "moving"),
  ).toBe(true);
  expect(
    stableConditionsMatch(
      state,
      "south",
      id,
      [{ condition: "restedCardCount", player: "self", comparison: "gte", value: 1 }],
      "restReady",
    ),
  ).toBe(false);
  expect(
    stableConditionsMatch(
      state,
      "south",
      id,
      [
        {
          condition: "compound",
          operator: "or",
          conditions: [{ condition: "turn", value: "your" }, { condition: "activatedEvent" }],
        },
      ],
      "restReady",
    ),
  ).toBe(false);
});

test("post-cost conditions are not certified even on an optional block without costs", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = {
      effects: [
        { trigger: "activateMain", actions },
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          optional: true,
          postCostConditions: [
            { condition: "handCount", player: "self", comparison: "eq", value: 0 },
          ],
          actions,
        },
      ],
    };
    const e = OnePieceTestEngine.create({ character: [card] });
    e.asSouth().activateMain(e.findCardInZone("south", "character", card));
    e.asSouth().acceptOptional();
    e.asSouth().acceptOptional();
    expect(e.pendingDecision("effectOptional", "south").steps).toHaveLength(1);
    e.asSouth().declineOptional();
    expect(e.getView("south").status).toBe("active");
    expect(e.getView("south").prompts).toHaveLength(0);
  } finally {
    card.effects = saved;
  }
});

test("mandatory auditor rejects post-cost gates before recording a repeated state", () => {
  const card = getCard("EB01-005"),
    saved = card.effects;
  try {
    card.effects = {
      effects: [
        {
          trigger: "whenBecomesRested",
          actions,
          postCostConditions: [
            { condition: "handCount", player: "self", comparison: "eq", value: 0 },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create({ character: [card] });
    const state = e.getState();
    state.resolutionQueue = [
      {
        kind: "effectBlock",
        id: "audit-probe",
        controller: "south",
        sourceInstanceId: e.findCardInZone("south", "character", card),
        trigger: "whenBecomesRested",
        blockIndex: 0,
      },
    ];
    const detector = new MandatoryLoopDetector();
    expect(detector.repeats(state)).toBe(false);
    expect(detector.repeats(state)).toBe(false);
  } finally {
    card.effects = saved;
  }
});

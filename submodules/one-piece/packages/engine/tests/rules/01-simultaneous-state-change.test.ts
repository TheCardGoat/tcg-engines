import type { Action, PermanentEffect } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic rules1-3-8 contract, not a claim that a current card prints this batch.
function withBatch(
  actions: Action[],
  run: () => void,
  permanentEffects?: PermanentEffect[],
  sourceId = "ST01-001",
) {
  const leader = getCard(sourceId),
    old = leader.effects;
  try {
    leader.effects = { effects: [{ trigger: "activateMain", actions }], permanentEffects };
    run();
  } finally {
    leader.effects = old;
  }
}
const allCharacters = { player: "self", zones: ["character"], count: { amount: "all" } } as const;
function batch(states: Array<"active" | "rested">): Action {
  return {
    action: "simultaneousStateChange",
    groups: states.map((state) => ({ state, target: { ...allCharacters, zones: ["character"] } })),
  };
}

test.each([
  ["active", "rested"],
  ["rested", "active"],
] as const)("1-3-8: rest wins in explicit simultaneous instructions %j", (first, second) =>
  withBatch([batch([first, second])], () => {
    const engine = OnePieceTestEngine.create({ leaderCardId: "ST01-001", character: ["EB01-005"] });
    engine.asSouth().activateMain(engine.asSouth().leader());
    expect(engine.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  }),
);

test("1-3-7: ordinary rest then active actions remain sequential", () =>
  withBatch(
    [
      { action: "rest", target: { ...allCharacters, zones: ["character"] } },
      { action: "setActive", target: { ...allCharacters, zones: ["character"] } },
    ],
    () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["EB01-005"],
      });
      engine.asSouth().activateMain(engine.asSouth().leader());
      expect(engine.getView("south").players.south.characters[0]?.rested).toBe(false);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  ));

test("all target choices precede changes, survive JSON, and reject duplicate submissions", () =>
  withBatch(
    [
      {
        action: "simultaneousStateChange",
        groups: [
          {
            state: "rested",
            target: { player: "self", zones: ["character"], count: { amount: 2, upTo: true } },
          },
          {
            state: "active",
            target: { player: "self", zones: ["character"], count: { amount: 2, upTo: true } },
          },
        ],
      },
    ],
    () => {
      let engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["EB01-005", "ST01-011", { card: getCard("ST02-002"), rested: true }],
      });
      const doma = engine.findCardInZone("south", "character", "EB01-005"),
        brook = engine.findCardInZone("south", "character", "ST01-011"),
        vito = engine.findCardInZone("south", "character", "ST02-002");
      engine.asSouth().activateMain(engine.asSouth().leader());
      const choice = engine.pendingDecision("effectSimultaneousStateSelection", "south");
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: choice.id,
        selectedIds: [doma, doma],
      });
      expect(engine.pendingDecision("effectSimultaneousStateSelection", "south").id).toBe(
        choice.id,
      );
      engine.resolveDecision(
        "effectSimultaneousStateSelection",
        { selectedIds: [doma, brook] },
        "south",
      );
      expect(engine.getView("south").players.south.characters.map((card) => card?.rested)).toEqual([
        false,
        false,
        true,
        undefined,
        undefined,
      ]);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision(
        "effectSimultaneousStateSelection",
        { selectedIds: [doma, vito] },
        "south",
      );
      expect(engine.getView("south").players.south.characters.map((card) => card?.rested)).toEqual([
        true,
        true,
        false,
        undefined,
        undefined,
      ]);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  ));

test.each([false, true])(
  "prohibited rest suppresses the conflicting active instruction (initial rested=%s)",
  (rested) =>
    withBatch(
      [batch(["active", "rested"])],
      () => {
        const engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: [{ card: getCard("EB01-005"), rested }],
        });
        engine.asSouth().activateMain(engine.asSouth().leader());
        expect(engine.getView("south").players.south.characters[0]?.rested).toBe(rested);
        expect(engine.getView("south").prompts).toHaveLength(0);
      },
      [
        {
          actions: [
            {
              action: "cannotBeRested",
              target: { ...allCharacters, zones: ["character"] },
              duration: "permanent",
            },
          ],
        },
      ],
    ),
);

test.each([false, true])(
  "protection qualification uses the original state of other grouped targets (%s)",
  (brookRested) =>
    withBatch(
      [
        {
          action: "simultaneousStateChange",
          groups: [
            {
              state: brookRested ? "active" : "rested",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "name", value: "Brook" }],
              },
            },
            {
              state: "rested",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "name", value: "Doma" }],
              },
            },
          ],
        },
      ],
      () => {
        const engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: [{ card: getCard("ST01-011"), rested: brookRested }, "EB01-005"],
        });
        engine.asSouth().activateMain(engine.asSouth().leader());
        expect(engine.getView("south").players.south.characters[0]?.rested).toBe(!brookRested);
        expect(engine.getView("south").players.south.characters[1]?.rested).toBe(!brookRested);
      },
      [
        {
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                { filter: "name", value: "Brook" },
                { filter: "state", value: "rested" },
              ],
            },
          ],
          actions: [
            {
              action: "cannotBeRested",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "name", value: "Doma" }],
              },
              duration: "permanent",
            },
          ],
        },
      ],
    ),
);

test.each(["yes", "no"])(
  "real Zoro replacement %s resumes the batch without restoring active instruction",
  (optionId) =>
    withBatch(
      [
        {
          action: "simultaneousStateChange",
          groups: [
            {
              state: "active",
              target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
            },
            {
              state: "rested",
              target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
            },
          ],
        },
      ],
      () => {
        let engine = OnePieceTestEngine.create(
          { character: ["ST01-007"] },
          { character: ["PRB02-006", "EB01-005"] },
        );
        engine.asSouth().activateMain("ST01-007");
        engine.pendingDecision("effectRestReplacement", "north");
        expect(engine.getView("north").players.north.characters[1]?.rested).toBe(false);
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        engine.resolveDecision("effectRestReplacement", { optionId }, "north");
        expect(engine.getView("north").players.north.characters[0]?.rested).toBe(optionId === "no");
        expect(engine.getView("north").players.north.characters[1]?.rested).toBe(true);
        expect(engine.getView("south").prompts).toHaveLength(0);
      },
      undefined,
      "ST01-007",
    ),
);

test("overlap and already-rested targets do not duplicate rest reactions", () => {
  const observer = getCard("ST02-002"),
    old = observer.effects;
  try {
    observer.effects = {
      effects: [
        {
          trigger: "whenBecomesRested",
          eventFilter: { filters: [{ filter: "name", value: "Doma" }] },
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    };
    withBatch([batch(["active", "rested", "rested"])], () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["ST02-002", "EB01-005", { card: getCard("EB01-005"), rested: true }],
        deck: ["ST01-002", "ST01-003", "ST01-004"],
      });
      engine.asSouth().activateMain(engine.asSouth().leader());
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        "ST01-002",
      ]);
      expect(engine.getView("south").players.south.deckCount).toBe(2);
      expect(
        engine
          .getView("south")
          .players.south.characters.slice(0, 3)
          .map((card) => card?.rested),
      ).toEqual([true, true, true]);
    });
  } finally {
    observer.effects = old;
  }
});

test("turn player's choice precedes the other player's authored-first group", () =>
  withBatch(
    [
      {
        action: "simultaneousStateChange",
        groups: [
          {
            state: "rested",
            target: {
              player: "opponent",
              chosenBy: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
          {
            state: "rested",
            target: { player: "self", zones: ["character"], count: { amount: 1, upTo: true } },
          },
        ],
      },
    ],
    () => {
      let engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: ["EB01-005"] },
        { character: ["ST02-002"] },
      );
      const south = engine.findCardInZone("south", "character", "EB01-005"),
        north = engine.findCardInZone("north", "character", "ST02-002");
      engine.asSouth().activateMain(engine.asSouth().leader());
      const prompt = engine.pendingDecision("effectSimultaneousStateSelection", "south");
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "north",
        promptId: prompt.id,
        selectedIds: [south],
      });
      engine.resolveDecision("effectSimultaneousStateSelection", { selectedIds: [south] }, "south");
      expect(engine.getView("south").players.south.characters[0]?.rested).toBe(false);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectSimultaneousStateSelection", { selectedIds: [north] }, "north");
      expect(engine.getView("south").players.south.characters[0]?.rested).toBe(true);
      expect(engine.getView("south").players.north.characters[0]?.rested).toBe(true);
    },
  ));

test("a saved choice cannot select a new zone generation of the same physical card", () =>
  withBatch(
    [
      {
        action: "simultaneousStateChange",
        groups: [
          {
            state: "rested",
            target: { player: "self", zones: ["character"], count: { amount: 1, upTo: true } },
          },
        ],
      },
    ],
    () => {
      let engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        character: ["EB01-005", "ST02-002"],
      });
      const doma = engine.findCardInZone("south", "character", "EB01-005"),
        vito = engine.findCardInZone("south", "character", "ST02-002");
      engine.asSouth().activateMain(engine.asSouth().leader());
      // Judge intervention tests saved-reference validity, not an invented card ability.
      engine.exec({
        type: "judgeMoveCard",
        seat: "judge",
        instanceId: doma,
        owner: "south",
        zone: "trash",
      });
      engine.exec({
        type: "judgeMoveCard",
        seat: "judge",
        instanceId: doma,
        owner: "south",
        zone: "character",
      });
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      const prompt = engine.pendingDecision("effectSimultaneousStateSelection", "south");
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: prompt.id,
        selectedIds: [doma],
      });
      expect(engine.pendingDecision("effectSimultaneousStateSelection", "south").id).toBe(
        prompt.id,
      );
      engine.resolveDecision("effectSimultaneousStateSelection", { selectedIds: [vito] }, "south");
      expect(
        engine.getView("south").players.south.characters.find((card) => card?.instanceId === doma)
          ?.rested,
      ).toBe(false);
      expect(
        engine.getView("south").players.south.characters.find((card) => card?.instanceId === vito)
          ?.rested,
      ).toBe(true);
    },
  ));

test("saved total-power qualification uses the initial snapshot after a provider leaves", () => {
  const provider = getCard("ST01-011"),
    original = provider.effects;
  try {
    provider.effects = {
      permanentEffects: [
        {
          actions: [
            {
              action: "modifyPower",
              value: 1000,
              duration: "permanent",
              target: { player: "self", zones: ["character"], count: { amount: "all" } },
            },
          ],
        },
      ],
    };
    withBatch(
      [
        {
          action: "simultaneousStateChange",
          groups: [
            {
              state: "rested",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                filters: [{ filter: "name", value: "Doma" }],
                totalConstraint: { property: "power", comparison: "eq", value: 4000 },
              },
            },
          ],
        },
      ],
      () => {
        let engine = OnePieceTestEngine.create({
          leaderCardId: "ST01-001",
          character: ["EB01-005", "ST01-011"],
        });
        const doma = engine.findCardInZone("south", "character", "EB01-005"),
          brook = engine.findCardInZone("south", "character", "ST01-011");
        expect(engine.getView("south").players.south.characters[0]?.power).toBe(4000);
        engine.asSouth().activateMain(engine.asSouth().leader());
        engine.exec({
          type: "judgeMoveCard",
          seat: "judge",
          instanceId: brook,
          owner: "south",
          zone: "trash",
        });
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        expect(engine.getView("south").players.south.characters[0]?.power).toBe(3000);
        engine.resolveDecision(
          "effectSimultaneousStateSelection",
          { selectedIds: [doma] },
          "south",
        );
        expect(engine.getView("south").players.south.characters[0]?.rested).toBe(true);
        expect(engine.getView("south").prompts).toHaveLength(0);
      },
    );
  } finally {
    provider.effects = original;
  }
});

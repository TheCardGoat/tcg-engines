import { expect, test } from "vite-plus/test";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const bottom: Action = {
  action: "returnToDeck",
  target: { player: "self", zones: ["character"], count: { amount: "all" } },
  position: "bottom",
  previousActionTargets: true,
};
const bounceReplay: Action[] = [
  {
    action: "returnToHand",
    target: { player: "self", zones: ["character"], count: { amount: "all" } },
  },
  { action: "play", source: { player: "self", zone: "hand" }, count: { amount: 1, upTo: true } },
];

// Synthetic delayed programs exercise queue identity; they do not claim printed card text.
function run(
  actions: Action[],
  verify: (engine: OnePieceTestEngine, id: string) => void,
  independent = false,
  legacy = false,
) {
  const leader = getCard("ST01-001"),
    saved = leader.effects;
  try {
    leader.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            { action: "play", source: { player: "self", zone: "trash" }, count: { amount: 1 } },
            ...(independent
              ? actions.map(
                  (action): Action => ({
                    action: "delayed",
                    timing: "endOfThisTurn",
                    actions: [action],
                  }),
                )
              : [{ action: "delayed" as const, timing: "endOfThisTurn" as const, actions }]),
          ],
        },
      ],
    };
    let engine = OnePieceTestEngine.create({
      leaderCardId: leader.id,
      trash: ["ST01-013"],
      deck: ["ST01-003", "ST01-004", "ST01-005", "ST01-006"],
    });
    const id = engine.findCardInZone("south", "trash", "ST01-013");
    engine.asSouth().activateMain(engine.asSouth().leader());
    if (engine.getView("south").prompts.length) engine.asSouth().choosePlay(id);
    if (independent) {
      // Serialization contract: each separately scheduled effect retains its captured reference.
      expect(
        engine.getState().delayedEffectActions.map((item) => item.previousActionTargetIds),
      ).toEqual(actions.map(() => [id]));
    }
    engine = OnePieceTestEngine.fromState(
      JSON.parse(
        JSON.stringify(engine.getState(), (key, value) =>
          legacy && key === "delayedIdentity" ? undefined : value,
        ),
      ),
    );
    engine.asSouth().endTurn();
    if (engine.getView("south").prompts.length) {
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.asSouth().choosePlay(id);
    }
    verify(engine, id);
  } finally {
    leader.effects = saved;
  }
}

test("queued earlier delayed replay cannot replace a later delayed target binding", () => {
  run(
    [{ action: "sequence", actions: bounceReplay }, bottom],
    (engine, id) => {
      expect(
        engine.getView("south").players.south.characters.map((card) => card?.instanceId),
      ).toContain(id);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
    true,
  );
});

test("a delayed sequence binds its newly played previous target to the new object", () => {
  run([{ action: "sequence", actions: [...bounceReplay, bottom] }], (engine, id) => {
    expect(engine.findCardInZone("south", "deck", "ST01-013")).toBe(id);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

test("nested delayed wrappers preserve their inherited previous target", () => {
  run(
    [{ action: "sequence", actions: [{ action: "sequence", actions: [bottom] }] }],
    (engine, id) => {
      expect(engine.findCardInZone("south", "deck", "ST01-013")).toBe(id);
    },
  );
});

test("stale target identity does not erase historical count inputs", () => {
  run(
    [
      { action: "sequence", actions: bounceReplay },
      { action: "draw", player: "self", amount: 0, amountFromPreviousActionTargets: true },
    ],
    (engine, id) => {
      expect(engine.getView("south").players.south.hand).toHaveLength(1);
      expect(
        engine.getView("south").players.south.characters.map((card) => card?.instanceId),
      ).toContain(id);
    },
    true,
  );
});

test("fresh delayed selection can choose a reentered physical card", () => {
  const fresh: Action = {
    action: "returnToDeck",
    target: { player: "self", zones: ["character"], count: { amount: "all" } },
    position: "bottom",
  };
  run([{ action: "sequence", actions: bounceReplay }, fresh], (engine, id) => {
    expect(engine.findCardInZone("south", "deck", "ST01-013")).toBe(id);
  });
});

test("a nested delay retains its original binding when scheduled after replay", () => {
  run(
    [
      { action: "sequence", actions: bounceReplay },
      { action: "scheduleAtEndOfTurn", actions: [bottom] },
    ],
    (engine, id) => {
      engine.asNorth().endTurn();
      expect(
        engine.getView("south").players.south.characters.map((card) => card?.instanceId),
      ).toContain(id);
    },
    true,
  );
});

test("queued implicit self removal does not remove a replayed source", () => {
  const source = getCard("ST01-013"),
    saved = source.effects;
  try {
    source.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [
                {
                  action: "sequence",
                  actions: [
                    {
                      action: "returnToHand",
                      target: {
                        player: "self",
                        zones: ["character"],
                        self: true,
                        count: { amount: 1 },
                      },
                    },
                    {
                      action: "play",
                      source: { player: "self", zone: "hand" },
                      count: { amount: 1, upTo: true },
                    },
                  ],
                },
              ],
            },
            { action: "delayed", timing: "endOfThisTurn", actions: [{ action: "trashThisCard" }] },
          ],
        },
      ],
    };
    let engine = OnePieceTestEngine.create({ character: [source.id] });
    const id = engine.asSouth().findOnField(source.id);
    engine.asSouth().activateMain(id);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.asSouth().endTurn();
    if (engine.getView("south").prompts.length) engine.asSouth().choosePlay(id);
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(id);
    expect(engine.getView("south").prompts).toHaveLength(0);
  } finally {
    source.effects = saved;
  }
});

test("sibling instructions in one delayed program consume newly produced targets", () => {
  run([...bounceReplay, bottom], (engine, id) => {
    expect(engine.findCardInZone("south", "deck", "ST01-013")).toBe(id);
  });
});

test("legacy saved delayed actions retain their ID-only target behavior", () => {
  run(
    [{ action: "sequence", actions: bounceReplay }, bottom],
    (engine, id) => {
      expect(engine.findCardInZone("south", "deck", "ST01-013")).toBe(id);
    },
    true,
    true,
  );
});

test("independent nested scheduling invocations keep separate target bindings", () => {
  run(
    [
      { action: "scheduleAtEndOfTurn", actions: [{ action: "sequence", actions: bounceReplay }] },
      { action: "scheduleAtEndOfTurn", actions: [bottom] },
    ],
    (engine, id) => {
      engine.asNorth().endTurn();
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      if (engine.getView("south").prompts.length) engine.asSouth().choosePlay(id);
      expect(
        engine.getView("south").players.south.characters.map((card) => card?.instanceId),
      ).toContain(id);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});

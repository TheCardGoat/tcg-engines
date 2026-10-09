import type { Target } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

// No catalog card currently forms a replacement cycle. These synthetic printed
// effects isolate 8-1-3-4-3 through ordinary activation and choice commands.
describe("replacement process identity", () => {
  test("8-1-3-4-3: a replacement cannot replace its own result again", () => {
    const card = getCard("EB01-005");
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: 1 },
    } as const;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "rest", target: { ...target, zones: ["character"] } }],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "rested",
            target: { ...target, zones: ["character"] },
            replacementAction: { action: "rest", target: { ...target, zones: ["character"] } },
          },
        ],
      };
      let engine = OnePieceTestEngine.create({ character: ["EB01-005"] });
      const source = engine.findCardInZone("south", "character", "EB01-005");
      engine.asSouth().activateMain(source);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(
        engine
          .getView("south")
          .players.south.characters.find((entry) => entry?.instanceId === source)?.rested,
      ).toBe(true);
    } finally {
      card.effects = original;
    }
  });
  test("a new process in the same effect may use the replacement again", () => {
    const card = getCard("EB01-005");
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: 1 },
    } as const;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              { action: "rest", target: { ...target, zones: ["character"] } },
              { action: "setActive", target: { ...target, zones: ["character"] } },
              { action: "rest", target: { ...target, zones: ["character"] } },
            ],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "rested",
            target: { ...target, zones: ["character"] },
            replacementAction: { action: "rest", target: { ...target, zones: ["character"] } },
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: ["EB01-005"] });
      engine.asSouth().activateMain("EB01-005");
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").players.south.characters.filter(Boolean)[0]?.rested).toBe(
        true,
      );
    } finally {
      card.effects = original;
    }
  });

  test("8-1-3-4-6: KO to rest to KO resolves each replacement once across saved prompts", () => {
    const card = getCard("EB01-005");
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: 1 },
    } as const;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "ko", target: { ...target, zones: ["character"] } }],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: { ...target, zones: ["character"] },
            replacementAction: {
              action: "sequence",
              actions: [{ action: "rest", target: { ...target, zones: ["character"] } }],
            },
          },
          {
            replacedEvent: "rested",
            target: { ...target, zones: ["character"] },
            replacementAction: { action: "ko", target: { ...target, zones: ["character"] } },
          },
        ],
      };
      let engine = OnePieceTestEngine.create({ character: ["EB01-005"] });
      engine.asSouth().activateMain("EB01-005");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
      expect(JSON.stringify(engine.getView("south"))).not.toContain("replacementProcess");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").players.south.trash.map((entry) => entry.cardId)).toContain(
        "EB01-005",
      );
    } finally {
      card.effects = original;
    }
  });

  test("mandatory KO-to-KO replacement completes once without declaring a loop draw", () => {
    const card = getCard("EB01-005");
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: 1 },
    } as const;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "ko", target: { ...target, zones: ["character"] } }],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "ko",
            mandatory: true,
            target: { ...target, zones: ["character"] },
            replacementAction: { action: "ko", target: { ...target, zones: ["character"] } },
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: ["EB01-005"] });
      engine.asSouth().activateMain("EB01-005");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").status).toBe("active");
      expect(engine.getView("south").players.south.trash.map((entry) => entry.cardId)).toContain(
        "EB01-005",
      );
    } finally {
      card.effects = original;
    }
  });
  test("a triggered effect starts a separate replacement process", () => {
    const card = getCard("EB01-005");
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: 1 },
    } as const;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "rest", target: { ...target, zones: ["character"] } }],
          },
          {
            trigger: "whenBecomesRested",
            oncePerTurn: true,
            actions: [
              { action: "setActive", target: { ...target, zones: ["character"] } },
              { action: "rest", target: { ...target, zones: ["character"] } },
            ],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "rested",
            target: { ...target, zones: ["character"] },
            replacementAction: { action: "rest", target: { ...target, zones: ["character"] } },
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: ["EB01-005"] });
      engine.asSouth().activateMain("EB01-005");
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").players.south.characters.filter(Boolean)[0]?.rested).toBe(
        true,
      );
    } finally {
      card.effects = original;
    }
  });

  test("leaving and reentering creates a new replacement source within the chain", () => {
    const card = getCard("EB01-005");
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      self: true,
      count: { amount: 1 },
    } as const;
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "ko", target: { ...target, zones: ["character"] } }],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: { ...target, zones: ["character"] },
            replacementAction: {
              action: "sequence",
              actions: [
                { action: "returnToHand", target: { ...target, zones: ["character"] } },
                { action: "playThisCard" },
                { action: "ko", target: { ...target, zones: ["character"] } },
              ],
            },
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: ["EB01-005"] });
      engine.asSouth().activateMain("EB01-005");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
      expect(
        engine
          .getView("south")
          .players.south.characters.filter(Boolean)
          .map((entry) => entry?.cardId),
      ).toEqual(["EB01-005"]);
      engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").players.south.trash.map((entry) => entry.cardId)).toContain(
        "EB01-005",
      );
    } finally {
      card.effects = original;
    }
  });
});

describe("replacement source ordering", () => {
  test("8-1-3-4-2: turn-player replacement precedes the non-turn player, whose choice survives decline", () => {
    const active = getCard("EB01-005");
    const inactive = getCard("EB01-018");
    const originals = [active.effects, inactive.effects];
    try {
      active.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "ko",
                target: {
                  player: "opponent",
                  zones: ["character"],
                  count: { amount: 1 },
                  filters: [{ filter: "name", value: "Jinbe" }],
                },
              },
            ],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      inactive.effects = {
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: { player: "self", zones: ["character"], count: { amount: "all" } },
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { character: ["EB01-005"] },
        { character: ["ST01-005", "EB01-018"] },
      );
      const before = engine.getView("south").players.north.handCount;
      engine.asSouth().activateMain("EB01-005");
      engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
      expect(engine.getView("south").players.north.handCount).toBe(before + 1);
      expect(
        engine
          .getView("south")
          .players.north.characters.filter(Boolean)
          .map((card) => card?.cardId),
      ).toContain("ST01-005");
      expect(engine.getView("south").prompts).toHaveLength(0);
    } finally {
      active.effects = originals[0];
      inactive.effects = originals[1];
    }
  });

  test.each([false, true])(
    "two rest replacements expose both physical sources; mandatory=%s",
    (mandatory) => {
      const active = getCard("EB01-005");
      const original = active.effects;
      try {
        active.effects = {
          effects: [
            {
              trigger: "activateMain",
              actions: [
                {
                  action: "rest",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: { amount: 1 },
                    filters: [{ filter: "name", value: "Jinbe" }],
                  },
                },
              ],
            },
          ],
          replacementEffects: [
            {
              replacedEvent: "rested",
              ...(mandatory ? { mandatory: true as const } : {}),
              target: { player: "self", zones: ["character"], count: { amount: "all" } },
              replacementAction: { action: "draw", player: "self", amount: 1 },
            },
          ],
        };
        const engine = OnePieceTestEngine.create({
          character: ["EB01-005", "EB01-005", "ST01-005"],
        });
        const sources = engine
          .getView("south")
          .players.south.characters.filter((card) => card?.cardId === "EB01-005");
        engine.asSouth().activateMain(engine.findCardInZone("south", "character", "EB01-005"));
        const decision = engine.pendingDecision("effectRestReplacement", "south");
        const step = decision.steps[0];
        if (step.kind !== "chooseOption") throw new Error("Expected replacement source choices.");
        expect(step.options).toHaveLength(mandatory ? 2 : 3);
        expect(step.options.some((option) => option.id === "no")).toBe(!mandatory);
        const before = engine.getView("south").players.south.handCount;
        engine.resolveDecision(
          "effectRestReplacement",
          { optionId: `replacement:${sources[1]!.instanceId}:0` },
          "south",
        );
        expect(engine.getView("south").players.south.handCount).toBe(before + 1);
        expect(
          engine
            .getView("south")
            .players.south.characters.find((card) => card?.cardId === "ST01-005")?.rested,
        ).toBe(false);
        expect(engine.getView("south").prompts).toHaveLength(0);
      } finally {
        active.effects = original;
      }
    },
  );
});

function characterTarget(player: "self" | "opponent", self = false): Target {
  return {
    player,
    zones: ["character"],
    count: { amount: "all" },
    ...(self ? { self: true } : {}),
  };
}

function syntheticSources(
  run: (
    active: ReturnType<typeof getCard>,
    target: ReturnType<typeof getCard>,
    passive: ReturnType<typeof getCard>,
  ) => void,
) {
  const cards = [getCard("EB01-005"), getCard("ST01-005"), getCard("EB01-018")];
  const originals = cards.map((card) => card.effects);
  try {
    run(cards[0], cards[1], cards[2]);
  } finally {
    cards.forEach((card, index) => {
      card.effects = originals[index];
    });
  }
}

describe("replacement priority and decline continuation", () => {
  test("mandatory rest replacement runs without a decline option", () =>
    syntheticSources((active) => {
      active.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "rest", target: characterTarget("self", true) }],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "rested",
            mandatory: true,
            target: characterTarget("self", true),
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: [active] });
      const before = engine.getView("south").players.south.handCount;
      engine.asSouth().activateMain(active);
      expect(engine.getView("south").players.south.handCount).toBe(before + 1);
      expect(engine.getView("south").players.south.characters.filter(Boolean)[0]?.rested).toBe(
        false,
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
    }));

  test("declining one grouped target does not decline its sibling's distinct replacement", () =>
    syntheticSources((active, target) => {
      active.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "ko", target: characterTarget("opponent") }],
          },
        ],
      };
      target.effects = {
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: characterTarget("self", true),
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { character: [active] },
        { character: [target, target] },
      );
      engine.asSouth().activateMain(active);
      engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "north");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
      expect(
        engine.getView("south").players.north.trash.filter((card) => card.cardId === target.id),
      ).toHaveLength(1);
      expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
      expect(engine.getView("south").prompts).toHaveLength(0);
    }));

  test("a transformed result can offer an earlier declined replacement again", () =>
    syntheticSources((active, target) => {
      active.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [{ action: "ko", target: characterTarget("opponent") }],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: characterTarget("opponent"),
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      target.effects = {
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: characterTarget("self", true),
            replacementAction: { action: "rest", target: characterTarget("self", true) },
          },
          {
            replacedEvent: "rested",
            mandatory: true,
            target: characterTarget("self", true),
            replacementAction: { action: "ko", target: characterTarget("self", true) },
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: [active] }, { character: [target] });
      const before = engine.getView("south").players.south.handCount;
      engine.asSouth().activateMain(active);
      engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
      expect(engine.getView("south").players.south.handCount).toBe(before + 1);
      expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
      expect(engine.getView("south").prompts).toHaveLength(0);
    }));
});

describe("replacement controller and removal fallback", () => {
  test.each([true, false])("battle replacement uses its owner's hand; pay=%s", (pay) =>
    syntheticSources((active, target, passive) => {
      active.effects = {
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: characterTarget("opponent"),
            replacementAction: { action: "trashFromHand", player: "self", amount: 1 },
          },
        ],
      };
      target.effects = {};
      passive.effects = {
        replacementEffects: [
          {
            replacedEvent: "ko",
            target: characterTarget("self"),
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { character: [active], hand: ["EB01-023"], activeDon: 2 },
        { character: [{ card: target, rested: true }, passive] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const payment = engine.findCardInZone("south", "hand", "EB01-023");
      const attacker = engine.findCardInZone("south", "character", active);
      const defender = engine.findCardInZone("north", "character", target);
      const before = engine.getView("south").players.north.handCount;
      engine.asSouth().attachDon(attacker, 2);
      engine.asSouth().attack(attacker, defender);
      engine.resolveDecision("battleKoReplacement", { selectedIds: pay ? [payment] : [] }, "south");
      if (!pay) engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "north");
      expect(engine.getView("south").players.south.handCount).toBe(pay ? 0 : 1);
      expect(engine.getView("south").players.north.handCount).toBe(before + (pay ? 0 : 1));
      expect(
        engine
          .getView("south")
          .players.north.characters.some((card) => card?.instanceId === defender),
      ).toBe(true);
      expect(engine.getView("south").prompts).toHaveLength(0);
    }),
  );

  test("field-removal decline offers the next controller rather than returning the card", () =>
    syntheticSources((active, target, passive) => {
      active.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "returnToHand",
                target: {
                  ...characterTarget("opponent"),
                  filters: [{ filter: "name", value: "Jinbe" }],
                },
              },
            ],
          },
        ],
        replacementEffects: [
          {
            replacedEvent: "removeFromField",
            target: characterTarget("opponent"),
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      target.effects = {};
      passive.effects = {
        replacementEffects: [
          {
            replacedEvent: "removeFromField",
            target: characterTarget("self"),
            replacementAction: { action: "draw", player: "self", amount: 1 },
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { character: [active] },
        { character: [target, passive] },
      );
      const before = engine.getView("south").players.north.handCount;
      engine.asSouth().activateMain(active);
      engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "south");
      engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
      expect(engine.getView("south").players.north.handCount).toBe(before + 1);
      expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(2);
      expect(engine.getView("south").prompts).toHaveLength(0);
    }));
});

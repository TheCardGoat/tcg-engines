import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic rules fixture: no catalog permanent absolute-cost setter exists.
// CR8-1-3-3 and 8-1-3-3-2 apply only valid permanent effects.
test.each([
  "deck",
  "dependent-deck",
  "trash",
  "dependent-trash",
  "inactive-block",
  "inactive-action",
  "negated",
  "dependent",
  "active",
] as const)(
  "absolute setter in %s does not poison unrelated settlement unless applicable",
  (location) => {
    const inDeck = location === "deck" || location === "dependent-deck";
    const inTrash = location === "trash" || location === "dependent-trash";
    const setter = getCard("ST02-002");
    const reducer = getCard("ST01-011");
    const savedSetter = setter.effects;
    const savedReducer = reducer.effects;
    try {
      setter.effects = {
        permanentEffects: [
          {
            conditions:
              inDeck || inTrash
                ? []
                : [{ condition: "donAttached", amount: location === "inactive-block" ? 2 : 1 }],
            actions: [
              {
                action: "setCost",
                value: 0,
                ...(location === "inactive-action"
                  ? { condition: { condition: "turn" as const, value: "opponent" as const } }
                  : {}),
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: "all" },
                  ...(location.startsWith("dependent")
                    ? {
                        filters: [
                          { filter: "cost" as const, comparison: "lte" as const, value: 1 },
                        ],
                      }
                    : {}),
                },
              },
            ],
          },
        ],
      };
      reducer.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: [
              {
                action: "negateEffects",
                duration: "thisTurn",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: "all" },
                  filters: [{ filter: "name", value: setter.name }],
                },
              },
            ],
          },
        ],
        permanentEffects: [
          {
            actions: [
              {
                action: "modifyCost",
                value: -1,
                target: {
                  player: "self",
                  zones: ["character"],
                  self: true,
                  count: { amount: 1 },
                  filters: [{ filter: "cost", comparison: "gte", value: 0 }],
                },
              },
            ],
          },
        ],
      };
      const engine = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        activeDon: 1,
        character: inDeck || inTrash ? ["ST01-011"] : ["ST01-011", "ST02-002"],
        deck: inDeck ? ["ST02-002", "ST02-006"] : ["ST02-006", "ST02-006"],
        trash: inTrash ? ["ST02-002"] : [],
      });
      const recipient =
        inDeck || inTrash
          ? engine.asSouth().leader()
          : engine.findCardInZone("south", "character", "ST02-002");
      if (location === "negated")
        engine.asSouth().activateMain(engine.findCardInZone("south", "character", "ST01-011"));
      engine.asSouth().attachDon(recipient, 1);
      if (location === "active" || location === "dependent") {
        expect(engine.getView("judge").prompts.some((prompt) => prompt.kind === "judge")).toBe(
          true,
        );
      } else {
        expect(engine.getView("judge").prompts).toHaveLength(0);
        expect(engine.getView("south").players.south.characters[0]?.cost).toBe(1);
        expect(engine.getView("south").players.south.activeDon).toBe(0);
      }
    } finally {
      setter.effects = savedSetter;
      reducer.effects = savedReducer;
    }
  },
);

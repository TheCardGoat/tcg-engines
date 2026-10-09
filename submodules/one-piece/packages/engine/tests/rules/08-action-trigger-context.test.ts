import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("Shu's saved optional activation retains the Slash attacker for its result condition", () => {
  let e = OnePieceTestEngine.create(
    { character: ["OP11-088"] },
    { character: [{ cardId: "EB01-025", playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "EB01-025"), e.leader("south"));
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.asSouth().acceptOptional();
  expect(
    e.getView("south").players.south.characters.find((c) => c?.cardId === "OP11-088")?.power,
  ).toBe(10000);
});

test.each(["EB01-025", "EB01-018"])(
  "nested action keeps trigger context through a saved target choice: %s",
  (attacker) => {
    const source = getCard("ST02-002"),
      original = source.effects;
    try {
      // Explicit rules fixture: a choice inside a sequence interrupts the action
      // before a later result tests the original attacking Character's attribute.
      source.effects = {
        effects: [
          {
            trigger: "onOpponentAttack",
            actions: [
              {
                action: "sequence",
                actions: [
                  {
                    action: "modifyPower",
                    target: {
                      player: "self",
                      zones: ["leader", "character"],
                      count: { amount: 1, upTo: true },
                    },
                    value: 1000,
                    duration: "thisTurn",
                  },
                  {
                    action: "modifyPower",
                    condition: {
                      condition: "triggerEventCard",
                      filters: [{ filter: "attribute", value: "slash" }],
                    },
                    target: {
                      player: "self",
                      zones: ["character"],
                      self: true,
                      count: { amount: 1 },
                    },
                    value: 5000,
                    duration: "thisTurn",
                  },
                ],
              },
            ],
          },
        ],
      };
      let e = OnePieceTestEngine.create(
        { character: ["ST02-002"] },
        { character: [{ cardId: attacker, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      e.asNorth().attack(e.findCardInZone("north", "character", attacker), e.leader("south"));
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      const prompt = e.pendingDecision("effectTargetSelection", "south");
      const rejected = e.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: prompt.id,
        selectedIds: [e.leader("north")],
      });
      e = OnePieceTestEngine.fromState(rejected.state);
      e.asSouth().chooseTargets(e.leader("south"));
      expect(
        e.getView("south").players.south.characters.find((c) => c?.cardId === "ST02-002")?.power,
      ).toBe(attacker === "EB01-025" ? 10000 : 5000);
    } finally {
      source.effects = original;
    }
  },
);

test.each(["EB01-025", "EB01-018"])(
  "successful K.O. follow-up keeps the original attacker context: %s",
  (attacker) => {
    const source = getCard("ST02-002"),
      original = source.effects;
    try {
      // Rules fixture for a deferred successful-K.O. continuation with an event predicate.
      source.effects = {
        effects: [
          {
            trigger: "onOpponentAttack",
            actions: [
              {
                action: "ko",
                target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
                thenActions: [
                  {
                    action: "conditional",
                    predicate: {
                      condition: "triggerEventCard",
                      filters: [{ filter: "attribute", value: "slash" }],
                    },
                    whenTrue: [
                      {
                        action: "modifyPower",
                        target: {
                          player: "self",
                          zones: ["character"],
                          self: true,
                          count: { amount: 1 },
                        },
                        value: 5000,
                        duration: "thisTurn",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create(
        { character: ["ST02-002"] },
        { character: [{ cardId: attacker, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      e.asNorth().attack(e.findCardInZone("north", "character", attacker), e.leader("south"));
      expect(e.getView("north").players.north.trash.some((c) => c.cardId === attacker)).toBe(true);
      expect(
        e.getView("south").players.south.characters.find((c) => c?.cardId === "ST02-002")?.power,
      ).toBe(attacker === "EB01-025" ? 10000 : 5000);
    } finally {
      source.effects = original;
    }
  },
);

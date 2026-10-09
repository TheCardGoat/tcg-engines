import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../src/index.ts";

test("return count excludes a selected Character protected from own effects (rules fixture)", () => {
  const protectedCard = getCard("ST02-002"),
    old = protectedCard.effects;
  try {
    protectedCard.effects = {
      permanentEffects: [
        {
          actions: [
            {
              action: "cannotBeRemoved",
              target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
              duration: "permanent",
              bySource: "ownEffect",
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "P-011",
        hand: ["P-059", "ST01-006"],
        character: ["ST02-002", "ST02-006"],
        activeDon: 2,
      },
      { character: ["OP12-056"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "OP12-056"), e.leader("south"));
    e.asSouth().chooseCounter("P-059");
    e.asSouth().chooseTargets(
      e.findCardInZone("south", "character", "ST02-002"),
      e.findCardInZone("south", "character", "ST02-006"),
    );
    e.asSouth().chooseTargets(e.leader("south"));
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST02-002");
  } finally {
    protectedCard.effects = old;
  }
});

test.each(["yes", "no"] as const)(
  "return result survives replacement %s and JSON restore (rules fixture)",
  (optionId) => {
    const card = getCard("ST02-006"),
      old = card.effects;
    try {
      card.effects = {
        replacementEffects: [
          {
            replacedEvent: "removeFromField",
            source: "effect",
            eventFilter: { targetSelf: true },
            replacementAction: { action: "sequence", actions: [] },
          },
        ],
      };
      let e = OnePieceTestEngine.create(
        {
          leaderCardId: "P-011",
          hand: ["P-059"],
          character: ["ST02-002", "ST02-006", "ST02-012"],
          activeDon: 2,
        },
        { character: [{ cardId: "OP12-056", attachedDon: 2 }] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const ids = ["ST02-002", "ST02-006", "ST02-012"].map((id) =>
        e.findCardInZone("south", "character", id),
      );
      e.asNorth().attack(e.findCardInZone("north", "character", "OP12-056"), e.leader("south"));
      e.asSouth().chooseCounter("P-059");
      e.asSouth().chooseTargets(...ids);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectRemovalReplacement", { optionId }, "south");
      e.asSouth().chooseTargets(e.leader("south"));
      e.asSouth().chooseCounter();
      expect(e.getView("south").players.south.lifeCount).toBe(optionId === "yes" ? 4 : 5);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(ids[0]);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(ids[2]);
    } finally {
      card.effects = old;
    }
  },
);

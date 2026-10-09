import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test.each(["attacking", "defending"] as const)(
  "parsed Zephyr gains turn power after %s against Strike",
  (role) => {
    const card = getCard("ST05-010");
    if (card.cardType !== "character") throw new Error("Expected Zephyr to be a Character.");
    const original = card.effects;
    try {
      card.effects = buildCardEffects(card.effect ?? "");
      const engine = OnePieceTestEngine.create(
        {
          character: [{ card: role === "attacking" ? card : getCard("ST03-006"), playedOnTurn: 0 }],
        },
        { character: [{ card: role === "defending" ? card : getCard("ST03-006"), rested: true }] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const owner = role === "attacking" ? "south" : "north";
      const zephyr = engine.findCardInZone(owner, "character", card);
      const attacker = engine.findCardInZone(
        "south",
        "character",
        role === "attacking" ? card : "ST03-006",
      );
      const defender = engine.findCardInZone(
        "north",
        "character",
        role === "defending" ? card : "ST03-006",
      );
      engine.declareAttack(attacker, defender, "south");
      expect(
        engine
          .getView(owner)
          .players[owner].characters.find((instance) => instance?.instanceId === zephyr)?.power,
      ).toBe(11000);
      engine.endTurn("south");
      expect(
        engine
          .getView(owner)
          .players[owner].characters.find((instance) => instance?.instanceId === zephyr)?.power,
      ).toBe(8000);
    } finally {
      card.effects = original;
    }
  },
);

test("parsed Union Armada protects the same Character without another selection", () => {
  const card = getCard("ST05-017");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create(
      { character: [{ card: getCard("ST05-011"), playedOnTurn: 0 }] },
      {
        leaderCardId: "ST05-001",
        character: [{ card: getCard("ST05-003"), rested: true }],
        hand: [card],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const defender = engine.findCardInZone("north", "character", "ST05-003");
    engine.declareAttack(
      engine.findCardInZone("south", "character", "ST05-011"),
      defender,
      "south",
    );
    engine.resolveDecision(
      "battleCounter",
      { selectedIds: [engine.findCardInZone("north", "hand", card)] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [defender] }, "north");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.some((instance) => instance?.instanceId === defender),
    ).toBe(true);
  } finally {
    card.effects = original;
  }
});

test("parsed Lion allows declining the DON-return activation cost after Event play", () => {
  const card = getCard("ST05-016");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create(
      { hand: [card], activeDon: 3 },
      { character: ["ST03-002"] },
    );
    const target = engine.findCardInZone("north", "character", "ST03-002");
    const before = engine.getView("south").players.south.donDeckCount;
    engine.playCard(card);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.donDeckCount).toBe(before);
    expect(engine.getView("south").players.south.restedDon).toBe(3);
    expect(
      engine
        .getView("north")
        .players.north.characters.some((instance) => instance?.instanceId === target),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  } finally {
    card.effects = original;
  }
});

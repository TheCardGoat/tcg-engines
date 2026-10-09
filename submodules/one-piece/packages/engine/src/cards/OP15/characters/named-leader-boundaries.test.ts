import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

// Synthetic named-Leader boundary proof for official Q1223/Q1227-Q1229.
// The catalog has no all-name Leader. This does not implement wildcard names.
function withLeaderNames(names: string[], run: () => void) {
  const leader = getCard("OP01-001");
  const original = leader.alternateNames;
  leader.alternateNames = names;
  try {
    run();
  } finally {
    if (original === undefined) delete leader.alternateNames;
    else leader.alternateNames = original;
  }
}

describe("OP15 synthetic named-Leader boundaries", () => {
  test.each([
    ["OP15-070", "Shura", 1],
    ["OP15-071", "Ohm", 2],
  ] as const)(
    "%s grants its named Leader the keyword and opponent-turn base power",
    (cardId, name, damage) => {
      withLeaderNames([name], () => {
        const engine = OnePieceTestEngine.create(
          { leaderCardId: "OP01-001", character: [cardId] },
          { character: cardId === "OP15-070" ? ["OP15-073"] : [] },
        );
        const life = engine.getView("south").players.north.lifeCount;
        engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
        expect(engine.getView("south").players.north.lifeCount).toBe(life - damage);
        expect(engine.getView("south").prompts).toHaveLength(0);
        engine.endTurn("south");
        expect(engine.getView("south").players.south.leader.power).toBe(6000);
      });
    },
  );

  test.each(["OP15-064", "OP15-072"])("%s can use named cards supplied by its Leader", (cardId) => {
    withLeaderNames(["Satori", "Hotori", "Kotori"], () => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "OP01-001", character: [cardId], activeDon: 2 },
        { character: ["EB01-005"] },
      );
      const target = engine.findCardInZone("north", "character", "EB01-005");
      engine.activateEffect(
        engine.findCardInZone("south", "character", cardId),
        "activateMain",
        "south",
      );
      engine.acceptLeadingOptional("south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      const opponent = engine.getView("south").players.north.characters[0];
      if (cardId === "OP15-064") expect(opponent?.rested).toBe(true);
      else expect(opponent?.power).toBe(0);
      expect(engine.getView("south").players.south.activeDon).toBe(0);
      expect(engine.getView("south").players.south.restedDon).toBe(0);
    });
  });
});

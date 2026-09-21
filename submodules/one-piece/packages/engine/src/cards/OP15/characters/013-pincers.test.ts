import { describe, expect, test } from "vite-plus/test";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";
import { op15Pincers013 } from "../../../../../cards/src/cards/characters/op15-013-pincers.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-013 Pincers", () => {
  test("costs 2 less in hand while the Leader has 0 power or less and blocks once played", () => {
    const leaderCard = op15Krieg001;
    const originalPower = leaderCard.power;
    leaderCard.power = 0;
    try {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: op15Krieg001, hand: [op15Pincers013], activeDon: 2 },
        { activeDon: 2 },
        { firstPlayer: "north", activeSeat: "south" },
      );

      engine.playCard(op15Pincers013);
      const pincersId = engine.findCardInZone("south", "character", op15Pincers013);
      expect(
        engine
          .getView("south")
          .players.south.characters.some((card) => card?.instanceId === pincersId),
      ).toBe(true);

      engine.endTurn("south");
      engine.attachDon(engine.leader("north"), 2, "north");
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

      const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
      if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
      expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pincersId);
      engine.resolveDecision("battleBlocker", { selectedIds: [pincersId] }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
    } finally {
      leaderCard.power = originalPower;
    }
  });

  test("keeps full cost while the Leader has more than 0 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, hand: [op15Pincers013], activeDon: 2 },
      {},
    );

    const pincersInHandId = engine
      .getView("south")
      .players.south.hand.find((card) => card.cardId === "OP15-013")!.instanceId!;
    const failure = engine.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: pincersInHandId,
    });
    expect(failure.reason).toBeTruthy();
  });
});

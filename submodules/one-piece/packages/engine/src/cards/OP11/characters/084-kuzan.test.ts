import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op11Hibari010, op11Kuzan084 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-084 Kuzan", () => {
  test("trashes exactly three cards from the top of its deck on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Kuzan084],
      deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      activeDon: op11Kuzan084.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op11Kuzan084, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 3);
    expect(view.players.south.trash).toHaveLength(3);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking, lets a chosen included Navy Character attack an active Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op11Kuzan084, playedOnTurn: 0 },
          { card: op11Hibari010, playedOnTurn: 0 },
        ],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("south", "character", op11Kuzan084);
    const hibariId = engine.findCardInZone("south", "character", op11Hibari010);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(kuzanId, engine.leader("north"), "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Kuzan's Navy recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([kuzanId, hibariId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hibariId] }, "south");

    engine.declareAttack(hibariId, activeTargetId, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === hibariId)
        ?.rested,
    ).toBe(true);
  });
});

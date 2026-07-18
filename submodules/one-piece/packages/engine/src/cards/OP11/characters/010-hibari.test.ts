import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11Hibari010, op11Koby001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-010 Hibari", () => {
  test("on play reduces an opposing Character by 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11Hibari010], activeDon: 5 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11Hibari010, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(1000);
  });

  test("when attacking gains 1000 and lets an included Navy Leader attack an active Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Koby001,
        character: [{ card: op11Hibari010, playedOnTurn: 0 }],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hibariId = engine.findCardInZone("south", "character", op11Hibari010);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(hibariId, engine.leader("north"), "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity")
      throw new Error("Expected Hibari's Navy Leader choice.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toContain(
      engine.leader("south"),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === hibariId)
        ?.power,
    ).toBe(7000);
    engine.declareAttack(engine.leader("south"), activeTargetId, "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
  });
});

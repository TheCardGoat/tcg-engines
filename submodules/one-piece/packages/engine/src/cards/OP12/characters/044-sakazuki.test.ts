import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op11Koby001,
  op12Sakazuki044,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-044 Sakazuki", () => {
  test("draws two on play with an included Navy Leader trait", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Koby001,
      hand: [op12Sakazuki044],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op12Sakazuki044.cost,
    });
    const firstId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op12Sakazuki044, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
  });

  test("trashes a chosen card, gives one rested DON!! to a chosen own card, and is once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Sakazuki044, eb01Doma005],
      hand: [eb01Fourtricks025, eb01MountainGod018],
      restedDon: 1,
    });
    const sakazukiId = engine.findCardInZone("south", "character", op12Sakazuki044);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const paidId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.activateEffect(sakazukiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paidId] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sakazuki's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), sakazukiId, recipientId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sakazukiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});

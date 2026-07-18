import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op12LuffyIsTheManWhoWillBeKingOfThePirates079,
  op12Sanji041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-079 Luffy Is the Man Who Will Be King of the Pirates!!!", () => {
  test("Sanji Main adds any one of the top three cards and orders the rest on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [op12LuffyIsTheManWhoWillBeKingOfThePirates079],
      deck: [eb01Doma005, eb01MountainGod018, eb01TonyTonyChopper006],
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const topId = engine.findCardInZone("south", "deck", eb01Doma005);
    const bottomId = engine.findCardInZone("south", "deck", eb01TonyTonyChopper006);

    engine.playCard(op12LuffyIsTheManWhoWillBeKingOfThePirates079);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a top-three card choice.");
    expect(step.candidates).toHaveLength(3);
    expect(step.candidates.every((candidate) => candidate.legal)).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [bottomId, topId] },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getState().players.south.deck.slice(-2)).toEqual([bottomId, topId]);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

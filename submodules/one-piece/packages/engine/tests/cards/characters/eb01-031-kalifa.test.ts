import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Doma005,
  eb01Kalifa031,
  eb01MountainGod018,
  op03Iceburg058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-031 Kalifa", () => {
  test("pays optional DON!! -1 before mapping up to 2 low-cost Characters from trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      hand: [eb01Kalifa031],
      trash: [eb01Doma005, eb01Blueno017, eb01MountainGod018],
      activeDon: 6,
    });
    const firstId = engine.findCardInZone("south", "trash", eb01Doma005);
    const secondId = engine.findCardInZone("south", "trash", eb01Blueno017);
    const excludedId = engine.findCardInZone("south", "trash", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(eb01Kalifa031);
    // Printed DON!! −1 is optional ("You may return…")
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Kalifa's trash Character selection.");
    }
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([firstId, secondId]);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline the optional DON!! cost without returning DON!! or searching trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      hand: [eb01Kalifa031],
      trash: [eb01Doma005, eb01Blueno017],
      activeDon: 6,
    });
    const trashIds = [
      engine.findCardInZone("south", "trash", eb01Doma005),
      engine.findCardInZone("south", "trash", eb01Blueno017),
    ];

    engine.playCard(eb01Kalifa031);
    const afterPlay = engine.getView("south").players.south;
    const donDeckAfterPlay = afterPlay.donDeckCount;
    const activeDonAfterPlay = afterPlay.activeDon;

    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    // Play cost was already paid; declining the optional effect must not return more DON!!.
    expect(view.players.south.activeDon).toBe(activeDonAfterPlay);
    expect(view.players.south.donDeckCount).toBe(donDeckAfterPlay);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toEqual(
      expect.arrayContaining(trashIds),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(trashIds),
    );
    expect(view.prompts).toHaveLength(0);
  });
});

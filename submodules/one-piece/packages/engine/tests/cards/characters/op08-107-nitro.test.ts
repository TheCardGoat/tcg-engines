import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08CharlottePudding058,
  op08CharlottePudding067,
  op08Nitro107,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-107 Nitro", () => {
  test("rests itself and targets only a Charlotte Pudding Leader or Character for this turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08CharlottePudding058,
      character: [op08Nitro107, op08CharlottePudding067, eb01Doma005],
    });
    const nitroId = engine.findCardInZone("south", "character", op08Nitro107);
    const puddingId = engine.findCardInZone("south", "character", op08CharlottePudding067);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(nitroId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Nitro's Pudding target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), puddingId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === nitroId)
        ?.rested,
    ).toBe(true);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08CharlottePudding058,
      character: [op08Nitro107, op08CharlottePudding067, eb01Doma005],
    });
    const nitroId = engine.findCardInZone("south", "character", op08Nitro107);
    engine.activateEffect(nitroId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

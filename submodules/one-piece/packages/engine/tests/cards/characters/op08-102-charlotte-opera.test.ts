import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08CharlotteOpera102,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-102 Charlotte Opera", () => {
  test("may trash a hand card to K.O. a Character costing no more than your Life count", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08CharlotteOpera102, eb01Doma005, eb01Fourtricks025],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op08CharlotteOpera102.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const equalCostId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op08CharlotteOpera102, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Opera's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(equalCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [equalCostId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(equalCostId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08CharlotteOpera102, eb01Doma005, eb01Fourtricks025],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op08CharlotteOpera102.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    engine.playCard(op08CharlotteOpera102, "south");
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

import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Shanks120, op09Sanji065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-065 Sanji", () => {
  test("returns a chosen number of DON!!, gains Rush, and rests only a cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Sanji065],
        activeDon: 8,
      },
      { character: [eb01MountainGod018, op01Shanks120] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op09Sanji065, "south");
    const sanjiId = engine.findCardInZone("south", "character", op09Sanji065);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 8 });
    if (payment?.kind !== "payCost") throw new Error("Expected Sanji's variable DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Sanji's rest target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    engine.declareAttack(sanjiId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.rested,
    ).toBe(true);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Sanji065],
        activeDon: 8,
      },
      { character: [eb01MountainGod018, op01Shanks120] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op09Sanji065, "south");
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

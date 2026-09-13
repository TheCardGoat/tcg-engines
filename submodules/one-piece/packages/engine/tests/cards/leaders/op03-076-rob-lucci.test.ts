import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03RobLucci076 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-076 Rob Lucci", () => {
  test("trashes two chosen hand cards to reactivate after the first opposing battle K.O. only", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03RobLucci076,
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const firstTrashId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondTrashId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const unselectedId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.declareAttack(engine.leader("south"), firstTargetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Rob Lucci's controller to choose two hand cards to trash.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstTrashId,
      secondTrashId,
      unselectedId,
    ]);
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstTrashId, secondTrashId] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.rested).toBe(false);
    engine.declareAttack(engine.leader("south"), secondTargetId, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual([
      firstTargetId,
      secondTargetId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      firstTrashId,
      secondTrashId,
    ]);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([unselectedId]);
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03RobLucci076,
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(engine.leader("south"), firstTargetId, "south");
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

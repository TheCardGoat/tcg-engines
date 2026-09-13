import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12Sabo100 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-100 Sabo", () => {
  test("takes top Life as its optional cost, draws two, then trashes one", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12Sabo100, eb01Doma005],
      life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      activeDon: op12Sabo100.cost,
    });
    engine.playCard(op12Sabo100, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Sabo's trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(3);
    expect(view.players.south.hand).toHaveLength(3);
  });

  test("at three Life gains 3 cost and can block", () => {
    const engine = OnePieceTestEngine.create(
      { life: [eb01Doma005, eb01Doma005, eb01Doma005], character: [op12Sabo100] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saboId = engine.findCardInZone("south", "character", op12Sabo100);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === saboId)
        ?.cost,
    ).toBe(op12Sabo100.cost + 3);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sabo as Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(saboId);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12Sabo100, eb01Doma005],
      life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      activeDon: op12Sabo100.cost,
    });
    engine.playCard(op12Sabo100, "south");
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

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Aramaki043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-043 Aramaki", () => {
  test("pays both costs, bottoms either owner's low-cost Character, gains power once, then expires", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op06Aramaki043, eb01Doma005],
        hand: [eb01MountainGod018, eb01Doma005],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const aramakiId = engine.findCardInZone("south", "character", op06Aramaki043);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const discardId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const basePower = op06Aramaki043.power ?? 0;

    engine.activateEffect(aramakiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const handCost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(handCost?.kind).toBe("payCost");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const fieldCost = engine.pendingDecision("effectCostReturnCharacterToDeck", "south").steps[0];
    expect(fieldCost?.kind).toBe("payCost");
    if (fieldCost?.kind !== "payCost") throw new Error("Expected Aramaki's Character cost.");
    expect(fieldCost.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(fieldCost.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision(
      "effectCostReturnCharacterToDeck",
      { selectedIds: [opposingId] },
      "south",
    );

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(engine.getState().players.north.deck.at(-1)).toBe(opposingId);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === aramakiId)?.power,
    ).toBe(basePower + 3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: aramakiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === aramakiId)?.power,
    ).toBe(basePower);
  });

  test("may block an attack directed at its controller's Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Aramaki043] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aramakiId = engine.findCardInZone("south", "character", op06Aramaki043);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Aramaki's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(aramakiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [aramakiId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === aramakiId)?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("may decline optional Activate: Main so costs and power gain do not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op06Aramaki043, eb01Doma005],
        hand: [eb01MountainGod018, eb01Doma005],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const aramakiId = engine.findCardInZone("south", "character", op06Aramaki043);
    const discardId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const basePower = op06Aramaki043.power ?? 0;

    engine.activateEffect(aramakiId, "activateMain", "south");
    const handBefore = engine.getView("south").players.south.hand.length;
    const trashBefore = engine.getView("south").players.south.trash.length;
    const northCharsBefore = engine
      .getView("south")
      .players.north.characters.filter(Boolean).length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.length).toBe(handBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.trash.length).toBe(trashBefore);
    expect(view.players.north.characters.some((card) => card?.instanceId === opposingId)).toBe(
      true,
    );
    expect(view.players.north.characters.filter(Boolean).length).toBe(northCharsBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === aramakiId)?.power,
    ).toBe(basePower);
    expect(view.prompts).toHaveLength(0);
  });
});

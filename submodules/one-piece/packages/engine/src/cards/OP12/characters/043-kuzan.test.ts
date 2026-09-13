import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op12Kuzan043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-043 Kuzan", () => {
  test("gains 1 cost exactly while its controller has at least five cards in hand", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Kuzan043],
      hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: eb01Doma005.cost,
    });
    const kuzanId = engine.findCardInZone("south", "character", op12Kuzan043);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === kuzanId)
        ?.cost,
    ).toBe(op12Kuzan043.cost + 1);

    engine.playCard(eb01Doma005, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === kuzanId)
        ?.cost,
    ).toBe(op12Kuzan043.cost);
  });

  test("pays its hand cost and prevents an opposing Character from attacking through that opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12Kuzan043, eb01Doma005, eb01Fourtricks025],
        activeDon: op12Kuzan043.cost,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12Kuzan043, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Kuzan's hand payment.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paidId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paidId,
    );
    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId,
        targetId: engine.leader("south"),
      }).accepted,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12Kuzan043, eb01Doma005, eb01Fourtricks025],
        activeDon: op12Kuzan043.cost,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    engine.playCard(op12Kuzan043, "south");
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

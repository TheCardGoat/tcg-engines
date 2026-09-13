import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Raizo112 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-112 Raizo", () => {
  test("when attacking may trash a chosen hand card to rest an opponent's DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: op06Raizo112, playedOnTurn: 0 }],
      },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const raizoId = engine.findCardInZone("south", "character", op06Raizo112);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(raizoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const don = engine.pendingDecision("effectRestDonCount", "south").steps[0];
    expect(don).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
  });

  test("Life Trigger plays the resolving card only while the opponent has 3 or less Life", () => {
    const eligible = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { life: [op06Raizo112] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = eligible.findCardInZone("south", "character", eb01MountainGod018);
    const raizoId = eligible.findCardInZone("north", "life", op06Raizo112);

    eligible.declareAttack(attackerId, eligible.leader("north"), "south");
    eligible.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(
      eligible
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === raizoId),
    ).toBe(true);

    const ineligible = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { life: [op06Raizo112] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    ineligible.declareAttack(
      ineligible.findCardInZone("south", "character", eb01MountainGod018),
      ineligible.leader("north"),
      "south",
    );
    ineligible.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const ineligibleView = ineligible.getView("north");
    expect(ineligibleView.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(ineligibleView.players.north.trash).toHaveLength(1);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: op06Raizo112, playedOnTurn: 0 }],
      },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const raizoId = engine.findCardInZone("south", "character", op06Raizo112);
    engine.declareAttack(raizoId, engine.leader("north"), "south");
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

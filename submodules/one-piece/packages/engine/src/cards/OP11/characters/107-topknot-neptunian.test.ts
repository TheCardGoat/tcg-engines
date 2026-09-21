import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11Shirahoshi022 } from "@tcg/op-cards";
import { op11TopknotNeptunian107 } from "../../../../../cards/src/cards/characters/op11-107-topknot-neptunian.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-107 Topknot Neptunian", () => {
  test("turns the top face-up Life face-down and becomes active at turn end only once", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      character: [{ card: op11TopknotNeptunian107, rested: true }],
      life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }],
    });
    const topknotId = engine.findCardInZone("south", "character", op11TopknotNeptunian107);

    engine.activateEffect(topknotId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.life[0]).toMatchObject({ hidden: true });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: topknotId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === topknotId)?.rested,
    ).toBe(false);
  });

  test("may become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11TopknotNeptunian107] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op11TopknotNeptunian107);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      character: [{ card: op11TopknotNeptunian107, rested: true }],
      life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }],
    });
    const topknotId = engine.findCardInZone("south", "character", op11TopknotNeptunian107);
    engine.activateEffect(topknotId, "activateMain", "south");
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

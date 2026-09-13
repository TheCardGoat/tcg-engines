import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03CharlotteLinlin034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-034 Charlotte Linlin", () => {
  test("draws before choosing a hand card for the deck top, then may add active DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03CharlotteLinlin034, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Doma005],
      activeDon: eb03CharlotteLinlin034.cost,
      donDeckCount: 1,
    });
    const returnedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(eb03CharlotteLinlin034);

    engine.acceptLeadingOptional("south");
    const handChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(handChoice?.kind).toBe("selectEntity");
    if (handChoice?.kind !== "selectEntity") {
      throw new Error("Expected Linlin's hand-to-deck choice.");
    }
    expect(handChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      returnedId,
      drawnId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "south");

    engine.acceptLeadingOptional("south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Linlin's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(engine.getState().players.south.deck[0]).toBe(returnedId);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("returns DON!! on K.O. before optionally adding the deck top to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03CharlotteLinlin034, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: 1,
        restedDon: 1,
      },
      { character: [{ card: eb01MountainGod018, attachedDon: 2, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const linlinId = engine.findCardInZone("south", "character", eb03CharlotteLinlin034);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const deckTopId = engine.findCardInZone("south", "deck", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, linlinId, "north");

    engine.acceptLeadingOptional("south");
    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Linlin's DON!! payment.");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    engine.acceptLeadingOptional("south");
    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Linlin's Life choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(linlinId);
    expect(view.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03CharlotteLinlin034, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: 1,
        restedDon: 1,
      },
      { character: [{ card: eb01MountainGod018, attachedDon: 2, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const linlinId = engine.findCardInZone("south", "character", eb03CharlotteLinlin034);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, linlinId, "north");
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

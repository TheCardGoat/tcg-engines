import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01ConquererOfThreeWorldsRagnaraku039 } from "@tcg/op-cards";
import { op15Orlumbus041 } from "../../../../../cards/src/cards/characters/op15-041-orlumbus.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

describe("OP15-041 Orlumbus", () => {
  test("[On K.O.] draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Orlumbus041], activeDon: 2, deck: [eb01Doma005, eb01Doma005, eb01Doma005] },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const orlumbusId = engine.findCardInZone("south", "character", op15Orlumbus041);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [orlumbusId] }, "north");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });

  test("[Activate: Main] returns a Character to gain Rush for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Orlumbus041, eb01Doma005], activeDon: 4 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const orlumbusId = engine.findCardInZone("south", "character", op15Orlumbus041);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(orlumbusId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacterToDeck", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected the return cost.");
    engine.resolveDecision("effectCostReturnCharacterToDeck", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.south.deckCount).toBeGreaterThan(0);
    expect(engine.findCardInZone("south", "deck", eb01Doma005)).toBeTruthy();

    // Rush lets the just-played-turn Character attack immediately.
    engine.declareAttack(orlumbusId, engine.leader("north"), "south");

    const stillLegal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === orlumbusId,
    );
    expect(stillLegal).toBe(false);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-041", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-041"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

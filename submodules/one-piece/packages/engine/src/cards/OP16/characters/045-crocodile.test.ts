import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-045 Crocodile", () => {
  test("[On Play] returning a cost-2-or-more Character may play an Impel Down Character of cost 2 or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-004"], hand: ["OP16-045", "OP16-024"], activeDon: 4 },
      {},
    );
    const curielId = engine.findCardInZone("south", "character", "OP16-004");

    engine.playCard("OP16-045");
    engine.acceptLeadingOptional("south");
    // The lone eligible return candidate (cost >= 2) is Curiel.
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [curielId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-024");
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-004");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining returns nothing and plays nothing", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-004"], hand: ["OP16-045", "OP16-024"], activeDon: 4 },
      {},
    );

    engine.playCard("OP16-045");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-004");
    expect(south.characters.map((card) => card?.cardId)).not.toContain("OP16-024");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

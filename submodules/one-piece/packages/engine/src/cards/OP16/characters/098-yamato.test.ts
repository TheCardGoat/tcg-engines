import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-098 Yamato", () => {
  test("[Activate: Main] trashing itself plays a black [Yamato] of cost 8 from trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-098"], trash: ["OP16-096"], activeDon: 6 },
      {},
    );
    const yamatoId = engine.findCardInZone("south", "character", "OP16-098");

    engine.activateEffect(yamatoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(yamatoId);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-096");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] draws 1 card and trashes 1 card from hand", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-098", "EB01-005"], activeDon: 6 }, {});

    engine.playCard("OP16-098");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-098", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP16-098"),
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

import { describe, expect, test } from "vite-plus/test";
import { op05Koala006, op12UrsaShock096 } from "@tcg/op-cards";
import { op13EmporioIvankov008 } from "../../../../../cards/src/cards/OP13/characters/008-emporio-ivankov.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-008 Emporio.Ivankov", () => {
  test("trashes itself instead of an opponent effect K.O.'ing a Revolutionary Army ally", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13EmporioIvankov008, op05Koala006] },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ivankovId = engine.findCardInZone("south", "character", op13EmporioIvankov008);
    const koalaId = engine.findCardInZone("south", "character", op05Koala006);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koalaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(koalaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ivankovId);
    expect(view.prompts).toHaveLength(0);
  });
});

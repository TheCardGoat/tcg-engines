import { describe, expect, test } from "vite-plus/test";
import { op05Koala006, op12UrsaShock096 } from "@tcg/op-cards";
import { op13EmporioIvankov008 } from "../../../../../cards/src/cards/characters/op13-008-emporio-ivankov.ts";

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
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("can trash itself to replace its own effect K.O. without a K.O. observer firing", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP13-008"] },
      { leaderCardId: "OP01-061", hand: ["OP08-117"], activeDon: 5, life: 1, donDeckCount: 5 },
      { activeSeat: "north" },
    );
    const source = engine.findCardInZone("south", "character", "OP13-008");
    engine.asNorth().play("OP08-117");
    engine.asNorth().acceptOptional();
    engine.asNorth().chooseTargets(source);
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(engine.getView("north").players.north.donDeckCount).toBe(5);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb03Kujyaku041, op11Koby119, op06Tokikake052 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-041 Kujyaku", () => {
  test("trashes a Navy card before drawing 2 on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Kujyaku041, op06Tokikake052, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: 4,
    });
    const navyId = engine.findCardInZone("south", "hand", op06Tokikake052);
    const nonNavyId = engine.findCardInZone("south", "hand", eb01Doma005);
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.playCard(eb03Kujyaku041);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(handBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(nonNavyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(navyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("gives only own cost-6-or-less SWORD Characters +2000 on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb03Kujyaku041, op11Koby119, eb01Doma005],
    });
    const kujyakuId = engine.findCardInZone("south", "character", eb03Kujyaku041);
    const tooExpensiveId = engine.findCardInZone("south", "character", op11Koby119);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kujyakuId)?.power,
    ).toBe(8000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tooExpensiveId)?.power,
    ).toBe(op11Koby119.power);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unrelatedId)?.power,
    ).toBe(eb01Doma005.power);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op10EmporioIvankov102 } from "../../../../../cards/src/cards/OP10/characters/102-emporio-ivankov.ts";
import { op10Inazuma100 } from "../../../../../cards/src/cards/OP10/characters/100-inazuma.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-102 Emporio.Ivankov", () => {
  test("powers Revolutionary Army Characters, then takes the top Life once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10EmporioIvankov102, op10Inazuma100, eb01Doma005],
      life: [eb01Doma005],
    });
    const ivankovId = engine.findCardInZone("south", "character", op10EmporioIvankov102);
    const inazumaId = engine.findCardInZone("south", "character", op10Inazuma100);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    engine.activateEffect(ivankovId, "activateMain", "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [ivankovId, inazumaId] },
      "south",
    );
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ivankovId)?.power,
    ).toBe(7000);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: ivankovId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });
});

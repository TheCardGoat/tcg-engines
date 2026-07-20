import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Shanks028 } from "../../../../../cards/src/cards/OP13/characters/028-shanks.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-028 Shanks", () => {
  test("sets every DON!! active and prevents hand plays only for the current turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Shanks028, eb01Doma005],
      activeDon: op13Shanks028.cost,
      restedDon: 2,
    });
    const domaId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Shanks028, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 12, restedDon: 0 });
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: domaId }).reason,
    ).toBe("A card effect prevents this card from being played.");

    engine.endTurn("south");
    engine.endTurn("north");
    engine.playCard(eb01Doma005, "south");

    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(domaId);
    expect(view.prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01Hamlet024 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-024 Hamlet", () => {
  test("buffs itself and compound-trait SMILE Characters once hand size reaches four", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb01Hamlet024, eb01Fourtricks025],
      hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: 1,
    });
    const hamletId = engine.findCardInZone("south", "character", eb01Hamlet024);
    const fourtricksId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === hamletId)?.power).toBe(
      4000,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fourtricksId)?.power,
    ).toBe(5000);

    engine.playCard(eb01Doma005);

    view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(4);
    expect(view.players.south.characters.find((card) => card?.instanceId === hamletId)?.power).toBe(
      5000,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fourtricksId)?.power,
    ).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.cardId === eb01Doma005.id)?.power,
    ).toBe(3000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

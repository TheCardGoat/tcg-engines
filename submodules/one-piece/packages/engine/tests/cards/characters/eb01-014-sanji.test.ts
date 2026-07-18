import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Sanji014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-014 Sanji", () => {
  test("updates its turn-only power for each complete group of 3 rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb01Sanji014, attachedDon: 1 }],
      hand: [eb01Doma005],
      activeDon: 1,
      restedDon: 5,
    });
    const sanjiId = engine.findCardInZone("south", "character", eb01Sanji014);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe(7000);

    engine.playCard(eb01Doma005);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe(8000);

    engine.endTurn("south");
    const opponentTurnSanji = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === sanjiId);
    expect(opponentTurnSanji?.attachedDon).toBe(1);
    expect(opponentTurnSanji?.power).toBe(5000);
  });
});

import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op10Mocha015,
  op10Sengoku031,
  op10Smoker001,
  op10Smoker030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-001 Smoker", () => {
  test("readies two DON!! with a 7000-power Character and buffs either listed type on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Smoker001,
      character: [op10Smoker030, op10Sengoku031, op10Mocha015, eb01Doma005],
      restedDon: 2,
    });
    const navyId = engine.findCardInZone("south", "character", op10Sengoku031);
    const punkHazardId = engine.findCardInZone("south", "character", op10Mocha015);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 0 });

    engine.endTurn("south");

    const characters = new Map(
      engine
        .getView("south")
        .players.south.characters.flatMap((card) =>
          card ? [[card.instanceId, card.power] as const] : [],
        ),
    );
    expect(characters.get(navyId)).toBe(8000);
    expect(characters.get(punkHazardId)).toBe(4000);
    expect(characters.get(excludedId)).toBe(3000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01King091 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-091 King", () => {
  test("reduces every opposing Character by 1000 only on its 10-DON!! turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op01King091, activeDon: 10 },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );

    let characters = engine.getView("south").players.north.characters;
    expect(characters.flatMap((card) => (card ? [card.power] : []))).toEqual([2000, 4000]);

    engine.endTurn("south");
    characters = engine.getView("south").players.north.characters;
    expect(characters.flatMap((card) => (card ? [card.power] : []))).toEqual([3000, 5000]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05SaintCharlos084 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-084 Saint Charlos", () => {
  test("during its controller's turn, reduces every opposing Character while only Celestial Dragons are present", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05SaintCharlos084] },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    let opposingCharacters = engine
      .getView("south")
      .players.north.characters.filter((card) => card !== null);
    expect(opposingCharacters.map((card) => card?.cost)).toEqual([0, 1]);

    engine.endTurn("south");
    opposingCharacters = engine
      .getView("south")
      .players.north.characters.filter((card) => card !== null);
    expect(opposingCharacters.map((card) => card?.cost)).toEqual([1, 5]);
  });

  test("does not reduce opposing Characters while a non-Celestial Dragons Character is present", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05SaintCharlos084, eb01Doma005] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(5);
  });
});

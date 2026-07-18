import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05SaintRosward092,
  op13StShepherdJuPeter084,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-092 Saint Rosward", () => {
  test("during its turn reduces all opposing costs when every Character includes Celestial Dragons", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05SaintRosward092, op13StShepherdJuPeter084] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(eb01MountainGod018.cost);
  });

  test("does not reduce costs while a non-Celestial-Dragons Character is present", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05SaintRosward092, eb01Doma005] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(eb01MountainGod018.cost);
  });
});

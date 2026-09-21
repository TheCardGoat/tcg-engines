import { describe, expect, test } from "vite-plus/test";
import { eb02GumGumGiantPistol021 } from "@tcg/op-cards";
import { op15Cavendish006 } from "../../../../../cards/src/cards/characters/op15-006-cavendish.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-006 Cavendish", () => {
  test("gains +2000 power with 4 or more Events in the trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Cavendish006],
        trash: [
          eb02GumGumGiantPistol021,
          eb02GumGumGiantPistol021,
          eb02GumGumGiantPistol021,
          eb02GumGumGiantPistol021,
        ],
      },
      {},
    );

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(6000);
  });

  test("keeps base power with fewer than 4 Events in the trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Cavendish006],
        trash: [eb02GumGumGiantPistol021, eb02GumGumGiantPistol021, eb02GumGumGiantPistol021],
      },
      {},
    );

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07RoronoaZoro034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-034 Roronoa Zoro", () => {
  test("gains 2000 power when attacking with at least three Characters", () => {
    for (const characterCount of [2, 3]) {
      const engine = OnePieceTestEngine.create(
        {
          character: [
            { card: op07RoronoaZoro034, playedOnTurn: 0 },
            ...Array.from({ length: characterCount - 1 }, () => eb01Doma005),
          ],
        },
        {},
        { firstPlayer: "north", activeSeat: "south" },
      );
      const zoroId = engine.findCardInZone("south", "character", op07RoronoaZoro034);

      engine.declareAttack(zoroId, engine.leader("north"), "south");

      expect(
        engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
          ?.power,
      ).toBe(characterCount >= 3 ? 4000 : 2000);
    }
  });
});

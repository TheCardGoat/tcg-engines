import { describe, expect, test } from "vite-plus/test";
import { st01RoronoaZoro013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST01-013 Roronoa Zoro", () => {
  test("an attached DON!! adds its own power plus the printed +1000 modifier", () => {
    const engine = OnePieceTestEngine.create({
      character: [st01RoronoaZoro013],
      activeDon: 1,
    });
    const zoroId = engine.findCardInZone("south", "character", st01RoronoaZoro013);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
        ?.power,
    ).toBe(5000);

    engine.attachDon(zoroId, 1, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === zoroId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});

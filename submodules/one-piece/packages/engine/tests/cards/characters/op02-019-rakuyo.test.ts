import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Rakuyo019 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-019 Rakuyo", () => {
  test("with DON!! x1 during its controller's turn, gives all Whitebeard Pirates Characters +1000", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Rakuyo019, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const rakuyoId = engine.findCardInZone("south", "character", op02Rakuyo019);
    const compoundTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    let characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === rakuyoId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === compoundTraitId)?.power).toBe(3000);
    expect(characters.find((card) => card?.instanceId === unrelatedId)?.power).toBe(5000);

    engine.attachDon(rakuyoId, 1, "south");

    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === rakuyoId)).toMatchObject({
      attachedDon: 1,
      power: 6000,
    });
    expect(characters.find((card) => card?.instanceId === compoundTraitId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === unrelatedId)?.power).toBe(5000);

    engine.endTurn("south");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === rakuyoId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === compoundTraitId)?.power).toBe(3000);

    engine.endTurn("north");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === rakuyoId)).toMatchObject({
      attachedDon: 0,
      power: 4000,
    });
    expect(characters.find((card) => card?.instanceId === compoundTraitId)?.power).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

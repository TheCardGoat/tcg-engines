import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op14eb04Chambres017, op14eb04ScaledNeptunian011 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-017 Chambres", () => {
  test("swaps two opposing Characters' base power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op14eb04Chambres017], activeDon: 3 },
      { character: [eb01Doma005, op14eb04ScaledNeptunian011] },
    );
    const lowId = engine.findCardInZone("north", "character", eb01Doma005);
    const highId = engine.findCardInZone("north", "character", op14eb04ScaledNeptunian011);
    engine.playCard(op14eb04Chambres017);
    let characters = engine.getView("south").players.north.characters;
    expect(characters.find((card) => card?.instanceId === lowId)?.power).toBe(8000);
    expect(characters.find((card) => card?.instanceId === highId)?.power).toBe(3000);
    engine.endTurn("south");
    characters = engine.getView("south").players.north.characters;
    expect(characters.find((card) => card?.instanceId === lowId)?.power).toBe(3000);
    expect(characters.find((card) => card?.instanceId === highId)?.power).toBe(8000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

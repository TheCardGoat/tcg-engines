import { eb01Doma005, op01Bepo049, op12DonquixoteRosinante048 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op12TrafalgarLaw073 } from "../../../../../cards/src/cards/OP12/characters/073-trafalgar-law.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-073 Trafalgar Law", () => {
  test("buffs Donquixote Rosinante and included Heart Pirates after its DON!! comparison", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12TrafalgarLaw073],
        character: [op12DonquixoteRosinante048, op01Bepo049, eb01Doma005],
        activeDon: op12TrafalgarLaw073.cost,
      },
      { activeDon: op12TrafalgarLaw073.cost },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op12DonquixoteRosinante048);
    const bepoId = engine.findCardInZone("south", "character", op01Bepo049);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op12TrafalgarLaw073, "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === rosinanteId)?.power).toBe(
      (op12DonquixoteRosinante048.power ?? 0) + 1000,
    );
    expect(characters.find((card) => card?.instanceId === bepoId)?.power).toBe(
      (op01Bepo049.power ?? 0) + 1000,
    );
    expect(characters.find((card) => card?.instanceId === excludedId)?.power).toBe(
      eb01Doma005.power,
    );
    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === bepoId)
        ?.power,
    ).toBe((op01Bepo049.power ?? 0) + 1000);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === bepoId)
        ?.power,
    ).toBe(op01Bepo049.power);
  });
});

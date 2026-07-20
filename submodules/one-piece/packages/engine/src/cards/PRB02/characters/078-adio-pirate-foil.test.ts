import { eb01Doma005, op01Shanks120, op10Brook035, op10Franky034 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02AdioPirateFoil078 } from "../../../../../cards/src/cards/PRB02/characters/078-adio-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-078 Adio (Pirate Foil)", () => {
  test("gains power only after two included ODYSSEY Characters become rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          prb02AdioPirateFoil078,
          { card: op10Franky034, playedOnTurn: 0 },
          { card: op10Brook035, playedOnTurn: 0 },
        ],
      },
      { hand: [], character: [{ card: op01Shanks120, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const adioId = engine.findCardInZone("south", "character", prb02AdioPirateFoil078);
    const frankyId = engine.findCardInZone("south", "character", op10Franky034);
    const brookId = engine.findCardInZone("south", "character", op10Brook035);
    const targetId = engine.findCardInZone("north", "character", op01Shanks120);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === adioId)
        ?.power,
    ).toBe(prb02AdioPirateFoil078.power);

    engine.declareAttack(frankyId, targetId, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === adioId)
        ?.power,
    ).toBe(prb02AdioPirateFoil078.power);

    engine.declareAttack(brookId, targetId, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === adioId)
        ?.power,
    ).toBe((prb02AdioPirateFoil078.power ?? 0) + 1000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === adioId)
        ?.power,
    ).toBe((prb02AdioPirateFoil078.power ?? 0) + 1000);
    engine.endTurn("north");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === adioId)?.power).toBe(
      prb02AdioPirateFoil078.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not count a rested Character without the ODYSSEY type", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        prb02AdioPirateFoil078,
        { card: op10Franky034, rested: true },
        { card: eb01Doma005, rested: true },
      ],
    });
    const adioId = engine.findCardInZone("south", "character", prb02AdioPirateFoil078);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === adioId)?.power).toBe(
      prb02AdioPirateFoil078.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});

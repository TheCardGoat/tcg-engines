import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, op04Koza006, op04Nami011, op04NefeltariCobra012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-012 Nefeltari Cobra", () => {
  test("during its turn boosts every other own inclusive Alabasta Character only", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op04NefeltariCobra012, playedOnTurn: 0 },
          { card: op04Nami011, playedOnTurn: 0 },
          { card: op04Koza006, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cobraId = engine.findCardInZone("south", "character", op04NefeltariCobra012);
    const compoundAlabastaId = engine.findCardInZone("south", "character", op04Nami011);
    const exactAlabastaId = engine.findCardInZone("south", "character", op04Koza006);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    let characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === cobraId)?.power).toBe(0);
    expect(characters.find((card) => card?.instanceId === compoundAlabastaId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === exactAlabastaId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === unrelatedId)?.power).toBe(5000);

    engine.endTurn("south");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === cobraId)?.power).toBe(0);
    expect(characters.find((card) => card?.instanceId === compoundAlabastaId)?.power).toBe(3000);
    expect(characters.find((card) => card?.instanceId === exactAlabastaId)?.power).toBe(3000);
    expect(characters.find((card) => card?.instanceId === unrelatedId)?.power).toBe(5000);

    engine.endTurn("north");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === cobraId)?.power).toBe(0);
    expect(characters.find((card) => card?.instanceId === compoundAlabastaId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === exactAlabastaId)?.power).toBe(4000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

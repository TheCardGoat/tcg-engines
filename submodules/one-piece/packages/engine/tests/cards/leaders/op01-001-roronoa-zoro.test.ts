import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01RoronoaZoro001 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-001 Roronoa Zoro", () => {
  test("dynamically gives every own Character +1000 only during its DON-attached turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      character: [eb01Doma005, eb01Fourtricks025],
      activeDon: 1,
    });
    const firstId = engine.findCardInZone("south", "character", eb01Doma005);
    const secondId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.attachDon(engine.leader("south"), 1, "south");
    let characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === firstId)?.power).toBe(4000);
    expect(characters.find((card) => card?.instanceId === secondId)?.power).toBe(6000);

    engine.endTurn("south");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === firstId)?.power).toBe(3000);
    expect(characters.find((card) => card?.instanceId === secondId)?.power).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op09Shanks004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-004 Shanks", () => {
  test("permanently gives every opposing Character -1000 and attacks immediately with Rush", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09Shanks004], activeDon: op09Shanks004.cost },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const secondId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op09Shanks004, "south");
    const shanksId = engine.findCardInZone("south", "character", op09Shanks004);
    const characters = engine.getView("south").players.north.characters;
    expect(characters.find((card) => card?.instanceId === firstId)?.power).toBe(
      (eb01Fourtricks025.power ?? 0) - 1000,
    );
    expect(characters.find((card) => card?.instanceId === secondId)?.power).toBe(
      (eb01MountainGod018.power ?? 0) - 1000,
    );

    expect(() => engine.declareAttack(shanksId, engine.leader("north"), "south")).not.toThrow();
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});

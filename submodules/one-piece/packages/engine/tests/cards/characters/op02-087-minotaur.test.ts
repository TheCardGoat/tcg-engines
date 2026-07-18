import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EmporioIvankov049,
  op02Minotaur087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-087 Minotaur", () => {
  test("deals 2 Life damage with Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Minotaur087, playedOnTurn: 0 }] },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const minotaurId = engine.findCardInZone("south", "character", op02Minotaur087);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(minotaurId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("adds a rested DON!! after battle K.O. with a compound Impel Down Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EmporioIvankov049,
        character: [{ card: op02Minotaur087, rested: true, playedOnTurn: 0 }],
        donDeckCount: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const minotaurId = engine.findCardInZone("south", "character", op02Minotaur087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, minotaurId, "north");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Minotaur's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minotaurId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not add DON!! after battle K.O. without an Impel Down Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Minotaur087, rested: true, playedOnTurn: 0 }], donDeckCount: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const minotaurId = engine.findCardInZone("south", "character", op02Minotaur087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, minotaurId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minotaurId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});

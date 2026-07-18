import { describe, expect, test } from "vite-plus/test";
import { op07Hamburg068 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-068 Hamburg", () => {
  test("with DON!! x1 and no DON!! advantage, adds up to one rested DON!! when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07Hamburg068, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hamburgId = engine.findCardInZone("south", "character", op07Hamburg068);
    engine.attachDon(hamburgId, 1, "south");

    engine.declareAttack(hamburgId, engine.leader("north"), "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Hamburg's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hamburgId)?.attachedDon,
    ).toBe(1);
  });

  test("does not add DON!! without the attached DON!! condition", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op07Hamburg068, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hamburgId = engine.findCardInZone("south", "character", op07Hamburg068);

    engine.declareAttack(hamburgId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectAddDon", "south")).toThrow();
  });
});

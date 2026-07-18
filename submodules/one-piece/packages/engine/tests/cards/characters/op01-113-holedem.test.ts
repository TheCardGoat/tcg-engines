import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Holedem113 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-113 Holedem", () => {
  test("when battle K.O.'d, may add one rested DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Holedem113, rested: true }],
        donDeckCount: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const holedemId = engine.findCardInZone("south", "character", op01Holedem113);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, holedemId, "north");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Holedem's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(holedemId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});

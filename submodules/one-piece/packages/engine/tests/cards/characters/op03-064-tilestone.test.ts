import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03Iceburg058, op03Tilestone064 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function koTilestone(leaderCardId?: typeof op03Iceburg058) {
  const engine = OnePieceTestEngine.create(
    {
      ...(leaderCardId ? { leaderCardId } : {}),
      character: [{ card: op03Tilestone064, rested: true }],
    },
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const tilestoneId = engine.findCardInZone("south", "character", op03Tilestone064);
  const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
  engine.declareAttack(attackerId, tilestoneId, "north");
  return engine;
}

describe("OP03-064 Tilestone", () => {
  test("with an included Galley-La Company Leader may add one rested DON!! when K.O.'d", () => {
    const engine = koTilestone(op03Iceburg058);
    const before = engine.getView("south").players.south;

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Tilestone's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.donDeckCount).toBe(before.donDeckCount - 1);
    expect(after.restedDon).toBe(before.restedDon + 1);
    expect(after.characters).not.toContainEqual(
      expect.objectContaining({ cardId: op03Tilestone064.id }),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not offer DON!! without a Galley-La Company Leader", () => {
    const engine = koTilestone();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

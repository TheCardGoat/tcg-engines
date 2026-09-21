import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-107 Jesus Burgess", () => {
  test("[On K.O.] adds the top card of the opponent's Life to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-107", rested: true }] },
      { character: ["OP16-003"], activeDon: 5, life: ["OP13-013", "EB01-005", "OP16-004"] },
    );
    const burgessId = engine.findCardInZone("south", "character", "OP16-107");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-107");

    const north = engine.getView("south").players.north;
    expect(north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      burgessId,
    );
    // The removed Life card reached the owner's hand (verify via game state).
    engine.findCardInZone("north", "hand", "OP13-013");
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-107", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-107",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

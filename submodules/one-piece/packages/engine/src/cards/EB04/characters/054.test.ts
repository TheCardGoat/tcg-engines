import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-054", () => {
  test("[On K.O.] adds the top card of the opponent's Life to the owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-054", rested: true }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const koId = engine.findCardInZone("south", "character", "EB04-054");

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    const handBefore = engine.getView("south").players.north.handCount;
    engine.asNorth().attack("OP16-003", "EB04-054");
    const remove = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    if (remove?.kind !== "chooseOption") throw new Error("Expected the Life count choice.");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(koId);
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").players.north.handCount).toBe(handBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

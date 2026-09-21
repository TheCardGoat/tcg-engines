import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-053 Barbell", () => {
  test("[Activate: Main] with hand cards boosts power", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-053"], hand: ["EB01-005", "EB01-005"], activeDon: 6, donDeckCount: 8 },
      {},
    );
    const barbellId = engine.findCardInZone("south", "character", "OP17-053");
    const base =
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === barbellId)
        ?.power ?? 0;

    engine.activateEffect(barbellId, "activateMain", "south");
    const handId = engine.getView("south").players.south.hand[0]?.instanceId;
    if (!handId) throw new Error("no hand card");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [handId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === barbellId)
        ?.power,
    ).toBe(base + 3000);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-053", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-053",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

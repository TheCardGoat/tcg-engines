import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-016 Ramba", () => {
  test("printed Counter +1000 stops an equal-power Leader attack", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-016"], life: 3 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const counterId = engine.findCardInZone("south", "hand", "OP16-016");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [counterId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      counterId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Benn.Beckman (OP17-027) cost=7 power=9000 counter=9000
describe("OP17-027 Benn.Beckman", () => {
  test("[Rush: Character] lets it attack a rested Character on the turn it is played; [On Play] draws and rests with a Red-Haired Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-020", hand: ["OP17-027"], activeDon: 9 },
      { character: [{ cardId: "OP13-013", rested: true }, "OP16-012"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const bennId = engine.findCardInZone("north", "character", "OP16-012");
    const handBefore = engine.getView("south").players.south.handCount;

    engine.playCard("OP17-027");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rest targets.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bennId] }, "south");

    const north = () => engine.getView("south").players.north;
    // Benn Beckman is rested and one card was drawn (the played card left the hand).
    expect(north().characters.find((c) => c?.instanceId === bennId)?.rested).toBe(true);
    expect(engine.getView("south").players.south.handCount).toBe(handBefore - 1 + 1);

    engine.asSouth().attack("OP17-027", "OP13-013");
    expect(north().trash.map((c) => c.instanceId)).toContain(higumaId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-027", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-027",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

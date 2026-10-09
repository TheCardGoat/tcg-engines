import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-012 Blenheim", () => {
  test.each(["EB01-005", "OP03-020", "skip"])(
    "blocks, then optionally plays a cost-1 Whitebeard Pirates card: %s",
    (selection) => {
      const engine = OnePieceTestEngine.create(
        { character: ["OP17-012"], hand: ["EB01-005", "OP03-020", "OP17-012", "OP13-013"] },
        {},
        { activeSeat: "north" },
      );
      const blenheim = engine.findCardInZone("south", "character", "OP17-012");
      const doma = engine.findCardInZone("south", "hand", "EB01-005");
      const striker = engine.findCardInZone("south", "hand", "OP03-020");
      const life = engine.getView("south").players.south.lifeCount;
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
      engine.resolveDecision("battleBlocker", { selectedIds: [blenheim] }, "south");
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
      const step = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected Blenheim play choice");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([doma, striker]);
      expect(step.min).toBe(0);
      engine.resolveDecision(
        "effectPlaySelection",
        { selectedIds: selection === "skip" ? [] : [selection === "EB01-005" ? doma : striker] },
        "south",
      );
      const south = engine.getView("south").players.south;
      expect(south.lifeCount).toBe(life);
      expect(south.trash.some((c) => c.instanceId === blenheim)).toBe(true);
      if (selection === "EB01-005")
        expect(south.characters.some((c) => c?.instanceId === doma)).toBe(true);
      else if (selection === "OP03-020") expect(south.stage?.instanceId).toBe(striker);
      else expect(south.handCount).toBe(4);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});

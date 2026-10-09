import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-028 Bonk Punch & Monster", () => {
  test.each([true, false])(
    "On Play selects only rested cost-6-or-less Characters; select=%s",
    (select) => {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP17-028"], activeDon: 4 },
        {
          character: [
            { cardId: "OP15-032", rested: true },
            { cardId: "OP16-063", rested: true },
            "EB01-005",
          ],
        },
      );
      const target = engine.findCardInZone("north", "character", "OP15-032");
      engine.playCard("OP17-028");
      const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected KO choice");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
      expect(step.min).toBe(0);
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: select ? [target] : [] },
        "south",
      );
      const north = engine.getView("south").players.north;
      expect(north.trash.some((c) => c.instanceId === target)).toBe(select);
      expect(north.characters.some((c) => c?.instanceId === target)).toBe(!select);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("Blocker redirects an attack and protects the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-028"] },
      {},
      { activeSeat: "north" },
    );
    const blocker = engine.findCardInZone("south", "character", "OP17-028");
    const life = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "south");
    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(life);
    expect(south.trash.some((c) => c.instanceId === blocker)).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

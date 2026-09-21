import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-058 Kaido", () => {
  test("[When Attacking] DON!! -1 gives an opposing Character -2000 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-058", activeDon: 5 },
      { character: [{ cardId: "EB04-048", rested: true }], activeDon: 5 },
    );
    const lucciId = engine.findCardInZone("north", "character", "EB04-048");

    // The 6000-power defender would beat the 5000 Leader without the -2000.
    engine.asSouth().attack(engine.leader("south"), lucciId);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The DON!! -1 cost auto-pays; pick the -2000 target.
    const debuff = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (debuff?.kind !== "selectEntity") throw new Error("Expected the -2000 target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lucciId] }, "south");

    // Debuffed to 4000, the defender loses the battle instead.
    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(lucciId);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).not.toContain(
      engine.leader("south"),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the Leader battles and deals damage normally", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-058", activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

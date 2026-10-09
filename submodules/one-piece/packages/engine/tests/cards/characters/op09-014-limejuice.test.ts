import { describe, expect, test } from "vite-plus/test";
import { eb01Blueno017, eb01Doma005, op09Limejuice014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-014 Limejuice", () => {
  test("may restrict only a low-power Character that actually has Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09Limejuice014], activeDon: op09Limejuice014.cost },
      { character: [eb01Blueno017, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blockerId = engine.findCardInZone("north", "character", eb01Blueno017);
    const vanillaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op09Limejuice014, "south");

    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") {
      throw new Error("Expected Limejuice's Blocker choice.");
    }
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(vanillaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: chosen Blocker stays disabled after its power rises above4000, then recovers next turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP09-014", "OP04-056"], character: ["OP09-004"], activeDon: 9 },
      { character: ["P-101"], life: 4 },
    );
    const blocker = e.findCardInZone("north", "character", "P-101");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
    e.asSouth().play("OP09-014");
    e.asSouth().chooseTargets(blocker);
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "OP09-004"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(blocker);
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(blocker);
  });
});

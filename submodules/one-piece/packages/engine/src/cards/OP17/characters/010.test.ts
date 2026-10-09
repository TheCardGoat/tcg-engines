import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-010 Fossa", () => {
  test("gains power and can actually Block during the opponent turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-010"] },
      { character: [{ cardId: "OP17-005" }] },
    );
    const fossa = e.findCardInZone("south", "character", "OP17-010");
    e.activateEffect(fossa, "activateMain", "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === fossa)?.power,
    ).toBe(5000);
    e.endTurn("south");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleBlocker", { selectedIds: [fossa] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(fossa);
  });
  test("synthetic named Leader counts as another Fossa per the all-names FAQ", () => {
    const leader = getCard("OP01-001"),
      saved = leader.alternateNames;
    try {
      // There is no all-names Leader in this catalog. Isolate the named-Leader boundary.
      leader.alternateNames = ["Fossa"];
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP01-001", character: ["OP17-010"] },
        { character: ["OP17-005"] },
      );
      const fossa = e.findCardInZone("south", "character", "OP17-010");
      const failed = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: fossa,
        trigger: "activateMain",
      });
      const restored = OnePieceTestEngine.fromState(failed.state);
      expect(
        restored.getView("south").players.south.characters.find((c) => c?.instanceId === fossa)
          ?.power,
      ).toBe(3000);
      expect(restored.getView("south").prompts).toHaveLength(0);
    } finally {
      if (saved === undefined) delete leader.alternateNames;
      else leader.alternateNames = saved;
    }
  });
});

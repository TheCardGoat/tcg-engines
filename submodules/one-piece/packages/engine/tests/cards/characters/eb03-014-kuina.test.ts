import { describe, expect, test } from "vite-plus/test";
import { eb01KouzukiOden001, eb03Kuina014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-014 Kuina", () => {
  test("rests itself and lets its controller give two rested DON!! to a Slash Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01KouzukiOden001,
      character: [eb03Kuina014],
      restedDon: 2,
    });
    const kuinaId = engine.findCardInZone("south", "character", eb03Kuina014);

    engine.activateEffect(kuinaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Kuina's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === kuinaId)?.rested).toBe(
      true,
    );
    expect(view.players.south.leader.attachedDon).toBe(2);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01KouzukiOden001,
      character: [eb03Kuina014],
      restedDon: 2,
    });
    const kuinaId = engine.findCardInZone("south", "character", eb03Kuina014);
    engine.activateEffect(kuinaId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

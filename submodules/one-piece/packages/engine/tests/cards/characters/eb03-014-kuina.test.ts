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
});

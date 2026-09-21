import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-020 Shanks", () => {
  test("[Activate:Main] rest DON or trash hand to freeze opposing rested Characters", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-020", hand: ["EB01-005"], character: ["OP17-020"], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );
    const shanksId = engine.leader("south");
    engine.activateEffect(shanksId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the freeze target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate:Main] declined freezes nothing", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-020", hand: ["EB01-005"], character: ["OP17-020"], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").players.south.activeDon).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

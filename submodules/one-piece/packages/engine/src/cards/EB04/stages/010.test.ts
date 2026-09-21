import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-010 Lulucia Kingdom", () => {
  test("[On Play] resolves and places the Stage", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-010"], activeDon: 15 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("EB04-010");
    engine.acceptLeadingOptional("south");
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [drop.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.stage).toBeTruthy();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined sets no power to 0", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-010"], activeDon: 15 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const before = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId)?.power;

    engine.playCard("EB04-010");
    // The "up to 1" target selection IS the decline point.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const after = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(after?.power).toBe(before);
    expect(engine.getView("south").players.south.stage?.cardId).toBe("EB04-010");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

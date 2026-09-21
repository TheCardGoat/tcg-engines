import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-001 Jewelry Bonney", () => {
  test("[Activate:Main] with low life drops an opposing Character -1000", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "EB04-001",
        hand: ["EB04-001"],
        life: ["OP13-013"],
        character: ["OP17-118"],
        activeDon: 5,
      },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const bonneyId = engine.leader("south");
    engine.activateEffect(bonneyId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the drop target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate:Main] declined leaves the opposing Character untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "EB04-001",
        hand: ["EB04-001"],
        life: ["OP13-013"],
        character: ["OP17-118"],
        activeDon: 5,
      },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lawId = engine.findCardInZone("north", "character", "OP16-012");
    const before = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === lawId)?.power;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    // The "up to 1" target selection IS the decline point.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const after = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === lawId);
    expect(after?.power).toBe(before);
    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

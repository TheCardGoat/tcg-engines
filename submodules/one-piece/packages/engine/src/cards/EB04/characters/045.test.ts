import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-045", () => {
  test("[Activate: Main] rests itself and boosts a {Revolutionary Army} card when two 8-cost Characters exist", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-045", rested: false }, "OP16-003", "OP17-005", "OP16-093"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-045");
    const kumaId = engine.findCardInZone("south", "character", "OP16-093");
    const kumaPower = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === kumaId)?.power;

    engine.activateEffect(selfId, "activateMain", "south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    expect(boost.candidates.map((c) => c.ref.id)).toContain(kumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kumaId] }, "south");

    const boosted = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === kumaId);
    expect(boosted?.power).toBe((kumaPower ?? 0) + 1000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === selfId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] is rejected with fewer than two 8-cost Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-045", rested: false }, "OP16-003"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-045");

    expect(() => engine.activateEffect(selfId, "activateMain", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

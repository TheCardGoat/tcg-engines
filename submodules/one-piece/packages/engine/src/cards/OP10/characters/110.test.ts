import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-110", () => {
  test("[On Play] rests an opposing Character with cost up to the opponent's Life count", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP10-110"], activeDon: 5 },
      { character: ["OP13-013", "OP16-004"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP10-110");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    const candidateIds = rest.candidates.map((c) => c.ref.id);
    expect(candidateIds).toContain(higumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const rested = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(rested?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining rests nothing", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP10-110"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP10-110");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const rested = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(rested?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

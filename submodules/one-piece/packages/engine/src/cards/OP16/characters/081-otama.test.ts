import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-081 Otama", () => {
  test("[Activate: Main] resting this Character gives an opposing Character -2000 power with a cost-8+ ally", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-081", "OP16-003"], activeDon: 5 },
      { character: ["OP13-013"] },
    );
    const otamaId = engine.findCardInZone("south", "character", "OP16-081");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.activateEffect(otamaId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(1000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === otamaId)
        ?.rested,
    ).toBe(true);
  });

  test("declining the rest payment keeps Otama active", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-081"], activeDon: 5 },
      { character: ["OP13-013"] },
    );
    const otamaId = engine.findCardInZone("south", "character", "OP16-081");

    engine.activateEffect(otamaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === otamaId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("erratum: an opponent-only cost8 Character enables the reduction", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP16-081"] },
      { character: ["OP16-003", "OP13-013"] },
    );
    e.activateEffect(e.findCardInZone("south", "character", "OP16-081"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "OP13-013")] },
      "south",
    );
    expect(e.getView("south").players.north.characters[1]?.power).toBe(1000);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("can pay the rest cost with no cost8 Character but causes no reduction", () => {
    const e = OnePieceTestEngine.create({ character: ["OP16-081"] }, { character: ["OP13-013"] });
    e.activateEffect(e.findCardInZone("south", "character", "OP16-081"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(3000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

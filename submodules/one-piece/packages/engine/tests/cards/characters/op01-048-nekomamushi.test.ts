import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Nekomamushi048 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-048 Nekomamushi", () => {
  test("on play rests only an opposing Character with a cost of 3 or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01Nekomamushi048], activeDon: 2 },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op01Nekomamushi048, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Nekomamushi's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});

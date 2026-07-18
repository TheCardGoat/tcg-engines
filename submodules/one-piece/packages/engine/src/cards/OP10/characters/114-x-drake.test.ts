import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op10XDrake114 } from "../../../../../cards/src/cards/OP10/characters/114-x-drake.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-114 X.Drake", () => {
  test("rests itself before checking Life, then rests only a cost-4-or-less opponent when eligible", () => {
    const eligible = OnePieceTestEngine.create(
      {
        character: [op10XDrake114],
        life: [eb01Doma005],
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
        life: [eb01Doma005],
      },
    );
    const drakeId = eligible.findCardInZone("south", "character", op10XDrake114);
    const costThreeId = eligible.findCardInZone("north", "character", eb01Doma005);
    const costFiveId = eligible.findCardInZone("north", "character", eb01MountainGod018);

    eligible.activateEffect(drakeId, "activateMain", "south");
    eligible.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = eligible.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected X.Drake's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(costThreeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(costFiveId);
    eligible.resolveDecision("effectTargetSelection", { selectedIds: [costThreeId] }, "south");
    expect(
      eligible
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === costThreeId)?.rested,
    ).toBe(true);

    const ineligible = OnePieceTestEngine.create(
      { character: [op10XDrake114], life: [eb01Doma005, eb01Doma005] },
      { character: [eb01Doma005], life: [eb01Doma005] },
    );
    const ineligibleDrake = ineligible.findCardInZone("south", "character", op10XDrake114);
    ineligible.activateEffect(ineligibleDrake, "activateMain", "south");
    ineligible.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(
      ineligible
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ineligibleDrake)?.rested,
    ).toBe(true);
    expect(ineligible.getView("south").prompts).toHaveLength(0);
  });
});

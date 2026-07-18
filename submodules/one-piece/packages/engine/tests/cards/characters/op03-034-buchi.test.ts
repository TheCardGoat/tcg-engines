import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op03Buchi034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-034 Buchi", () => {
  test("K.O.s only an opposing rested cost-2-or-less Character on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Buchi034], activeDon: op03Buchi034.cost },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
          eb01TonyTonyChopper006,
        ],
      },
    );
    const legalId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeLowCostId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);

    engine.playCard(op03Buchi034, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Buchi's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(legalId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeLowCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [legalId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      legalId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

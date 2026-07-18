import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01XDrake054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-054 X.Drake", () => {
  test("K.O.s an opposing rested Character at the cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01XDrake054], activeDon: op01XDrake054.cost },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025 },
          { card: eb01MountainGod018, rested: true },
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op01XDrake054, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected X.Drake's K.O. target.");
    expect(ko.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(true);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const northView = engine.getView("north");
    expect(northView.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(northView.prompts).toHaveLength(0);
  });
});

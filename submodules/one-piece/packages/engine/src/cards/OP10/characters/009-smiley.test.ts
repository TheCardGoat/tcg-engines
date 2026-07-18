import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10Smiley009, op10Smoker001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-009 Smiley", () => {
  test("with an included Punk Hazard Leader gives an opposing Character -3000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Smoker001,
        hand: [op10Smiley009],
        activeDon: op10Smiley009.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op10Smiley009, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Smiley's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe((eb01MountainGod018.power ?? 0) - 3000);

    engine.endTurn("south");
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(eb01MountainGod018.power);
  });
});

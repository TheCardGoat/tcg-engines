import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op12RoronoaZoro020, op12Tashigi031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-031 Tashigi", () => {
  test("rests an opposing base-cost-6-or-less Character, then gives three rested DON!! to Zoro", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        hand: [op12Tashigi031],
        activeDon: op12Tashigi031.cost,
        restedDon: 3,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12Tashigi031, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "3" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.players.south.restedDon).toBe(5);
    expect(view.players.south.leader.attachedDon).toBe(3);
  });
});

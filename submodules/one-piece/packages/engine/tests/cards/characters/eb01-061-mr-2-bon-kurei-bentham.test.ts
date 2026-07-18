import { describe, expect, test } from "vite-plus/test";
import {
  eb01MontBlancCricket058,
  eb01MountainGod018,
  eb01Mr2BonKureiBentham061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-061 Mr.2.Bon.Kurei (Bentham)", () => {
  test("adds an active DON!! from the DON!! deck on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01Mr2BonKureiBentham061],
      activeDon: 4,
      donDeckCount: 1,
    });

    engine.playCard(eb01Mr2BonKureiBentham061);
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Bentham's active DON!! count choice.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.donDeckCount).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("copies a selected opposing Character's current power as base power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Mr2BonKureiBentham061, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01MountainGod018, eb01MontBlancCricket058] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const benthamId = engine.findCardInZone("south", "character", eb01Mr2BonKureiBentham061);
    const copiedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherId = engine.findCardInZone("north", "character", eb01MontBlancCricket058);

    engine.attachDon(benthamId, 1, "south");
    engine.declareAttack(benthamId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Bentham's opposing Character power-copy choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([copiedId, otherId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [copiedId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === benthamId)?.power,
    ).toBe(8000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === benthamId)?.power,
    ).toBe(1000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

import { eb01MountainGod018, op10Enel025 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02LimPirateFoil079 } from "../../../../../cards/src/cards/PRB02/characters/079-lim-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-079 Lim (Pirate Foil)", () => {
  test("uses Blocker to redirect an attack and protect Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02LimPirateFoil079] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", prb02LimPirateFoil079);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Lim's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at end of turn reactivates only at two rested included-ODYSSEY Characters", () => {
    const qualifying = OnePieceTestEngine.create({
      character: [
        { card: prb02LimPirateFoil079, rested: true },
        { card: op10Enel025, rested: true },
      ],
    });
    const qualifyingLimId = qualifying.findCardInZone("south", "character", prb02LimPirateFoil079);

    qualifying.endTurn("south");

    expect(
      qualifying
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === qualifyingLimId)?.rested,
    ).toBe(false);

    const belowBoundary = OnePieceTestEngine.create({
      character: [{ card: prb02LimPirateFoil079, rested: true }],
    });
    const belowBoundaryLimId = belowBoundary.findCardInZone(
      "south",
      "character",
      prb02LimPirateFoil079,
    );

    belowBoundary.endTurn("south");

    const belowView = belowBoundary.getView("south");
    expect(
      belowView.players.south.characters.find((card) => card?.instanceId === belowBoundaryLimId)
        ?.rested,
    ).toBe(true);
    expect(belowView.prompts).toHaveLength(0);
  });
});

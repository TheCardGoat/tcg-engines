import { eb01MountainGod018, op10Bian053 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02JinbeP063PirateFoil063 } from "../../../../../cards/src/cards/PRB02/characters/063-jinbe-p-063-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-063 Jinbe - P-063 (Pirate Foil)", () => {
  test("rests a selected opposing cost-1 Character while excluding own and higher-cost cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02JinbeP063PirateFoil063],
        character: [op10Bian053],
        activeDon: prb02JinbeP063PirateFoil063.cost,
      },
      { character: [op10Bian053, eb01MountainGod018] },
    );
    const ownCostOneId = engine.findCardInZone("south", "character", op10Bian053);
    const opposingCostOneId = engine.findCardInZone("north", "character", op10Bian053);
    const higherCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb02JinbeP063PirateFoil063, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Jinbe's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opposingCostOneId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCostOneId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(higherCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingCostOneId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingCostOneId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownCostOneId)?.rested,
    ).toBe(false);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === higherCostId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may select no Character and leaves the eligible opponent active", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02JinbeP063PirateFoil063],
        activeDon: prb02JinbeP063PirateFoil063.cost,
      },
      { character: [op10Bian053] },
    );
    const targetId = engine.findCardInZone("north", "character", op10Bian053);

    engine.playCard(prb02JinbeP063PirateFoil063, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});

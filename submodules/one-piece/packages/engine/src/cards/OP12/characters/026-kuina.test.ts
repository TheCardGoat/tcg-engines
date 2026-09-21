import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12RoronoaZoro020 } from "@tcg/op-cards";
import { op12Kuina026 } from "../../../../../cards/src/cards/characters/op12-026-kuina.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-026 Kuina", () => {
  test("rests an eligible opponent, then gives three rested DON!! to Roronoa Zoro", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        character: [op12Kuina026],
        restedDon: 3,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const kuinaId = engine.findCardInZone("south", "character", op12Kuina026);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(kuinaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Kuina's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "3" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(3);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.players.south.characters.find((card) => card?.instanceId === kuinaId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        character: [op12Kuina026],
        restedDon: 3,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const kuinaId = engine.findCardInZone("south", "character", op12Kuina026);
    engine.activateEffect(kuinaId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

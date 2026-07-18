import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04DonquixoteRosinante119,
  op06HodyJones020,
  op07FisherTiger032,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-032 Fisher Tiger", () => {
  test("with a compound Fish-Man Leader rests an opposing cost-6-or-less Character and attacks it immediately", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        hand: [op07FisherTiger032],
        character: [eb01Doma005],
        activeDon: op07FisherTiger032.cost,
      },
      { character: [eb01MountainGod018, op04DonquixoteRosinante119] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op04DonquixoteRosinante119);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op07FisherTiger032, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Fisher Tiger's rest choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const tigerId = engine.findCardInZone("south", "character", op07FisherTiger032);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    engine.declareAttack(tigerId, eligibleId, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === tigerId)
        ?.rested,
    ).toBe(true);
  });

  test("may decline the On Play rest choice", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op06HodyJones020, hand: [op07FisherTiger032], activeDon: 5 },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07FisherTiger032, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

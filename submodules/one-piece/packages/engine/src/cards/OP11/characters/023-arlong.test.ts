import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11Arlong023,
  op14eb04JinbeOp14040040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-023 Arlong", () => {
  test("has cost 3 in hand only while all three permanent conditions are live", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04JinbeOp14040040,
        hand: [op11Arlong023],
        life: 3,
        activeDon: 3,
      },
      {
        character: Array.from({ length: 5 }, () => ({ card: eb01Doma005, rested: true })),
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const arlongId = engine.findCardInZone("south", "hand", op11Arlong023);

    expect(
      engine.getView("south").players.south.hand.find((card) => card.instanceId === arlongId)?.cost,
    ).toBe(3);
    engine.playCard(op11Arlong023, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(arlongId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });

    const boundary = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04JinbeOp14040040,
        hand: [op11Arlong023],
        life: 3,
      },
      {
        character: Array.from({ length: 4 }, () => ({ card: eb01Doma005, rested: true })),
      },
    );
    const boundaryId = boundary.findCardInZone("south", "hand", op11Arlong023);
    expect(
      boundary.getView("south").players.south.hand.find((card) => card.instanceId === boundaryId)
        ?.cost,
    ).toBe(7);
  });

  test("its Life Trigger is controlled by the damaged player and rests only a low-cost opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
      { life: [op11Arlong023] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Arlong's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
  });
});

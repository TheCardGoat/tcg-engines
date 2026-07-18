import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Gyro027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-027 Gyro", () => {
  test("after battle K.O., rests only an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Gyro027, rested: true, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const gyroId = engine.findCardInZone("south", "character", op06Gyro027);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, gyroId, "north");

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected Gyro's On K.O. target.");
    expect(rest).toMatchObject({ min: 0, max: 1 });
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(gyroId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op08HikingBear010,
  op08Lapins012,
  op08TonyTonyChopper001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-012 Lapins", () => {
  test("with DON!! x2 and a compound Drum Kingdom Leader K.O.s within 4000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08TonyTonyChopper001,
        character: [{ card: op08Lapins012, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [op08HikingBear010, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lapinsId = engine.findCardInZone("south", "character", op08Lapins012);
    const eligibleId = engine.findCardInZone("north", "character", op08HikingBear010);
    const highPowerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.attachDon(lapinsId, 2, "south");

    engine.declareAttack(lapinsId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Lapins's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highPowerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(highPowerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. with only one attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08TonyTonyChopper001,
        character: [{ card: op08Lapins012, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [op08HikingBear010], life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lapinsId = engine.findCardInZone("south", "character", op08Lapins012);
    const opposingId = engine.findCardInZone("north", "character", op08HikingBear010);
    engine.attachDon(lapinsId, 1, "south");

    engine.declareAttack(lapinsId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. with two attached DON!! and a non-Drum-Kingdom Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08Lapins012, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [op08HikingBear010], life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lapinsId = engine.findCardInZone("south", "character", op08Lapins012);
    const opposingId = engine.findCardInZone("north", "character", op08HikingBear010);
    engine.attachDon(lapinsId, 2, "south");

    engine.declareAttack(lapinsId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});

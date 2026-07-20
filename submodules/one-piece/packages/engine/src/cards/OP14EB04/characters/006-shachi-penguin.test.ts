import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op14eb04ShachiPenguin006 } from "../../../../../cards/src/cards/OP14EB04/characters/006-shachi-penguin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-006 Shachi & Penguin", () => {
  test("at 5000 power gives one selected opposing Character minus 2000 power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04ShachiPenguin006, playedOnTurn: 0 }, eb01MountainGod018],
        activeDon: 3,
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shachiPenguinId = engine.findCardInZone("south", "character", op14eb04ShachiPenguin006);
    const ownCharacterId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(shachiPenguinId, 3, "south");
    engine.declareAttack(shachiPenguinId, engine.leader("north"), "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Shachi & Penguin's power target.");
    }
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opposingCharacterId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCharacterId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [opposingCharacterId] },
      "south",
    );

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingCharacterId)?.power,
    ).toBe((eb01Doma005.power ?? 0) - 2000);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingCharacterId)?.power,
    ).toBe(eb01Doma005.power);
  });

  test("at 5000 power may choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04ShachiPenguin006, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shachiPenguinId = engine.findCardInZone("south", "character", op14eb04ShachiPenguin006);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(shachiPenguinId, 3, "south");
    engine.declareAttack(shachiPenguinId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("below 5000 power does not offer or apply the power reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04ShachiPenguin006, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shachiPenguinId = engine.findCardInZone("south", "character", op14eb04ShachiPenguin006);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(shachiPenguinId, 2, "south");
    engine.declareAttack(shachiPenguinId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});

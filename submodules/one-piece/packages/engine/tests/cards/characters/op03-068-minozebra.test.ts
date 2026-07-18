import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01RoronoaZoro001,
  op02Magellan071,
  op03Minozebra068,
  op03UsoppSRubberBandOfDoom054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-068 Minozebra", () => {
  test("Banish trashes the damaged Life card without offering its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Minozebra068, playedOnTurn: 0 }] },
      { life: [op03UsoppSRubberBandOfDoom054] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const minozebraId = engine.findCardInZone("south", "character", op03Minozebra068);
    const lifeId = engine.findCardInZone("north", "life", op03UsoppSRubberBandOfDoom054);

    engine.declareAttack(minozebraId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(() => engine.pendingDecision("lifeTrigger", "north")).toThrow();
  });

  test("with an included Impel Down Leader, its battle K.O. adds one rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02Magellan071,
        character: [{ card: op03Minozebra068, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const minozebraId = engine.findCardInZone("south", "character", op03Minozebra068);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    const restedDonBefore = engine.getView("south").players.south.restedDon;

    engine.declareAttack(attackerId, minozebraId, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minozebraId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(view.players.south.restedDon).toBe(restedDonBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer DON!! after K.O. without an Impel Down Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [{ card: op03Minozebra068, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const minozebraId = engine.findCardInZone("south", "character", op03Minozebra068);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, minozebraId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minozebraId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});

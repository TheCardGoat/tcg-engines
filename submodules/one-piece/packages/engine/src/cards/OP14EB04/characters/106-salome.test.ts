import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Salome106 } from "../../../../../cards/src/cards/OP14EB04/characters/106-salome.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-106 Salome", () => {
  test("Life Trigger plays the exact physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Salome106, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Salome106);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(triggerId);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("uses Blocker to redirect an attack and protect Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Salome106] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op14eb04Salome106);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});

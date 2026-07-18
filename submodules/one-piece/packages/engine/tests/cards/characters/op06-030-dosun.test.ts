import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06Dosun030, op06HodyJones020, op06Ratchet014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-030 Dosun", () => {
  test("with a New Fish-Man Pirates Leader gains power and battle protection, takes Life, then expires next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Dosun030, playedOnTurn: 0 }],
        life: [op06Ratchet014],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const dosunId = engine.findCardInZone("south", "character", op06Dosun030);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeId = engine.findCardInZone("south", "life", op06Ratchet014);

    engine.declareAttack(dosunId, engine.leader("north"), "south");
    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === dosunId)?.power).toBe(
      6000,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);

    engine.endTurn("south");
    engine.declareAttack(attackerId, dosunId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(dosunId);
    expect(view.players.south.characters.find((card) => card?.instanceId === dosunId)?.power).toBe(
      6000,
    );

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === dosunId)?.power).toBe(
      4000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});

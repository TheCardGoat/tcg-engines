import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09Crocodile025, op09Lim022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-025 Crocodile", () => {
  test("with an ODYSSEY Leader survives battle against a Leader but not a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Lim022,
        character: [{ card: op09Crocodile025, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const crocodileId = engine.findCardInZone("south", "character", op09Crocodile025);
    const characterAttackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(engine.leader("north"), crocodileId, "north");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === crocodileId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(crocodileId);

    engine.declareAttack(characterAttackerId, crocodileId, "north");

    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(crocodileId);
    expect(view.prompts).toHaveLength(0);
  });

  test("is K.O.'d by a Leader in battle without an ODYSSEY Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Crocodile025, rested: true }] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const crocodileId = engine.findCardInZone("south", "character", op09Crocodile025);

    engine.declareAttack(engine.leader("north"), crocodileId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(crocodileId);
    expect(view.prompts).toHaveLength(0);
  });
});

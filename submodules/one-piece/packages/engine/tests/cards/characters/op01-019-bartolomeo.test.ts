import { describe, expect, test } from "vite-plus/test";
import { op01Bartolomeo019, op01NicoRobin017 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-019 Bartolomeo", () => {
  test("blocks and gains +3000 only during the opponent's turn with 2 DON!! attached", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Bartolomeo019, attachedDon: 2, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op01NicoRobin017, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op01Bartolomeo019);
    const attackerId = engine.findCardInZone("north", "character", op01NicoRobin017);
    const initialLife = engine.getView("south").players.south.lifeCount;

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === bartolomeoId)?.power,
    ).toBe(5000);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [bartolomeoId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(initialLife);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bartolomeoId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === bartolomeoId)).toBe(
      true,
    );

    engine.endTurn("north");

    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bartolomeoId)?.power,
    ).toBe(2000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bartolomeoId)?.attachedDon,
    ).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});

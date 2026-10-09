import { describe, expect, test } from "vite-plus/test";
import { eb01OffWhite019 } from "@tcg/op-cards";
import { op12VinsmokeReiju063 } from "../../../../../cards/src/cards/characters/op12-063-vinsmoke-reiju.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-063 Vinsmoke Reiju", () => {
  test("gains +2000 power and +5 cost with four Events in trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12VinsmokeReiju063],
      trash: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
    });
    const reijuId = engine.findCardInZone("south", "character", op12VinsmokeReiju063);

    const reiju = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === reijuId);
    expect(reiju).toMatchObject({ power: 7000, cost: 9 });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.filter(Boolean).length).toBeGreaterThan(
      0,
    );
  });
  test("Blocker works below the Event threshold and protects Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [op12VinsmokeReiju063],
        trash: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
      },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "character", op12VinsmokeReiju063);
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id),
    ).toMatchObject({ power: 5000, cost: 4 });
    e.asSouth().chooseBlocker(id);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
});

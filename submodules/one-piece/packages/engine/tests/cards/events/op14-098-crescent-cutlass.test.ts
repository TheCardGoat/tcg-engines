import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op14eb04CrescentCutlass098,
  op14eb04CrocodileOp14120120,
  op14eb04MissDoublefingerZala086,
  op14eb04Mr4Babe093,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-098 Crescent Cutlass", () => {
  test("Main sees either field's cost-8 Character and gives all own Baroque Works Characters +3 cost through the opponent End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04CrescentCutlass098],
        character: [op14eb04MissDoublefingerZala086, op14eb04Mr4Babe093],
        activeDon: 1,
      },
      { character: [op14eb04CrocodileOp14120120] },
    );
    const firstId = engine.findCardInZone("south", "character", op14eb04MissDoublefingerZala086);
    const secondId = engine.findCardInZone("south", "character", op14eb04Mr4Babe093);
    engine.playCard(op14eb04CrescentCutlass098);
    let characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === firstId)?.cost).toBe(8);
    expect(characters.find((card) => card?.instanceId === secondId)?.cost).toBe(7);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === firstId)
        ?.cost,
    ).toBe(8);
    engine.endTurn("north");
    characters = engine.getView("south").players.south.characters;
    expect(characters.find((card) => card?.instanceId === firstId)?.cost).toBe(5);
    expect(characters.find((card) => card?.instanceId === secondId)?.cost).toBe(4);
  });

  test("Counter gives the defending Leader +3000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04CrescentCutlass098], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04CrescentCutlass098);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
  });
});

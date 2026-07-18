import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11Jinbe021,
  op14eb04Aladine043,
  op14eb04DonTWorryIMHere057,
  op14eb04Kuroobi045,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-057 Don't Worry!! I'm Here!!", () => {
  test("Main powers every Fish-Man or Merfolk Leader and Character, but no unrelated card", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Jinbe021,
      hand: [op14eb04DonTWorryIMHere057],
      character: [op14eb04Kuroobi045, op14eb04Aladine043, eb01Doma005],
      activeDon: 2,
    });
    const fishId = engine.findCardInZone("south", "character", op14eb04Kuroobi045);
    const merfolkId = engine.findCardInZone("south", "character", op14eb04Aladine043);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);
    const before = engine.getView("south").players.south;
    engine.playCard(op14eb04DonTWorryIMHere057);
    const after = engine.getView("south").players.south;
    expect(after.leader.power).toBe((before.leader.power ?? 0) + 1000);
    expect(after.characters.find((card) => card?.instanceId === fishId)?.power).toBe(4000);
    expect(after.characters.find((card) => card?.instanceId === merfolkId)?.power).toBe(6000);
    expect(after.characters.find((card) => card?.instanceId === unrelatedId)?.power).toBe(3000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws two without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op14eb04DonTWorryIMHere057], deck: 7 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand).toHaveLength(2);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

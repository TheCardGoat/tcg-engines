import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op14eb04Salome106,
  op14eb04YouLlFrightenMe118,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-118 You'll Frighten Me...", () => {
  test("Counter at two Life prevents a chosen active opposing Character from attacking this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { hand: [op14eb04YouLlFrightenMe118], life: 2, activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restrictedId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op14eb04YouLlFrightenMe118);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "north");
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: restrictedId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBe("The selected attacker cannot attack.");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger plays a power-6000-or-less Character with Trigger from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op14eb04YouLlFrightenMe118], hand: [op14eb04Salome106] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const playId = engine.findCardInZone("north", "hand", op14eb04Salome106);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "north");
    expect(
      engine.getView("north").players.north.characters.some((card) => card?.instanceId === playId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

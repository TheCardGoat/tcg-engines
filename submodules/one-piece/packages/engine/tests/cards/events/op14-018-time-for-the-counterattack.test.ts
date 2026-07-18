import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op14eb04ScaledNeptunian011,
  op14eb04ShachiPenguin006,
  op14eb04TimeForTheCounterattack018,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-018 Time for the Counterattack", () => {
  test("Counter sees an 8000-power Character on either field and grants +4000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04ScaledNeptunian011, playedOnTurn: 0 }] },
      { hand: [op14eb04TimeForTheCounterattack018], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op14eb04ScaledNeptunian011);
    const eventId = engine.findCardInZone("north", "hand", op14eb04TimeForTheCounterattack018);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger plays a red 2000-power Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op14eb04TimeForTheCounterattack018], hand: [op14eb04ShachiPenguin006] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const playId = engine.findCardInZone("north", "hand", op14eb04ShachiPenguin006);
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

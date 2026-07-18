import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op14eb04BrickBat117,
  op14eb04GeckoMoriaOp14080080,
  op14eb04Oinkchuck082,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-117 Brick Bat", () => {
  test("Counter grants +3000 only to an included Thriller Bark Pirates recipient", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op14eb04GeckoMoriaOp14080080, hand: [op14eb04BrickBat117], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04BrickBat117);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
  });

  test("Life Trigger plays an eligible Thriller Bark Pirates Character from trash rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op14eb04BrickBat117], trash: [op14eb04Oinkchuck082] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const playId = engine.findCardInZone("north", "trash", op14eb04Oinkchuck082);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "north");
    const played = engine
      .getView("north")
      .players.north.characters.find((card) => card?.instanceId === playId);
    expect(played?.rested).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});

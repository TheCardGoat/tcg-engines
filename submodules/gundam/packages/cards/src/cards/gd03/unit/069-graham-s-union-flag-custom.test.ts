import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GrahamAker098 } from "../pilot/098-graham-aker.ts";
import { gd03Messala003 } from "./003-messala.ts";
import { gd03GrahamSUnionFlagCustom069 } from "./069-graham-s-union-flag-custom.ts";

describe("Graham's Union Flag Custom (GD03-069)", () => {
  it("cannot be blocked and readies at end of turn while linked", () => {
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GrahamAker098],
        play: [gd03GrahamSUnionFlagCustom069],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [gd03Messala003], shieldArea: [shield], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03GrahamAker098, unitId));
    expectSuccess(p1.enterBattle(unitId, "direct"));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.isExhausted(unitId)).toBe(true);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.isExhausted(unitId)).toBe(false);
  });

  it("stays rested at end of turn while paired but not linked", () => {
    const wrongPilot = createMockPilot({ name: "Wrong Pilot", cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        play: [gd03GrahamSUnionFlagCustom069],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(wrongPilot, unitId));
    expectSuccess(p1.enterBattle(unitId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.isExhausted(unitId)).toBe(true);
  });
});

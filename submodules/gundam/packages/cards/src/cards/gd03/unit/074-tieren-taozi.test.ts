import { describe, it } from "vite-plus/test";
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
import { gd03TierenTaozi074 } from "./074-tieren-taozi.ts";

describe("Tieren Taozi (GD03-074)", () => {
  function setup({
    hasOtherSuperpowerBloc = true,
    rested = true,
  }: { hasOtherSuperpowerBloc?: boolean; rested?: boolean } = {}) {
    const pilot = createMockPilot({
      name: "Super Soldier Pilot",
      traits: ["super soldier"],
      cost: 1,
    });
    const otherUnit = createMockUnit({
      name: "Other Unit",
      traits: hasOtherSuperpowerBloc ? ["superpower bloc"] : ["zeon"],
      hp: 5,
    });
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const transitionDefender = createMockUnit({ name: "Transition Defender", ap: 0, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03TierenTaozi074, { card: otherUnit, exhausted: true }],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [attacker, { card: transitionDefender, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [taoziId, otherUnitId] = p1.getCardsInZone("battleArea");
    const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(pilot, taoziId!));
    if (rested) {
      expectSuccess(p1.enterBattle(taoziId!, transitionDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
    }
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    return { p2, taoziId: taoziId!, otherUnitId: otherUnitId!, attackerId: attackerId! };
  }

  it("prevents an enemy Unit from attacking a different target while Taozi is paired, rested, and another Superpower Bloc Unit is in play", () => {
    const { p2, otherUnitId, attackerId } = setup();

    expectFailure(p2.enterBattle(attackerId, otherUnitId), "INVALID_TARGET");
  });

  it("allows an enemy Unit to attack the rested Taozi", () => {
    const { p2, taoziId, attackerId } = setup();

    expectSuccess(p2.enterBattle(attackerId, taoziId));
  });

  it("does not restrict attacks without another Superpower Bloc Unit", () => {
    const { p2, otherUnitId, attackerId } = setup({ hasOtherSuperpowerBloc: false });

    expectSuccess(p2.enterBattle(attackerId, otherUnitId));
  });

  it("does not restrict attacks while Taozi is active", () => {
    const { p2, otherUnitId, attackerId } = setup({ rested: false });

    expectSuccess(p2.enterBattle(attackerId, otherUnitId));
  });
});

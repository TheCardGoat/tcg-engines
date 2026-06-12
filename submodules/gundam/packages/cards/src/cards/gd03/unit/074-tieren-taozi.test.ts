import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
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
    const pilot = createMockPilot({ name: "Super Soldier Pilot", traits: ["super soldier"] });
    const otherUnit = createMockUnit({
      name: "Other Unit",
      traits: hasOtherSuperpowerBloc ? ["superpower bloc"] : ["zeon"],
      hp: 5,
    });
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [
          { card: gd03TierenTaozi074, exhausted: rested },
          { card: otherUnit, exhausted: true },
        ],
        resourceArea: activeResources(3),
      },
      { play: [attacker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [taoziId, otherUnitId] = p1.getCardsInZone("battleArea");
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, taoziId!));
    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);
    engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G, framework }) => {
      G.exhausted[taoziId!] = rested;
      framework.cards.patchMeta(taoziId!, { exhausted: rested });
    });

    return { p2, taoziId: taoziId!, otherUnitId: otherUnitId!, attackerId };
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

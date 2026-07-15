import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ShenlongGundam041 } from "./041-shenlong-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Shenlong Gundam (GD01-041)", () => {
  it("can attack on its deploy turn with Chang Wufei and Breach removes one Shield", () => {
    const chang = createMockPilot({ name: "Chang Wufei", level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ShenlongGundam041, chang],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], shieldArea: [createMockUnit()], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01ShenlongGundam041));
    expectSuccess(p1.assignPilot(chang, gd01ShenlongGundam041));
    expectSuccess(p1.enterBattle(gd01ShenlongGundam041, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 1);
  });
});

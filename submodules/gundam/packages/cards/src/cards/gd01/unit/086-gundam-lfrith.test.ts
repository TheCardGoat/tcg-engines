import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamLfrith086 } from "./086-gundam-lfrith.ts";
import { restUnitsByAttackingDirectly } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Lfrith (GD01-086)", () => {
  it("deploys with visible stats and uses Blocker on the opponent's turn", () => {
    const ally = createMockUnit({ hp: 5 });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamLfrith086],
        play: [ally],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        play: [attacker],
        deck: 5,
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [allyId]);

    expectSuccess(p1.deployUnit(gd01GundamLfrith086));
    const lfrithId = p1.getCardsInZone("battleArea").at(-1)!;
    expect(p1.getVisibleCard(lfrithId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
    expect(p1.getVisibleCard(lfrithId)?.keywords).toContain("Blocker");
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, allyId));
    expectSuccess(p1.declareBlock(lfrithId));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(lfrithId);
    expect(p1.isExhausted(lfrithId)).toBe(true);
  });
});

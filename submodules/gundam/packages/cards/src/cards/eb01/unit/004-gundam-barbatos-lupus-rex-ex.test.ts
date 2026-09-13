import { describe, expect, it } from "vite-plus/test";
import { expectRepairAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01GundamBarbatosLupusRexEx004 } from "./004-gundam-barbatos-lupus-rex-ex.ts";

describe("Gundam Barbatos Lupus Rex (EX) (EB01-004)", () => {
  it("<Repair 2> recovers exactly 2 HP at its controller's End Phase", () => {
    expectRepairAbility(eb01GundamBarbatosLupusRexEx004, 2);
  });

  it("deals 1 damage to a chosen rested enemy when it recovers HP during its controller's turn", () => {
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: eb01GundamBarbatosLupusRexEx004, damage: 2 }] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
  });
});

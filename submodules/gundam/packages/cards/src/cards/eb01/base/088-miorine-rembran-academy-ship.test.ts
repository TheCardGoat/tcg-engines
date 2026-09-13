import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { eb01MiorineRembranAcademyShip088 } from "./088-miorine-rembran-academy-ship.ts";

describe("Miorine Rembran & Academy Ship (EB01-088)", () => {
  /** @behavioral-proof complete: Burst/deploy helpers and the public AP projection prove every printed clause. */
  it("executes its Burst deployment and Deploy Shield ability", () => {
    expectBaseBurstAndDeployAbilities(eb01MiorineRembranAcademyShip088);
  });

  it("gives only friendly Lv.3 G Generation Units AP+1 during the opponent's turn", () => {
    const eligible = createMockUnit({ ap: 2, level: 3, traits: ["g generation"] });
    const wrongLevel = createMockUnit({ ap: 2, level: 2, traits: ["g generation"] });
    const enemy = createMockUnit({ ap: 2, level: 3, traits: ["g generation"] });
    const engine = GundamTestEngine.create(
      { play: [eligible, wrongLevel], baseSection: [eb01MiorineRembranAcademyShip088] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId, wrongLevelId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(eligibleId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(wrongLevelId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(eligibleId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(wrongLevelId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
  });
});

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
import { gd01WingGundam040 } from "./040-wing-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Wing Gundam (GD01-040)", () => {
  it("deploys from hand with its visible AP and HP", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01WingGundam040],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01WingGundam040));

    expect(p1.getCardZone(gd01WingGundam040)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(gd01WingGundam040)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
  });

  it("can attack on its deploy turn after pairing Heero Yuy", () => {
    const heero = createMockPilot({ name: "Heero Yuy", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01WingGundam040, heero],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01WingGundam040));
    expectSuccess(p1.assignPilot(heero, gd01WingGundam040));
    expectSuccess(p1.enterBattle(gd01WingGundam040, enemyId));
  });
});

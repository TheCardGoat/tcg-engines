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
import { gd01Loto011 } from "./011-loto.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Loto (GD01-011)", () => {
  it("deploys from hand with its visible AP and HP", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Loto011],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Loto011));

    expect(p1.getCardZone(gd01Loto011)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(gd01Loto011)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
  });

  it("can attack on its deploy turn after pairing an Earth Federation Pilot", () => {
    const pilot = createMockPilot({ traits: ["earth federation"], level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Loto011, pilot],
        resourceArea: activeResources(3),
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
    expectSuccess(p1.deployUnit(gd01Loto011));
    expectSuccess(p1.assignPilot(pilot, gd01Loto011));
    expectSuccess(p1.enterBattle(gd01Loto011, enemyId));
  });
});

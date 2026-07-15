import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StarkJegan017 } from "./017-stark-jegan.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Stark Jegan (GD01-017)", () => {
  it("recovers 1 HP at the end of its controller's turn", () => {
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd01StarkJegan017], baseSection: [createMockBase({ hp: 10 })], deck: 5 },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, unitId, defenderId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(1);
  });

  it("can attack on its deploy turn after pairing an Earth Federation Pilot", () => {
    const pilot = createMockPilot({ traits: ["earth federation"], level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StarkJegan017, pilot],
        resourceArea: activeResources(4),
        baseSection: [createMockBase({ hp: 10 })],
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
    expectSuccess(p1.deployUnit(gd01StarkJegan017));
    expectSuccess(p1.assignPilot(pilot, gd01StarkJegan017));
    expectSuccess(p1.enterBattle(gd01StarkJegan017, enemyId));
  });
});

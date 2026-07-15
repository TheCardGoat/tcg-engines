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
import { gd01DeltaPlus006 } from "./006-delta-plus.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Delta Plus (GD01-006)", () => {
  it("recovers 1 HP at the end of its controller's turn", () => {
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd01DeltaPlus006], shieldArea: [createMockUnit()], deck: 5 },
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

  it("shows HP 4 after pairing an Earth Federation Pilot that satisfies its Link Condition", () => {
    const pilot = createMockPilot({
      traits: ["earth federation"],
      level: 1,
      cost: 1,
      hpBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [gd01DeltaPlus006],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveHp: 4 });
  });

  it("keeps HP 3 when paired with a Pilot outside the Earth Federation trait", () => {
    const pilot = createMockPilot({ traits: ["oz"], level: 1, cost: 1, hpBonus: 0 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [gd01DeltaPlus006],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveHp: 3 });
  });
});

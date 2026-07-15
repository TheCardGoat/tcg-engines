import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaGuncannon004 } from "./004-guncannon.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Guncannon (GD01-004)", () => {
  it("<Repair 1> heals 1 HP at the end of the controller's turn", () => {
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [betaGuncannon004],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 5,
      },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const guncannonId = p1.getCardsInZone("battleArea")[0]!;
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, guncannonId, defenderId);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getDamage(guncannonId)).toBe(1);
  });

  it("links with a White Base Team Pilot, lets the player rest an eligible enemy, and attacks this turn", () => {
    const smallEnemy = createMockUnit({ ap: 1, hp: 2 });
    const bigEnemy = createMockUnit({ ap: 4, hp: 8 });
    const pilotCard = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaGuncannon004, pilotCard],
        resourceArea: activeResources(3),
      },
      { play: [smallEnemy, bigEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [smallId, bigId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(betaGuncannon004));
    const guncannonId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilotCard, guncannonId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: guncannonId,
      legalTargetIds: [smallId],
    });
    expectSuccess(p1.resolveEffect({ targets: [smallId!] }));

    expect(p2.isExhausted(smallId!)).toBe(true);
    expect(p2.isExhausted(bigId!)).toBe(false);
    expectSuccess(p1.enterBattle(guncannonId, smallId!));
  });
});

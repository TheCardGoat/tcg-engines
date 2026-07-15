import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaPerfectStrikeGundam068 } from "./068-perfect-strike-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Perfect Strike Gundam (GD01-068)", () => {
  it("<Blocker> can intercept an attack aimed at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [attacker],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 5,
      },
      { play: [defender, betaPerfectStrikeGundam068], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(blockerId)).toBe(1);
    expect(p2.getDamage(defenderId)).toBe(0);
  });

  it("【Deploy】 offers only a 1-HP enemy Unit and returns the player's choice", () => {
    const fragile = createMockUnit({ ap: 2, hp: 1 });
    const sturdy = createMockUnit({ ap: 2, hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [betaPerfectStrikeGundam068], resourceArea: activeResources(5) },
      { play: [fragile, sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [fragileId, sturdyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(betaPerfectStrikeGundam068));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [fragileId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [fragileId!] }));

    expect(p2.getCardZone(fragileId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(sturdyId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not open a return prompt when every enemy Unit has more than 1 HP", () => {
    const sturdy = createMockUnit({ ap: 2, hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [betaPerfectStrikeGundam068], resourceArea: activeResources(5) },
      { play: [sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sturdyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(betaPerfectStrikeGundam068));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(sturdyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});

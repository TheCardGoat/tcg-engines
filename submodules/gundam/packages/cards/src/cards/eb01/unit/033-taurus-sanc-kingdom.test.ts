import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01TaurusSancKingdom033 } from "./033-taurus-sanc-kingdom.ts";

describe("Taurus (Sanc Kingdom) (EB01-033)", () => {
  it("【Activate･Action】 pays 1 to give AP+1 only to the other Unit being attacked", () => {
    const defender = createMockUnit({ ap: 2, hp: 5 });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [eb01TaurusSancKingdom033, { card: defender, exhausted: true }],
        resourceArea: activeResources(1),
      },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, defenderId] = p1.getCardsInZone("battleArea");
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, defenderId!));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.activateAbility(sourceId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [defenderId],
    });
    expectSuccess(p1.resolveEffect({ targets: [defenderId!] }));

    expect(p1.getVisibleCard(defenderId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(attackerId)?.effectiveAp).toBe(3);
    expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
  });

  it("cannot activate its battle effect twice in one turn", () => {
    const firstDefender = createMockUnit({ ap: 2, hp: 5 });
    const secondDefender = createMockUnit({ ap: 2, hp: 5 });
    const firstAttacker = createMockUnit({ ap: 3, hp: 5 });
    const secondAttacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [
          eb01TaurusSancKingdom033,
          { card: firstDefender, exhausted: true },
          { card: secondDefender, exhausted: true },
        ],
        resourceArea: activeResources(2),
      },
      { play: [firstAttacker, secondAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, firstDefenderId, secondDefenderId] = p1.getCardsInZone("battleArea");
    const [firstAttackerId, secondAttackerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(firstAttackerId!, firstDefenderId!));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.activateAbility(sourceId!, 0));
    expectSuccess(p1.resolveEffect({ targets: [firstDefenderId!] }));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p2.enterBattle(secondAttackerId!, secondDefenderId!));
    expectSuccess(p1.passBlock());
    expectFailure(p1.activateAbility(sourceId!, 0), "ABILITY_LIMIT_REACHED");
  });
});

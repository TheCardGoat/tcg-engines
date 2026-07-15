import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04LoranCehack097 } from "./097-loran-cehack.ts";

describe("Loran Cehack (GD04-097)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04LoranCehack097] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("returns only an enemy Unit with 3 or less HP to hand when linked", () => {
    const host = createMockUnit({ linkCondition: "[Loran Cehack]" });
    const lowHpEnemy = createMockUnit({ hp: 3 });
    const highHpEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04LoranCehack097],
        play: [host],
        resourceArea: activeResources(5),
      },
      {
        play: [lowHpEnemy, highHpEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId] = p1.getCardsInZone("battleArea");
    const [lowHpEnemyId, highHpEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd04LoranCehack097, hostId!));
    expectSuccess(p1.resolveEffect({ targets: [lowHpEnemyId!] }));

    expect(p2.getHand()).toContain(lowHpEnemyId);
    expect(p2.getCardsInZone("battleArea")).toContain(highHpEnemyId);
  });
});

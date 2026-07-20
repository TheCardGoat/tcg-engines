import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04EnnilEl096 } from "./096-ennil-el.ts";

describe("Ennil El (GD04-096)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04EnnilEl096] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("【During Link】destroys an enemy Lv.5-or-lower Unit after this Unit deals battle damage to it", () => {
    const host = createMockUnit({
      name: "Ennil Link Host",
      ap: 3,
      hp: 6,
      linkCondition: "[Ennil El]",
    });
    const enemy = createMockUnit({ level: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [gd04EnnilEl096], resourceArea: activeResources(4) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04EnnilEl096, hostId));
    expectSuccess(p1.enterBattle(hostId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("does not destroy an enemy Lv.6 Unit with the battle-damage trigger", () => {
    const host = createMockUnit({
      name: "Ennil Link Host",
      ap: 3,
      hp: 6,
      linkCondition: "[Ennil El]",
    });
    const enemy = createMockUnit({ level: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [gd04EnnilEl096], resourceArea: activeResources(4) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04EnnilEl096, hostId));
    expectSuccess(p1.enterBattle(hostId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });
});

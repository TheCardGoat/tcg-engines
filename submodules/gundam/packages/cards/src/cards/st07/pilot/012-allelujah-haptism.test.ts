import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07AllelujahHaptism012 } from "./012-allelujah-haptism.ts";

describe("Allelujah Haptism (ST07-012)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st07AllelujahHaptism012] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getHand()).toContain(shieldId);
  });

  it("during your turn with a CB Link Unit in play, prevents battle damage from enemy Units with 3 or less AP", () => {
    const linkUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Allelujah Haptism]",
      ap: 3,
      hp: 5,
    });
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [st07AllelujahHaptism012], play: [linkUnit], resourceArea: activeResources(3) },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const linkUnitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07AllelujahHaptism012, linkUnitId));
    expectSuccess(p1.enterBattle(linkUnitId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(linkUnitId)).toBe(0);
  });

  it("does not prevent battle damage when the paired Unit is not linked", () => {
    const unlinkedUnit = createMockUnit({ traits: ["cb"], ap: 3, hp: 5 });
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [st07AllelujahHaptism012], play: [unlinkedUnit], resourceArea: activeResources(3) },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st07AllelujahHaptism012, unitId));
    expectSuccess(p1.enterBattle(unitId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(unitId)).toBe(3);
  });
});

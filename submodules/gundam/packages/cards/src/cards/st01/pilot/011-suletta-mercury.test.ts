import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st01SulettaMercury011 } from "./011-suletta-mercury.ts";

describe("Suletta Mercury (ST01-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st01SulettaMercury011] },
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
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getHand()).toContain(shieldId);
    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Attack】【Once per Turn】 — set a resource active", () => {
    const restedRes = createMockResource();
    const linkUnit = createMockUnit({
      ap: 3,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Suletta Mercury]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [linkUnit, st01SulettaMercury011],
        resourceArea: [...activeResources(4), { card: restedRes, exhausted: true }],
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(linkUnit));
    const linkUnitId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getHand()[0]!;
    expectSuccess(p1.assignPilot(pilotId, linkUnitId));

    const restedId = p1.getCardsInZone("resourceArea").find((id) => p1.isExhausted(id));
    if (!restedId) throw new Error("setup: no rested resource");

    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(linkUnitId, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: pilotId,
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
    expect(choice.legalTargetIds).toContain(restedId);
    expectSuccess(p1.resolveEffect({ targets: [restedId] }));

    expect(p1.isExhausted(restedId)).toBe(false);
  });
});

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Freeden127 } from "./127-freeden.ts";

describe("Freeden II (GD04-127)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Freeden127],
      resourceArea: activeResources(4),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.deployBase(gd04Freeden127));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd04Freeden127] });
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
      controllerId: PLAYER_TWO,
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd04Freeden127] });
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
      controllerId: PLAYER_TWO,
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("prompts for and destroys one eligible enemy Unit when 7 Vulture cards are in trash", () => {
    const vultureTrash = Array.from({ length: 7 }, (_, i) =>
      createMockUnit({ cardNumber: `TEST-VULTURE-${i}`, traits: ["vulture"] }),
    );
    const weakEnemy = createMockUnit({ ap: 2, hp: 4 });
    const strongEnemy = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Freeden127],
        trash: vultureTrash,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Shield" })],
        deck: 4,
      },
      { play: [weakEnemy, strongEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const [weakEnemyId, strongEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd04Freeden127));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [weakEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [weakEnemyId!] }));

    expect(p1.getHand()).toContain(shieldId);
    expect(p2.getCardZone(weakEnemyId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(strongEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not ask for a target or destroy a Unit with only 6 Vulture cards in trash", () => {
    const vultureTrash = Array.from({ length: 6 }, (_, i) =>
      createMockUnit({ cardNumber: `TEST-VULTURE-BELOW-${i}`, traits: ["vulture"] }),
    );
    const weakEnemy = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Freeden127],
        trash: vultureTrash,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Shield" })],
        deck: 4,
      },
      { play: [weakEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd04Freeden127));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});

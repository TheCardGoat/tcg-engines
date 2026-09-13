import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05StrikeFreedomGundam002 } from "./002-strike-freedom-gundam.ts";

describe("Strike Freedom Gundam (GD05-002)", () => {
  it("【Deploy】 marks a chosen friendly Unit to draw when it destroys an enemy in battle", () => {
    const beneficiary = createMockUnit({
      ap: 5,
      hp: 5,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StrikeFreedomGundam002],
        play: [beneficiary],
        deck: [createMockUnit(), createMockUnit()],
        resourceArea: activeResources(8),
      },
      {
        play: [{ card: defender, exhausted: true }],
        shieldArea: [createMockUnit({ name: "Breach Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const beneficiaryId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd05StrikeFreedomGundam002));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([beneficiaryId]),
      minTargets: 1,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [beneficiaryId] }));
    expectSuccess(p1.enterBattle(beneficiaryId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("【Deploy】 draws when the chosen Unit destroys an enemy Shield with battle damage", () => {
    const beneficiary = createMockUnit({ ap: 5, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StrikeFreedomGundam002],
        play: [beneficiary],
        deck: [createMockUnit(), createMockUnit()],
        resourceArea: activeResources(8),
      },
      { shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const beneficiaryId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd05StrikeFreedomGundam002));
    expectSuccess(p1.resolveEffect({ targets: [beneficiaryId] }));
    expectSuccess(p1.enterBattle(beneficiaryId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({
      handCount: 1,
      deckCount: 1,
    });
  });

  it("【Deploy】 draws when the chosen Unit destroys an enemy Base with battle damage", () => {
    const beneficiary = createMockUnit({ ap: 5, hp: 5 });
    const base = createMockBase({ name: "Enemy Base", hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StrikeFreedomGundam002],
        play: [beneficiary],
        deck: [createMockUnit(), createMockUnit()],
        resourceArea: activeResources(8),
      },
      { baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const beneficiaryId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.deployUnit(gd05StrikeFreedomGundam002));
    expectSuccess(p1.resolveEffect({ targets: [beneficiaryId] }));
    expectSuccess(p1.enterBattle(beneficiaryId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(baseId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({
      handCount: 1,
      deckCount: 1,
    });
  });

  it("【Deploy】 draws only once when Suppression destroys two Shields simultaneously", () => {
    const beneficiary = createMockUnit({
      ap: 5,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StrikeFreedomGundam002],
        play: [beneficiary],
        deck: [createMockUnit(), createMockUnit()],
        resourceArea: activeResources(8),
      },
      {
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const beneficiaryId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd05StrikeFreedomGundam002));
    expectSuccess(p1.resolveEffect({ targets: [beneficiaryId] }));
    expectSuccess(p1.enterBattle(beneficiaryId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({
      handCount: 1,
      deckCount: 1,
    });
  });

  it("【Deploy】 does not draw when the chosen Unit destroys a Shield with effect damage", () => {
    const beneficiary = createMockUnit({
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          directives: [{ action: { action: "dealDamageToFirstOpponentShield", amount: 1 } }],
          sourceText: "Deal 1 damage to the first enemy Shield.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StrikeFreedomGundam002],
        play: [beneficiary],
        deck: [createMockUnit(), createMockUnit()],
        resourceArea: activeResources(8),
      },
      { shieldArea: [createMockUnit({ name: "Effect-Damage Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const beneficiaryId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd05StrikeFreedomGundam002));
    expectSuccess(p1.resolveEffect({ targets: [beneficiaryId] }));
    expectSuccess(p1.activateAbility(beneficiaryId, 0));

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({
      handCount: 0,
      deckCount: 2,
    });
  });

  it("【During Pair】【Attack】discards 2, then returns only a lowest-Lv. enemy Unit to its owner's deck", () => {
    const pilot = createMockPilot({ name: "Kira Yamato", cost: 1 });
    const discardOne = createMockUnit({ name: "Discard One" });
    const discardTwo = createMockUnit({ name: "Discard Two" });
    const lowestEnemy = createMockUnit({ name: "Lowest Enemy", level: 2 });
    const higherEnemy = createMockUnit({ name: "Higher Enemy", level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, discardOne, discardTwo],
        play: [gd05StrikeFreedomGundam002],
        resourceArea: activeResources(1),
      },
      { play: [lowestEnemy, higherEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const strikeFreedomId = p1.getCardsInZone("battleArea")[0]!;
    const [, discardOneId, discardTwoId] = p1.getHand();
    const [lowestEnemyId, higherEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, strikeFreedomId));
    expectSuccess(p1.enterBattle(strikeFreedomId, "direct"));
    const discardChoice = p1.getBoardView().pendingChoice;
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional discard choice");
    }
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [discardChoice.directiveIndex]: true },
        targets: [discardOneId!, discardTwoId!],
      }),
    );
    expect(p1.getCardZone(discardOneId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(discardTwoId!)).toBe(`trash:${PLAYER_ONE}`);

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [lowestEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowestEnemyId!] }));

    expect(p2.getCardZone(lowestEnemyId!)).toBe(`deck:${PLAYER_TWO}`);
    expect(p2.getCardZone(higherEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});

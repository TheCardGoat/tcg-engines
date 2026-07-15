import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Peacemillion125 } from "./125-peacemillion.ts";

describe("Peacemillion (GD03-125)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03Peacemillion125] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Peacemillion125)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds one shield to its owner's hand when deployed", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Peacemillion125],
      resourceArea: activeResources(6),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Peacemillion125));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Peacemillion125)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("offers to recover 2 HP after a qualifying Unit destroys an enemy in battle", () => {
    const attacker = createMockUnit({
      traits: ["operation meteor"],
      level: 6,
      ap: 4,
      hp: 6,
    });
    const enemy = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd03Peacemillion125],
        play: [{ card: attacker, damage: 3 }],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_ONE,
      sourceCardId: p1.getCardsInZone("baseSection")[0],
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.getDamage(attackerId)).toBe(1);
    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("lets the player decline the recovery", () => {
    const attacker = createMockUnit({ traits: ["g team"], level: 6, ap: 4, hp: 6 });
    const enemy = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd03Peacemillion125],
        play: [{ card: attacker, damage: 3 }],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getDamage(attackerId)).toBe(3);
  });

  it.each([
    {
      label: "a matching-trait Unit below Lv.6",
      attacker: createMockUnit({ traits: ["g team"], level: 5, ap: 4, hp: 6 }),
    },
    {
      label: "a Lv.6 Unit without Operation Meteor or G Team",
      attacker: createMockUnit({ traits: ["earth federation"], level: 6, ap: 4, hp: 6 }),
    },
  ])("does not offer recovery for $label", ({ attacker }) => {
    const enemy = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd03Peacemillion125],
        play: [{ card: attacker, damage: 3 }],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getDamage(attackerId)).toBe(3);
  });

  it("does not offer recovery when the enemy Unit survives battle damage", () => {
    const attacker = createMockUnit({ traits: ["g team"], level: 6, ap: 2, hp: 6 });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd03Peacemillion125],
        play: [{ card: attacker, damage: 3 }],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getDamage(attackerId)).toBe(3);
    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });

  it("offers recovery only once when two qualifying Units win battles in the same turn", () => {
    const firstAttacker = createMockUnit({
      cardNumber: "TEST-G-TEAM-A",
      traits: ["g team"],
      level: 6,
      ap: 4,
      hp: 6,
    });
    const secondAttacker = createMockUnit({
      cardNumber: "TEST-G-TEAM-B",
      traits: ["g team"],
      level: 6,
      ap: 4,
      hp: 6,
    });
    const firstEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-A", ap: 0, hp: 2 });
    const secondEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-B", ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd03Peacemillion125],
        play: [
          { card: firstAttacker, damage: 3 },
          { card: secondAttacker, damage: 3 },
        ],
      },
      {
        play: [
          { card: firstEnemy, exhausted: true },
          { card: secondEnemy, exhausted: true },
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstAttackerId, secondAttackerId] = p1.getCardsInZone("battleArea");
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(firstAttackerId!, firstEnemyId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expectSuccess(p1.enterBattle(secondAttackerId!, secondEnemyId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getDamage(firstAttackerId!)).toBe(1);
    expect(p1.getDamage(secondAttackerId!)).toBe(3);
  });
});

import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import { expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "./legal-gameplay-test-helpers.ts";

function damageCommand(owner: "friendly" | "opponent", amount: number) {
  return createMockCommand({
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `Choose 1 ${owner} Unit. Deal ${amount} damage to it.`,
      },
    ] as CardEffect[],
  });
}

/** Exercise the Blocker keyword through an ordinary attack and declareBlock move. */
export function expectBlockerAbility(
  card: UnitCard,
  options: { friendlyCompanions?: readonly UnitCard[] } = {},
): void {
  const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 6 });
  const originalTarget = createMockUnit({ name: "Original Target", ap: 1, hp: 5 });
  const engine = GundamTestEngine.create(
    { play: [attacker] },
    {
      play: [
        { card: originalTarget, exhausted: true },
        card,
        ...(options.friendlyCompanions ?? []),
      ],
    },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;
  const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

  expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
  expectSuccess(p2.declareBlock(blockerId!));

  expect(p1.getBoardView().pendingCombat).toMatchObject({
    blockerId,
    stage: "blocker-declared",
  });
  expect(p2.isExhausted(blockerId!)).toBe(true);
  expect(p2.getDamage(originalTargetId!)).toBe(0);

  const restedEngine = GundamTestEngine.create(
    { play: [attacker] },
    {
      play: [
        { card: originalTarget, exhausted: true },
        { card, exhausted: true },
        ...(options.friendlyCompanions ?? []),
      ],
    },
  );
  const restedAttacker = restedEngine.asPlayer(PLAYER_ONE);
  const restedDefender = restedEngine.asPlayer(PLAYER_TWO);
  const restedAttackerId = restedAttacker.getCardsInZone("battleArea")[0]!;
  const [restedTargetId, restedBlockerId] = restedDefender.getCardsInZone("battleArea");

  expectSuccess(restedAttacker.enterBattle(restedAttackerId, restedTargetId!));
  expectFailure(restedDefender.declareBlock(restedBlockerId!), "CANNOT_BLOCK");
  expect(restedAttacker.getBoardView().pendingCombat).toMatchObject({ target: restedTargetId });
}

/** Exercise Breach and prove the printed value is dealt to the enemy Base. */
export function expectBreachAbility(card: UnitCard, amount: number): void {
  const defender = createMockUnit({ name: "Breach Defender", ap: 0, hp: 1 });
  const base = createMockBase({ name: "Breach Base", hp: amount + 2 });
  const engine = GundamTestEngine.create(
    { play: [card] },
    { play: [{ card: defender, exhausted: true }], baseSection: [base] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;
  const defenderId = p2.getCardsInZone("battleArea")[0]!;
  const baseId = p2.getCardsInZone("baseSection")[0]!;

  expectSuccess(p1.enterBattle(attackerId, defenderId));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
  expect(p2.getDamage(baseId)).toBe(amount);

  const sturdyDefender = createMockUnit({
    name: "Sturdy Defender",
    ap: 0,
    hp: Math.max(card.ap + 1, 2),
  });
  const untouchedBase = createMockBase({ name: "Untouched Base", hp: amount + 2 });
  const noDestroyEngine = GundamTestEngine.create(
    { play: [card] },
    { play: [{ card: sturdyDefender, exhausted: true }], baseSection: [untouchedBase] },
  );
  const noDestroyP1 = noDestroyEngine.asPlayer(PLAYER_ONE);
  const noDestroyP2 = noDestroyEngine.asPlayer(PLAYER_TWO);
  const noDestroyAttackerId = noDestroyP1.getCardsInZone("battleArea")[0]!;
  const noDestroyDefenderId = noDestroyP2.getCardsInZone("battleArea")[0]!;
  const untouchedBaseId = noDestroyP2.getCardsInZone("baseSection")[0]!;

  expectSuccess(noDestroyP1.enterBattle(noDestroyAttackerId, noDestroyDefenderId));
  expectSuccess(noDestroyP2.passBlock());
  expectSuccess(noDestroyP2.passBattleAction());
  expectSuccess(noDestroyP1.passBattleAction());

  expect(noDestroyP2.getCardZone(noDestroyDefenderId)).toBe(`battleArea:${PLAYER_TWO}`);
  expect(noDestroyP2.getDamage(untouchedBaseId)).toBe(0);
}

/** Exercise Repair at the controller's End Phase and not the opponent's End Phase. */
export function expectRepairAbility(card: UnitCard, amount: number): void {
  const friendlyDamage = damageCommand("friendly", amount + 1);
  const engine = GundamTestEngine.create(
    { hand: [friendlyDamage], play: [card], deck: 5 },
    { deck: 5 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const cardId = p1.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.playCommand(friendlyDamage));
  expectSuccess(p1.resolveEffect({ targets: [cardId] }));
  expect(p1.getDamage(cardId)).toBe(amount + 1);
  passTurnThroughPublicMoves(engine, PLAYER_ONE);
  expect(p1.getDamage(cardId)).toBe(1);

  const opponentDamage = damageCommand("opponent", amount + 1);
  const opponentTurnEngine = GundamTestEngine.create(
    { play: [card], deck: 5 },
    { hand: [opponentDamage], deck: 5 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const opponentTurnP1 = opponentTurnEngine.asPlayer(PLAYER_ONE);
  const opponentTurnP2 = opponentTurnEngine.asPlayer(PLAYER_TWO);
  const opponentTurnCardId = opponentTurnP1.getCardsInZone("battleArea")[0]!;

  expectSuccess(opponentTurnP2.playCommand(opponentDamage));
  expectSuccess(opponentTurnP2.resolveEffect({ targets: [opponentTurnCardId] }));
  passTurnThroughPublicMoves(opponentTurnEngine, PLAYER_TWO);
  expect(opponentTurnP1.getDamage(opponentTurnCardId)).toBe(amount + 1);
}

/** Exercise Support through useSupport and prove its rest cost and exact AP bonus. */
export function expectSupportAbility(card: UnitCard, amount: number): void {
  const firstAlly = createMockUnit({ name: "First Ally", ap: 3, hp: 5 });
  const secondAlly = createMockUnit({ name: "Second Ally", ap: 4, hp: 5 });
  const engine = GundamTestEngine.create({ play: [card, firstAlly, secondAlly] });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const [supporterId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

  expectSuccess(p1.useSupport(supporterId!, firstAllyId!));
  expect(p1.isExhausted(supporterId!)).toBe(true);
  expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(3 + amount);
  expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(4);

  const selfTargetEngine = GundamTestEngine.create({ play: [card, firstAlly] });
  const selfTargetP1 = selfTargetEngine.asPlayer(PLAYER_ONE);
  const selfTargetSupporterId = selfTargetP1.getCardsInZone("battleArea")[0]!;

  expectFailure(
    selfTargetP1.useSupport(selfTargetSupporterId, selfTargetSupporterId),
    "ILLEGAL_TARGET",
  );
  expect(selfTargetP1.isExhausted(selfTargetSupporterId)).toBe(false);
}

export function expectHighManeuverAbility(card: UnitCard): void {
  const blocker = createMockUnit({
    name: "Enemy Blocker",
    keywordEffects: [{ keyword: "Blocker" }],
  });
  const engine = GundamTestEngine.create({ play: [card] }, { play: [blocker] });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;
  const blockerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.enterBattle(attackerId, "direct"));
  expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");

  expect(p2.isExhausted(blockerId)).toBe(false);
}

export function expectSuppressionAbility(
  card: UnitCard,
  options: { friendlyCompanions?: readonly UnitCard[] } = {},
): void {
  const engine = GundamTestEngine.create(
    { play: [card, ...(options.friendlyCompanions ?? [])] },
    {
      shieldArea: [
        createMockUnit({ name: "First Shield" }),
        createMockUnit({ name: "Second Shield" }),
      ],
    },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.enterBattle(attackerId, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
  expect(p2.getCardsInZone("trash")).toHaveLength(2);
}

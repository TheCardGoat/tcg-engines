import type { UnitCard } from "@tcg/gundam-types";
import { expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";

export function expectDeployPlacesActiveExResources(card: UnitCard, count: number): void {
  const engine = GundamTestEngine.create({
    hand: [card],
    resourceArea: activeResources(Math.max(card.level, card.cost)),
  });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const resourcesBefore = p1.getCardsInZone("resourceArea");
  const cardId = p1.getHand()[0]!;

  expectSuccess(p1.deployUnit(cardId));

  expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
  const placedResources = p1
    .getCardsInZone("resourceArea")
    .filter((resourceId) => !resourcesBefore.includes(resourceId));
  expect(placedResources).toHaveLength(count);
  for (const resourceId of placedResources) {
    expect(p1.isExhausted(resourceId)).toBe(false);
  }
}

export function expectDeployDamagesRestedEnemy(
  card: UnitCard,
  amount: number,
  targetLevel = 1,
): void {
  const enemy = createMockUnit({
    name: "Eligible Rested Enemy",
    level: targetLevel,
    hp: amount + 3,
  });
  const engine = GundamTestEngine.create(
    {
      hand: [card],
      resourceArea: activeResources(Math.max(card.level, card.cost)),
    },
    { play: [{ card: enemy, exhausted: true }] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const cardId = p1.getHand()[0]!;
  const enemyId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.deployUnit(cardId));
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "targetSelection") {
    throw new Error(`Expected ${card.cardNumber}'s Deploy target choice`);
  }
  expect(choice.legalTargetIds).toEqual([enemyId]);

  expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

  expect(p2.getDamage(enemyId)).toBe(amount);
  expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
}

export function expectDeployDestroysEnemyAtOrBelowLevel(
  card: UnitCard,
  maximumLevel: number,
): void {
  const eligible = createMockUnit({ name: "Eligible Enemy", level: maximumLevel, hp: 8 });
  const ineligible = createMockUnit({
    name: "Ineligible Enemy",
    level: maximumLevel + 1,
    hp: 8,
  });
  const engine = GundamTestEngine.create(
    {
      hand: [card],
      resourceArea: activeResources(Math.max(card.level, card.cost)),
    },
    { play: [eligible, ineligible] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const cardId = p1.getHand()[0]!;
  const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

  expectSuccess(p1.deployUnit(cardId));
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "targetSelection") {
    throw new Error(`Expected ${card.cardNumber}'s Deploy target choice`);
  }
  expect(choice.legalTargetIds).toEqual([eligibleId]);

  expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

  expect(p2.getCardZone(eligibleId!)).toBe(`trash:${PLAYER_TWO}`);
  expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
}

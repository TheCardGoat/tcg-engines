import type { UnitCard } from "@tcg/gundam-types";
import { expect } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "./legal-gameplay-test-helpers.ts";

export function expectDestroyedDrawsExactly(
  card: UnitCard,
  count: number,
  options: { requiredPilotTrait?: string; destroyerDraws?: number } = {},
): void {
  const attacker = createMockUnit({ name: "Enemy Attacker", ap: card.hp + 10, hp: 20 });
  const requiredPilot = options.requiredPilotTrait
    ? createMockPilot({
        name: `Required ${options.requiredPilotTrait} Pilot`,
        traits: [options.requiredPilotTrait],
      })
    : undefined;
  const pilotHost = requiredPilot
    ? createMockUnit({ name: "Required Pilot Host", hp: 8 })
    : undefined;
  const engine = GundamTestEngine.create(
    {
      hand: requiredPilot ? [requiredPilot] : [],
      play: pilotHost ? [card, pilotHost] : [card],
      deck: count + 1,
      resourceArea: requiredPilot ? activeResources(1) : [],
      shieldArea: [createMockUnit({ name: "Friendly Shield" })],
    },
    {
      play: [attacker],
      deck: 5,
      shieldArea: [
        createMockUnit({ name: "First Enemy Shield" }),
        createMockUnit({ name: "Second Enemy Shield" }),
      ],
    },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const sourceId = p1.getCardsInZone("battleArea")[0]!;
  const pilotHostId = p1.getCardsInZone("battleArea")[1];
  const attackerId = p2.getCardsInZone("battleArea")[0]!;
  const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

  if (requiredPilot) {
    expectSuccess(p1.assignPilot(requiredPilot, pilotHostId!));
  }
  restUnitsByAttackingDirectly(engine, PLAYER_ONE, [sourceId]);
  passTurnThroughPublicMoves(engine, PLAYER_ONE);
  const destroyerDeckBefore = p2.getBoardView().players[PLAYER_TWO]!.deckCount;
  const destroyerHandBefore = p2.getHand().length;
  expectSuccess(p2.enterBattle(attackerId, sourceId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());

  expect(p1.getCardZone(sourceId)).toBe(`trash:${PLAYER_ONE}`);
  expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - count);
  expect(p1.getHand()).toHaveLength(count);
  if (options.destroyerDraws !== undefined) {
    expect(p2.getBoardView().players[PLAYER_TWO]!.deckCount).toBe(
      destroyerDeckBefore - options.destroyerDraws,
    );
    expect(p2.getHand()).toHaveLength(destroyerHandBefore + options.destroyerDraws);
  }
}

export function expectDestroyedDrawsThenDiscards(card: UnitCard, count: number): void {
  const attacker = createMockUnit({ name: "Enemy Attacker", ap: card.hp + 1, hp: 10 });
  const engine = GundamTestEngine.create(
    {
      play: [card],
      deck: count + 1,
      shieldArea: [createMockUnit({ name: "Friendly Shield" })],
    },
    {
      play: [attacker],
      deck: 5,
      shieldArea: [
        createMockUnit({ name: "First Enemy Shield" }),
        createMockUnit({ name: "Second Enemy Shield" }),
      ],
    },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const sourceId = p1.getCardsInZone("battleArea")[0]!;
  const attackerId = p2.getCardsInZone("battleArea")[0]!;

  restUnitsByAttackingDirectly(engine, PLAYER_ONE, [sourceId]);
  passTurnThroughPublicMoves(engine, PLAYER_ONE);
  const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
  expectSuccess(p2.enterBattle(attackerId, sourceId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());

  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "targetSelection") {
    throw new Error(`Expected ${card.cardNumber}'s discard choice after drawing`);
  }
  expect(choice.legalTargetIds).toEqual(p1.getHand());
  expect(choice.minTargets).toBe(count);
  expect(choice.maxTargets).toBe(count);
  const discardedIds = choice.legalTargetIds.slice(0, count);

  expectSuccess(p1.resolveEffect({ targets: discardedIds }));

  expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - count);
  expect(p1.getHand()).toHaveLength(0);
  for (const discardedId of discardedIds) {
    expect(p1.getCardZone(discardedId)).toBe(`trash:${PLAYER_ONE}`);
  }
}

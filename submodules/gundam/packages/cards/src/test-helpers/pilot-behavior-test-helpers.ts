import type { PilotCard } from "@tcg/gundam-types";
import { expect } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";

export function expectPilotBurstAddsToHand(card: PilotCard): void {
  const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 4 });
  const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [card] });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.enterBattle(attackerId, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  // Rule 13-2-5-2: pure return Bursts are still optional — accept to hand.
  expect(p2.getBoardView().pendingChoice).toMatchObject({
    kind: "optional",
    directiveIndex: -1,
  });
  expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
  expect(p2.getCardZone(card)).toBe(`hand:${PLAYER_TWO}`);
  expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
  expect(p2.getBoardView().pendingChoice).toBeUndefined();
}

/** Declining a pure add-to-hand Burst leaves the revealed Shield in trash. */
export function expectPilotBurstDeclineTrashes(card: PilotCard): void {
  const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 4 });
  const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [card] });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.enterBattle(attackerId, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));
  expect(p2.getCardZone(card)).toBe(`trash:${PLAYER_TWO}`);
  expect(p2.getBoardView().pendingChoice).toBeUndefined();
}

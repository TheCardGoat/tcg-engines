/**
 * Test helpers: hand-built states for precise scenario control.
 */

import { getCardById } from "@tcg-engines/naruto-cards";

import { newCharacter } from "../src/queries";
import type {
  CharacterInstance,
  GameState,
  PlayerId,
  PlayerState,
} from "../src/types";

export function barePlayer(id: PlayerId, leaderId: string): PlayerState {
  return {
    id,
    name: id,
    leaderId,
    life: 15,
    leaderRested: false,
    leaderAttacksUsed: 0,
    leaderCannotAttackUntilTurn: 0,
    deck: [],
    hand: [],
    trash: [],
    characters: [null, null, null, null, null],
    supports: [null, null, null, null, null],
    chakra: Array.from({ length: 5 }, (_, i) => ({ uid: `${id}-chakra-${i}`, faceUp: true })),
    exPile: [],
    summonRested: false,
    summonsUsedThisTurn: 0,
    leaderUsedThisTurn: false,
    mulliganDone: true,
    chakraLockedUntilTurn: 0,
  };
}

export interface BareStateOverrides {
  readonly turn?: number;
  readonly activePlayer?: PlayerId;
  readonly leaderP1?: string;
  readonly leaderP2?: string;
}

/** A minimal legal main-phase state (turn 3 so attacks are unlocked). */
export function bareState(overrides: BareStateOverrides = {}): GameState {
  return {
    turn: overrides.turn ?? 3,
    activePlayer: overrides.activePlayer ?? "p1",
    phase: "main",
    step: "normal",
    priority: null,
    pendingAttack: null,
    pendingChoice: null,
    chain: [],
    resolvingSupport: null,
    consecutivePasses: 0,
    awaitingMulligan: null,
    winner: null,
    seed: 1,
    log: [],
    players: {
      p1: barePlayer("p1", overrides.leaderP1 ?? "N-001"),
      p2: barePlayer("p2", overrides.leaderP2 ?? "N-012"),
    },
  };
}

let uidCounter = 0;

/** Place a character on a player's board (defaults: summoned turn 1, healthy). */
export function addCharacter(
  state: GameState,
  owner: PlayerId,
  cardId: string,
  options: { readonly slot?: number; readonly rested?: boolean; readonly summonedOnTurn?: number } = {},
): CharacterInstance {
  uidCounter += 1;
  const character = newCharacter(`${owner}-u${uidCounter}`, cardId, options.summonedOnTurn ?? 1);
  character.rested = options.rested ?? false;
  const board = state.players[owner].characters;
  const slot = options.slot ?? board.findIndex((c) => c === null);
  board[slot] = character;
  return character;
}

export function statOf(cardId: string, stat: "damage" | "power" | "health"): number {
  return getCardById(cardId)?.[stat] ?? 0;
}

/** First character card id whose health is at most `maxHealth`. */
export function weakCharacterId(maxHealth: number): string {
  const found = [
    "N-choji",
    "N-sakura",
    "N-hinata",
    "N-reveal-01",
    "N-reveal-02",
    "N-reveal-03",
    "N-reveal-04",
    "N-reveal-05",
    "N-reveal-06",
    "N-reveal-07",
    "N-reveal-08",
    "N-reveal-09",
    "N-reveal-10",
    "N-008",
    "N-011",
    "N-006",
    "N-007",
    "N-010",
    "N-013",
    "N-019",
  ].find((id) => {
    const card = getCardById(id);
    return card?.cardType === "character" && (card.health ?? 99) <= maxHealth;
  });
  if (!found) throw new Error("no weak character found");
  return found;
}

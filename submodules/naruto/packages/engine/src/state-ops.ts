/**
 * Internal state-mutation primitives shared by the reducer and the effect
 * interpreter. These operate on the mutable copy of state that `applyAction`
 * hands to them — they are never called on a frozen/committed state.
 */

import { pushLog } from "./log";
import {
  cardOf,
  characterHealth,
  newCharacter,
  nextCharacterSlot,
} from "./queries";
import type {
  CardInstance,
  ChainLink,
  GameState,
  PlayerId,
  PlayerState,
} from "./types";

/** Structural shallow copy of a player (all nested arrays fresh). */
export function copyPlayer(player: PlayerState): PlayerState {
  return {
    ...player,
    deck: [...player.deck],
    hand: [...player.hand],
    trash: [...player.trash],
    characters: player.characters.map((c) => (c ? { ...c } : null)),
    supports: player.supports.map((s) => (s ? { ...s } : null)),
    chakra: player.chakra.map((c) => ({ ...c })),
    exPile: [...player.exPile],
  };
}

/** Flip `cost` face-up chakra face-down; false (no-op) if unaffordable. */
export function payChakra(player: PlayerState, cost: number): boolean {
  if (player.chakra.filter((c) => c.faceUp).length < cost) return false;
  let remaining = cost;
  for (const chakra of player.chakra) {
    if (remaining === 0) break;
    if (chakra.faceUp) {
      chakra.faceUp = false;
      remaining -= 1;
    }
  }
  return true;
}

/** Place a new character in the next open slot (growing the board if needed). */
export function placeCharacter(
  state: GameState,
  player: PlayerId,
  instance: CardInstance,
): number | null {
  const slot = nextCharacterSlot(state, player);
  if (slot === null) return null;
  const board = state.players[player].characters;
  while (board.length <= slot) board.push(null);
  board[slot] = newCharacter(instance.uid, instance.cardId, state.turn);
  return slot;
}

/** Move the character at `index` to its owner's trash. */
export function trashCharacterAt(state: GameState, owner: PlayerId, index: number): void {
  const playerState = state.players[owner];
  const character = playerState.characters[index];
  if (!character) return;
  playerState.characters[index] = null;
  playerState.trash.push({ uid: character.uid, cardId: character.cardId });
  pushLog(state, owner, "log.characterTrashed", {
    card: cardOf(character)?.nameEn ?? "",
  });
}

/** KO check: every character with damage >= health goes to the trash. */
export function koCheck(state: GameState): void {
  for (const playerId of ["p1", "p2"] as const) {
    state.players[playerId].characters.forEach((character, index) => {
      if (character && character.damage >= characterHealth(character)) {
        trashCharacterAt(state, playerId, index);
      }
    });
  }
}

export function removeSupportFromSlot(state: GameState, player: PlayerId, uid: string): void {
  const supports = state.players[player].supports;
  for (let i = 0; i < supports.length; i += 1) {
    if (supports[i]?.uid === uid) supports[i] = null;
  }
}

/** Clear a consumed chain link: remove from its slot, trash unless kept. */
export function settleChainLink(state: GameState, link: ChainLink, keepsCard: boolean): void {
  removeSupportFromSlot(state, link.player, link.uid);
  if (!keepsCard) {
    state.players[link.player].trash.push({ uid: link.uid, cardId: link.cardId });
  }
}

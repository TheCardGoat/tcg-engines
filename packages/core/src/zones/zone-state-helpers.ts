import type { CardId, PlayerId } from "../types";
import type { Zone } from "./zone";
import { moveCard } from "./zone-operations";

/**
 * Creates a record of zones for each player with optional initialization
 * @param players - Array of player IDs
 * @param initialValue - Optional factory function to create initial value for each player
 * @returns Record mapping each player to their value
 *
 * @example
 * ```typescript
 * // Create empty arrays for each player
 * const hands = createPlayerZones(players);
 *
 * // Create with custom initial values
 * const decks = createPlayerZones(players, () => []);
 *
 * // Create with complex initial values
 * const zones = createPlayerZones(players, () => ({
 *   hand: [],
 *   deck: [],
 *   graveyard: []
 * }));
 * ```
 */
export function createPlayerZones<T>(
  players: PlayerId[],
  initialValue?: () => T,
): Record<PlayerId, T> {
  const zones = {} as Record<PlayerId, T>;

  for (const playerId of players) {
    zones[playerId] = initialValue ? initialValue() : (undefined as T);
  }

  return zones;
}

/**
 * Moves a card between zones in a flat zone state object
 * @param state - Object containing zones as properties
 * @param fromZoneKey - Key of the source zone in state
 * @param toZoneKey - Key of the destination zone in state
 * @param cardId - Card to move
 * @param position - Optional position in destination zone
 * @returns New state object with updated zones
 *
 * @example
 * ```typescript
 * const state = {
 *   hand: createZone(...),
 *   deck: createZone(...),
 * };
 *
 * // Move card from hand to deck
 * const newState = moveCardInState(state, "hand", "deck", cardId);
 *
 * // Move to specific position
 * const newState2 = moveCardInState(state, "hand", "deck", cardId, 0);
 * ```
 */
export function moveCardInState<
  TState extends Record<string, Zone>,
  TFromKey extends keyof TState,
  TToKey extends keyof TState,
>(
  state: TState,
  fromZoneKey: TFromKey,
  toZoneKey: TToKey,
  cardId: CardId,
  position?: number,
): TState {
  const fromZone = state[fromZoneKey];
  const toZone = state[toZoneKey];

  const { fromZone: updatedFrom, toZone: updatedTo } = moveCard(
    fromZone,
    toZone,
    cardId,
    position,
  );

  return {
    ...state,
    [fromZoneKey]: updatedFrom,
    [toZoneKey]: updatedTo,
  };
}

/**
 * Finds which zone contains a card in a flat zone state object
 * @param state - Object containing zones as properties
 * @param cardId - Card to find
 * @returns Key of the zone containing the card, or undefined if not found
 *
 * @example
 * ```typescript
 * const state = {
 *   hand: createZone(..., [card1, card2]),
 *   deck: createZone(..., [card3]),
 * };
 *
 * const zoneName = getCardZone(state, card1);
 * // Returns: "hand"
 *
 * const missing = getCardZone(state, card4);
 * // Returns: undefined
 * ```
 */
export function getCardZone<TState extends Record<string, Zone>>(
  state: TState,
  cardId: CardId,
): keyof TState | undefined {
  for (const key in state) {
    if (state[key].cards.includes(cardId)) {
      return key;
    }
  }
  return undefined;
}

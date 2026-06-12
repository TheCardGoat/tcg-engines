/**
 * Remaps player IDs in a serialized game state and cardsMaps.
 *
 * Replay states use server-assigned IDs (e.g., `gp_xxx`, `usr_xxx`).
 * The local HumanVsAiOrchestrator expects canonical `player_one`/`player_two`.
 * This utility performs a global string replacement on the serialized state,
 * which is safe because server-assigned IDs have distinctive prefixed formats
 * that won't collide with game data (card IDs, zone names, etc.).
 */

import type { CardsMaps, LorcanaMatchState } from "@tcg/lorcana-engine";

interface RemapPlayerIdsInput {
  state: LorcanaMatchState;
  cardsMaps: CardsMaps;
  /** The replay's original player IDs: [humanPlayer, aiPlayer]. */
  sourceIds: [string, string];
  /** The target canonical IDs: [humanPlayer, aiPlayer]. */
  targetIds: [string, string];
}

interface RemapPlayerIdsResult {
  state: LorcanaMatchState;
  cardsMaps: CardsMaps;
}

export function remapPlayerIds({
  state,
  cardsMaps,
  sourceIds,
  targetIds,
}: RemapPlayerIdsInput): RemapPlayerIdsResult {
  // Use intermediate placeholders to avoid collisions when source IDs overlap
  // with target IDs (e.g., swapping "a" → "b" and "b" → "a").
  const placeholder0 = `__remap_placeholder_0__`;
  const placeholder1 = `__remap_placeholder_1__`;

  // Remap state via JSON round-trip with string replacement
  let stateJson = JSON.stringify(state);
  stateJson = stateJson.replaceAll(sourceIds[0], placeholder0);
  stateJson = stateJson.replaceAll(sourceIds[1], placeholder1);
  stateJson = stateJson.replaceAll(placeholder0, targetIds[0]);
  stateJson = stateJson.replaceAll(placeholder1, targetIds[1]);
  const remappedState = JSON.parse(stateJson) as LorcanaMatchState;

  // Remap cardsMaps via JSON round-trip
  let cardsMapsJson = JSON.stringify(cardsMaps);
  cardsMapsJson = cardsMapsJson.replaceAll(sourceIds[0], placeholder0);
  cardsMapsJson = cardsMapsJson.replaceAll(sourceIds[1], placeholder1);
  cardsMapsJson = cardsMapsJson.replaceAll(placeholder0, targetIds[0]);
  cardsMapsJson = cardsMapsJson.replaceAll(placeholder1, targetIds[1]);
  const remappedCardsMaps = JSON.parse(cardsMapsJson) as CardsMaps;

  return { state: remappedState, cardsMaps: remappedCardsMaps };
}

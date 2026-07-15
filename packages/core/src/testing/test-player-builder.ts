import type { Player } from "../game-definition/game-definition";
import { createPlayerId } from "../types";

/**
 * Test Player Builder
 *
 * Task 2.4: Implement createTestPlayers(count, names?)
 *
 * Creates an array of test players with unique IDs and names.
 * Simplifies test setup by reducing boilerplate player creation.
 *
 * Features:
 * - Generates unique PlayerId for each player
 * - Uses custom names if provided, otherwise generates default names
 * - Deterministic IDs based on player index for reproducible tests
 *
 * @example
 * ```typescript
 * // Create 2 players with default names
 * const players = createTestPlayers(2);
 * // [{ id: 'test-p1', name: 'Player 1' }, { id: 'test-p2', name: 'Player 2' }]
 *
 * // Create players with custom names
 * const players = createTestPlayers(3, ['Alice', 'Bob', 'Charlie']);
 * // [{ id: 'test-p1', name: 'Alice' }, ...]
 *
 * // Partial custom names
 * const players = createTestPlayers(3, ['Alice']);
 * // [{ id: 'test-p1', name: 'Alice' }, { id: 'test-p2', name: 'Player 2' }, ...]
 * ```
 */
export function createTestPlayers(count: number, names?: string[]): Player[] {
  const players: Player[] = [];

  for (let i = 0; i < count; i++) {
    const playerId = createPlayerId(`test-p${i + 1}`);
    const playerName = names?.[i] ?? `Player ${i + 1}`;

    players.push({
      id: playerId,
      name: playerName,
    });
  }

  return players;
}

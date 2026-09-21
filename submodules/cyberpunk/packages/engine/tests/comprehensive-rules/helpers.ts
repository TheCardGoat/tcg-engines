import { expect } from "vite-plus/test";
import type { CyberpunkTestEngine } from "../../src/testing/index.ts";
import type { PlayerId } from "../../src/types/branded.ts";

export function passTurn(engine: CyberpunkTestEngine, as?: PlayerId): void {
  engine.passPhase({ as: as ?? engine.getActivePlayerId() });
}

export function expectMoveAvailable(
  engine: CyberpunkTestEngine,
  playerId: PlayerId,
  moveId: string,
): void {
  expect(engine.getPrompt(playerId).availableMoves.some((move) => move.moveId === moveId)).toBe(
    true,
  );
}

export function expectMoveUnavailable(
  engine: CyberpunkTestEngine,
  playerId: PlayerId,
  moveId: string,
): void {
  expect(engine.getPrompt(playerId).availableMoves.some((move) => move.moveId === moveId)).toBe(
    false,
  );
}

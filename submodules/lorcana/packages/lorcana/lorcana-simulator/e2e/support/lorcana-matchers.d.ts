import type { CanonicalPlayerId } from "../../src/lib/features/simulator-devtools/harness/browser-harness.js";
import type {
  CardReadyState,
  LorcanaZoneId,
} from "../../src/lib/features/simulator/model/contracts.js";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      toHaveOpeningTurnPlayer(expectedPlayer: CanonicalPlayerId | undefined): Promise<R>;
      toHavePendingMulligan(expectedPlayers: CanonicalPlayerId[]): Promise<R>;
      toHavePriorityPlayer(expectedPlayer: CanonicalPlayerId): Promise<R>;
      toHaveChoosingFirstPlayer(expectedPlayer: CanonicalPlayerId | undefined): Promise<R>;
      toBeInPhase(expectedPhase: string): Promise<R>;
      toBeInGameSegment(expectedSegment: string): Promise<R>;
      toHaveCardCountInZone(expected: {
        zone: LorcanaZoneId;
        player: string;
        count: number;
      }): Promise<R>;
      toHaveCardInZone(expected: { card: string; zone: LorcanaZoneId }): Promise<R>;
      toHaveCardStrength(expected: { card: string; value: number }): Promise<R>;
      toHaveCardReadyState(expected: { card: string; readyState: CardReadyState }): Promise<R>;
      toHaveCardKeywordValue(expected: {
        card: string;
        keyword: "challenger" | "resist";
        value: number;
      }): Promise<R>;
    }
  }
}

export {};

import "bun:test";

declare module "bun:test" {
  interface Matchers<T> {
    toBeSuccessfulCommand(): void;
    toBeInZone(expectedZone: string): void;
    toBeInPosition(expectedPosition: number): void;
    toHaveCardCountInZone(expected: { zone: string; player: string; count: number }): void;
    toHaveZoneCounts(
      expected: Partial<Record<"hand" | "deck" | "play" | "inkwell" | "discard", number>>,
    ): void;
    toHavePriorityPlayer(expectedPlayer: string): void;
    toHavePendingMulligan(expectedPlayers: string[]): void;
    toHaveOpeningTurnPlayer(expectedPlayer: string | undefined): void;
    toHaveChoosingFirstPlayer(expectedPlayer: string | undefined): void;
    toBeInPhase(expectedPhase: string): void;
    toBeInGameSegment(expectedSegment: string): void;
    toBeExerted(card: unknown): void;
    toBeReady(card: unknown): void;
    toHaveDamage(expected: { card: unknown; value: number }): void;
    toHaveLore(expected: { card: unknown; value: number }): void;
    toHaveKeyword(expected: { card: unknown; keyword: string; value?: number }): void;
    toHaveRestriction(expected: { card: unknown; restriction: string }): void;
    toHaveGrantedAbility(expected: { card: unknown; ability: string }): void;
    toHaveCardsUnder(expected: { card: unknown; count: number }): void;
    toBeAtLocation(expected: { card: unknown; location: unknown }): void;
    toHavePendingEffectCount(expectedCount: number): void;
  }
}

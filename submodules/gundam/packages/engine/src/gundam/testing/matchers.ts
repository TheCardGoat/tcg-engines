/**
 * Gundam TCG — Custom Test Matchers
 *
 * These extend the test framework's expect() with Gundam-specific assertions.
 * Import this file in your test setup to activate all matchers.
 *
 * Compatible with both Vitest and Bun test.
 */

import type { CommandResult } from "../../types/command.ts";
import type { ZoneRef } from "../../types/zone-types.ts";
import type { GundamPlayerActions, GundamTestEngine } from "./test-engine.ts";
import type { Card } from "@tcg/gundam-types";

// =============================================================================
// Types
// =============================================================================

interface MatcherResult {
  pass: boolean;
  message: () => string;
}

function isTestEngine(value: unknown): value is GundamTestEngine {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).getState === "function" &&
    typeof (value as Record<string, unknown>).getCardsInZone === "function" &&
    typeof (value as Record<string, unknown>).getCardCount === "function"
  );
}

function isPlayerActions(value: unknown): value is GundamPlayerActions {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).isExhausted === "function" &&
    typeof (value as Record<string, unknown>).getDamage === "function" &&
    typeof (value as Record<string, unknown>).getPilotId === "function"
  );
}

// =============================================================================
// Standalone assertion helpers (no framework coupling)
// =============================================================================

export function expectSuccess(result: CommandResult, msg?: string): void {
  if (!result.success) {
    throw new Error(
      `${msg ?? "Expected command to succeed"} — got: ${result.error} (${result.errorCode})`,
    );
  }
}

export function expectFailure(result: CommandResult, expectedCode?: string, msg?: string): void {
  if (result.success) {
    throw new Error(`${msg ?? "Expected command to fail"} — but it succeeded`);
  }
  if (expectedCode && result.errorCode !== expectedCode) {
    throw new Error(
      `Expected error code "${expectedCode}" but got "${result.errorCode}": ${result.error}`,
    );
  }
}

// =============================================================================
// Vitest / Bun custom matchers
// =============================================================================

/**
 * Register custom matchers with the test framework.
 * Call this once in your test setup file.
 *
 * For Vitest: import this and call registerGundamMatchers(expect).
 * For Bun:    import this and call registerGundamMatchers(expect).
 */
export function registerGundamMatchers(expectFn: {
  extend: (matchers: Record<string, (this: unknown, ...args: unknown[]) => MatcherResult>) => void;
}): void {
  expectFn.extend({
    toSucceed(result: unknown): MatcherResult {
      const r = result as CommandResult;
      if (r.success) {
        return { pass: true, message: () => "Expected command to fail but it succeeded" };
      }
      return {
        pass: false,
        message: () => `Expected command to succeed but got: ${r.error} (${r.errorCode})`,
      };
    },

    toFailWith(result: unknown, errorCode: unknown): MatcherResult {
      const r = result as CommandResult;
      if (r.success) {
        return {
          pass: false,
          message: () => `Expected command to fail with "${String(errorCode)}" but it succeeded`,
        };
      }
      if (r.errorCode === errorCode) {
        return {
          pass: true,
          message: () => `Expected command NOT to fail with "${String(errorCode)}"`,
        };
      }
      return {
        pass: false,
        message: () =>
          `Expected error code "${String(errorCode)}" but got "${r.errorCode}": ${r.error}`,
      };
    },

    toBeExhausted(player: unknown, card: unknown): MatcherResult {
      const p = player as GundamPlayerActions;
      const exhausted = p.isExhausted(card as Card | string);
      if (exhausted)
        return { pass: true, message: () => "Expected card to be ready but it was exhausted" };
      return { pass: false, message: () => "Expected card to be exhausted but it was ready" };
    },

    toBeReady(player: unknown, card: unknown): MatcherResult {
      const p = player as GundamPlayerActions;
      const exhausted = p.isExhausted(card as Card | string);
      if (!exhausted)
        return { pass: true, message: () => "Expected card to be exhausted but it was ready" };
      return { pass: false, message: () => "Expected card to be ready but it was exhausted" };
    },

    toHaveDamage(player: unknown, args: unknown): MatcherResult {
      const p = player as GundamPlayerActions;
      const { card, value } = args as { card: Card | string; value: number };
      const actual = p.getDamage(card);
      if (actual === value)
        return { pass: true, message: () => `Expected card NOT to have ${value} damage` };
      return { pass: false, message: () => `Expected ${value} damage but got ${actual}` };
    },

    toHaveResourceCount(player: unknown, expected: unknown): MatcherResult {
      const p = player as GundamPlayerActions;
      const actual = p.getResourceCount();
      if (actual === expected)
        return {
          pass: true,
          message: () => `Expected resource count NOT to be ${expected as number}`,
        };
      return {
        pass: false,
        message: () => `Expected ${expected as number} resources but got ${actual}`,
      };
    },

    toBeInZone(player: unknown, args: unknown): MatcherResult {
      const p = player as GundamPlayerActions;
      const { card, zone } = args as { card: Card | string; zone: string };
      const actualZone = p.getCardZone(card);
      const inZone = actualZone?.startsWith(zone) ?? false;
      if (inZone) return { pass: true, message: () => `Expected card NOT to be in zone ${zone}` };
      return {
        pass: false,
        message: () => `Expected card in zone ${zone} but was in ${actualZone ?? "unknown"}`,
      };
    },

    toBeInPhase(receiver: unknown, phase: unknown): MatcherResult {
      if (!isTestEngine(receiver) && !isPlayerActions(receiver)) {
        return {
          pass: false,
          message: () =>
            "toBeInPhase expects a GundamTestEngine or GundamPlayerActions as the receiver.",
        };
      }
      const actual = isTestEngine(receiver)
        ? receiver.getState().ctx.status.phase
        : receiver.getPhase();
      const pass = actual === phase;
      return {
        pass,
        message: () =>
          pass
            ? `Expected phase NOT to be '${phase as string}'.`
            : `Expected phase '${phase as string}' but got '${actual ?? "undefined"}'.`,
      };
    },

    // ── Engine-level matchers (receiver = GundamTestEngine) ────────────────

    toBeInGameSegment(engine: unknown, segment: unknown): MatcherResult {
      if (!isTestEngine(engine)) {
        return {
          pass: false,
          message: () => "toBeInGameSegment expects a GundamTestEngine as the receiver.",
        };
      }
      const actual = engine.getState().ctx.status.gameSegment;
      const pass = actual === segment;
      return {
        pass,
        message: () =>
          pass
            ? `Expected game segment NOT to be '${segment as string}'.`
            : `Expected game segment '${segment as string}' but got '${actual ?? "undefined"}'.`,
      };
    },

    toHaveActivePlayer(engine: unknown, expectedPlayer: unknown): MatcherResult {
      if (!isTestEngine(engine)) {
        return {
          pass: false,
          message: () => "toHaveActivePlayer expects a GundamTestEngine as the receiver.",
        };
      }
      const actual = engine.getState().ctx.status.activePlayer;
      const pass = actual === expectedPlayer;
      return {
        pass,
        message: () =>
          pass
            ? `Expected active player NOT to be '${expectedPlayer as string}'.`
            : `Expected active player '${expectedPlayer as string}' but got '${actual}'.`,
      };
    },

    toHaveCardInZone(engine: unknown, cardId: unknown, expectedZone: unknown): MatcherResult {
      if (!isTestEngine(engine)) {
        return {
          pass: false,
          message: () => "toHaveCardInZone expects a GundamTestEngine as the receiver.",
        };
      }
      const state = engine.getState();
      const actual = state.ctx.zones.private.cardIndex[cardId as string]?.zoneKey;
      const pass = actual === expectedZone;
      return {
        pass,
        message: () =>
          pass
            ? `Expected card '${cardId as string}' NOT to be in zone '${expectedZone as string}'.`
            : actual === undefined
              ? `Expected card '${cardId as string}' to be in zone '${expectedZone as string}' but the card was not found in any zone.`
              : `Expected card '${cardId as string}' to be in zone '${expectedZone as string}' but it is in '${actual}'.`,
      };
    },

    toHaveCardCountInZone(engine: unknown, zone: unknown, expectedCount: unknown): MatcherResult {
      if (!isTestEngine(engine)) {
        return {
          pass: false,
          message: () => "toHaveCardCountInZone expects a GundamTestEngine as the receiver.",
        };
      }
      const zoneRef = zone as ZoneRef;
      const actual = engine.getCardCount(zoneRef);
      const pass = actual === expectedCount;
      const zoneKey = zoneRef.playerId ? `${zoneRef.zone}:${zoneRef.playerId}` : zoneRef.zone;
      return {
        pass,
        message: () =>
          pass
            ? `Expected zone '${zoneKey}' NOT to have ${expectedCount as number} card(s).`
            : `Expected zone '${zoneKey}' to have ${expectedCount as number} card(s) but found ${actual}.`,
      };
    },

    toHaveGameEnded(engine: unknown, expectedWinner?: unknown): MatcherResult {
      if (!isTestEngine(engine)) {
        return {
          pass: false,
          message: () => "toHaveGameEnded expects a GundamTestEngine as the receiver.",
        };
      }
      const status = engine.getState().ctx.status;
      if (!status.gameEnded) {
        return {
          pass: false,
          message: () => "Expected game to have ended but it is still in progress.",
        };
      }
      if (expectedWinner !== undefined && status.winner !== expectedWinner) {
        return {
          pass: false,
          message: () =>
            `Expected winner to be '${expectedWinner as string}' but got '${status.winner ?? "none"}'.`,
        };
      }
      return {
        pass: true,
        message: () =>
          expectedWinner !== undefined
            ? `Expected game NOT to have ended with winner '${expectedWinner as string}'.`
            : "Expected game NOT to have ended.",
      };
    },

    toHaveGameInProgress(engine: unknown): MatcherResult {
      if (!isTestEngine(engine)) {
        return {
          pass: false,
          message: () => "toHaveGameInProgress expects a GundamTestEngine as the receiver.",
        };
      }
      const status = engine.getState().ctx.status;
      const pass = !status.gameEnded;
      return {
        pass,
        message: () =>
          pass
            ? "Expected game NOT to be in progress."
            : `Expected game to be in progress but it ended (winner: ${status.winner ?? "none"}).`,
      };
    },

    /**
     * Assert a unit has a pilot assigned. `unit` and `pilot` are instance ID strings.
     * Omit `pilot` to only assert that some pilot is assigned.
     *
     * @example
     * expect(p1).toHavePilot({ unit: unitId })
     * expect(p1).toHavePilot({ unit: unitId, pilot: pilotId })
     */
    toHavePilot(player: unknown, args: unknown): MatcherResult {
      if (!isPlayerActions(player)) {
        return {
          pass: false,
          message: () => "toHavePilot expects a GundamPlayerActions as the receiver.",
        };
      }
      const { unit, pilot } = args as { unit: Card | string; pilot?: string };
      const actualPilotId = player.getPilotId(unit);

      if (pilot === undefined) {
        const pass = actualPilotId !== undefined;
        return {
          pass,
          message: () =>
            pass
              ? "Expected unit NOT to have any pilot assigned."
              : "Expected unit to have a pilot assigned but none is assigned.",
        };
      }

      const pass = actualPilotId === pilot;
      return {
        pass,
        message: () =>
          pass
            ? `Expected unit NOT to have pilot '${pilot}'.`
            : `Expected unit to have pilot '${pilot}' but got '${actualPilotId ?? "none"}'.`,
      };
    },
  });
}

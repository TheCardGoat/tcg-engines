import { expect } from "vite-plus/test";
import type { CardZone } from "@tcg/cyberpunk-types";
import type { CommandResult } from "../types/commands.ts";
import type { MatchState, GamePhase } from "../types/match-state.ts";
import type { CardInstance } from "../types/card-instance.ts";
import { getEffectivePower as computePower } from "../active-effects/index.ts";

/**
 * Custom Vitest matchers for engine tests. Opt-in: tests that use these must
 * import {@link registerMatchers} and call it (typically in a top-level
 * `beforeAll`, or once at test-bootstrap time).
 *
 * They are NOT auto-registered on import. The {@link CyberpunkTestEngine}
 * class is reused at runtime by the simulator app, and auto-registering
 * matchers here would force `vite-plus/test` (i.e. vitest) into the app
 * bundle. Explicit opt-in keeps the test surface bundleable in production.
 */

function isCommandResult(v: unknown): v is CommandResult {
  return typeof v === "object" && v !== null && "success" in v;
}

function isCardInstance(v: unknown): v is CardInstance {
  return typeof v === "object" && v !== null && "instanceId" in v && "zone" in v;
}

function isMatchState(v: unknown): v is MatchState {
  return (
    typeof v === "object" &&
    v !== null &&
    "G" in v &&
    "ctx" in v &&
    typeof (v as MatchState).G === "object"
  );
}

export function registerMatchers(): void {
  expect.extend({
    toBeSuccessfulCommand(received: unknown) {
      if (!isCommandResult(received)) {
        return {
          pass: false,
          message: () => `Expected a CommandResult, got ${typeof received}`,
        };
      }

      if (received.success) {
        return {
          pass: true,
          message: () => "Expected command to fail, but it succeeded",
        };
      }

      const errorDetail =
        "error" in received
          ? ` (${received.error}, code: ${(received as any).errorCode ?? "unknown"})`
          : "";

      return {
        pass: false,
        message: () => `Expected command to succeed, but it failed${errorDetail}`,
      };
    },

    toBeInZone(received: unknown, zone: CardZone) {
      if (!isCardInstance(received)) {
        return {
          pass: false,
          message: () => `Expected a CardInstance, got ${typeof received}`,
        };
      }

      if (received.zone === zone) {
        return {
          pass: true,
          message: () => `Expected card to NOT be in zone "${zone}", but it was`,
        };
      }

      return {
        pass: false,
        message: () =>
          `Expected card to be in zone "${zone}", but it was in zone "${received.zone}"`,
      };
    },

    toHaveEddies(received: unknown, expected: { player: string; count: number }) {
      if (typeof received !== "object" || received === null) {
        return {
          pass: false,
          message: () => `Expected a state object with G.players, got ${typeof received}`,
        };
      }

      const state = received as MatchState;
      const player = state.G.players[expected.player];
      if (!player) {
        return {
          pass: false,
          message: () => `Player "${expected.player}" not found in state`,
        };
      }

      const actual = player.eddies;
      if (actual === expected.count) {
        return {
          pass: true,
          message: () =>
            `Expected player "${expected.player}" to NOT have ${expected.count} eddies, but did`,
        };
      }

      return {
        pass: false,
        message: () =>
          `Expected player "${expected.player}" to have ${expected.count} eddies, but had ${actual}`,
      };
    },

    toBeInPhase(received: unknown, phase: GamePhase) {
      if (typeof received !== "object" || received === null) {
        return {
          pass: false,
          message: () => `Expected a MatchState, got ${typeof received}`,
        };
      }

      const state = received as MatchState;
      const actual = state.G.gamePhase;
      if (actual === phase) {
        return {
          pass: true,
          message: () => `Expected game to NOT be in phase "${phase}", but it was`,
        };
      }

      return {
        pass: false,
        message: () => `Expected game to be in phase "${phase}", but was in "${actual}"`,
      };
    },

    toHaveEffectivePower(received: unknown, expected: { card: string; value: number }) {
      if (!isMatchState(received)) {
        return {
          pass: false,
          message: () => `Expected a MatchState, got ${typeof received}`,
        };
      }

      const actual = computePower(received, expected.card);
      if (actual === expected.value) {
        return {
          pass: true,
          message: () =>
            `Expected card "${expected.card}" to NOT have effective power ${expected.value}, but it did`,
        };
      }

      return {
        pass: false,
        message: () =>
          `Expected card "${expected.card}" to have effective power ${expected.value}, but was ${actual}`,
      };
    },

    toBeSpent(received: unknown) {
      if (!isCardInstance(received)) {
        return {
          pass: false,
          message: () => `Expected a CardInstance, got ${typeof received}`,
        };
      }
      if (received.meta.spent) {
        return {
          pass: true,
          message: () => `Expected card to NOT be spent, but it was`,
        };
      }
      return {
        pass: false,
        message: () => `Expected card to be spent, but it was ready`,
      };
    },

    toBeReady(received: unknown) {
      if (!isCardInstance(received)) {
        return {
          pass: false,
          message: () => `Expected a CardInstance, got ${typeof received}`,
        };
      }
      if (!received.meta.spent) {
        return {
          pass: true,
          message: () => `Expected card to NOT be ready, but it was`,
        };
      }
      return {
        pass: false,
        message: () => `Expected card to be ready, but it was spent`,
      };
    },

    toHaveDamage(received: unknown, expected: number) {
      if (!isCardInstance(received)) {
        return {
          pass: false,
          message: () => `Expected a CardInstance, got ${typeof received}`,
        };
      }
      const actual = received.meta.damage;
      if (actual === expected) {
        return {
          pass: true,
          message: () => `Expected card to NOT have damage ${expected}, but it did`,
        };
      }
      return {
        pass: false,
        message: () => `Expected card to have damage ${expected}, but had ${actual}`,
      };
    },

    toBeFaceDown(received: unknown) {
      if (!isCardInstance(received)) {
        return {
          pass: false,
          message: () => `Expected a CardInstance, got ${typeof received}`,
        };
      }
      if (received.meta.faceDown) {
        return {
          pass: true,
          message: () => `Expected card to be face-up, but it was face-down`,
        };
      }
      return {
        pass: false,
        message: () => `Expected card to be face-down, but it was face-up`,
      };
    },

    toHaveZoneCounts(
      received: unknown,
      expected: { player: string } & Partial<Record<CardZone, number>>,
    ) {
      if (!isMatchState(received)) {
        return {
          pass: false,
          message: () => `Expected a MatchState, got ${typeof received}`,
        };
      }
      const player = received.G.players[expected.player];
      if (!player) {
        return {
          pass: false,
          message: () => `Player "${expected.player}" not found in state`,
        };
      }
      const mismatches: string[] = [];
      for (const [zone, count] of Object.entries(expected)) {
        if (zone === "player") continue;
        const actual = player.zones[zone as CardZone]?.length ?? 0;
        if (actual !== count) mismatches.push(`${zone}: expected ${count}, got ${actual}`);
      }
      if (mismatches.length === 0) {
        return {
          pass: true,
          message: () => `Expected zone counts NOT to match, but they did`,
        };
      }
      return {
        pass: false,
        message: () =>
          `Zone count mismatch for player "${expected.player}":\n  ${mismatches.join("\n  ")}`,
      };
    },

    toBeActivePlayer(received: unknown, expected: string) {
      if (!isMatchState(received)) {
        return {
          pass: false,
          message: () => `Expected a MatchState, got ${typeof received}`,
        };
      }
      const actual = received.G.turnMetadata.activePlayerId;
      if (actual === expected) {
        return {
          pass: true,
          message: () => `Expected player "${expected}" NOT to be active, but they were`,
        };
      }
      return {
        pass: false,
        message: () => `Expected active player to be "${expected}", but was "${actual}"`,
      };
    },
  });
}

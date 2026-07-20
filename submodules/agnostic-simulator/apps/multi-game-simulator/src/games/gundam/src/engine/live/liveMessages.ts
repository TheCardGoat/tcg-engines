import type { LiveGatewayMessage } from "./liveGateway.ts";
import { getMatchmakingReturnUrl, type LiveMatchView } from "./matchContext.ts";

export type LiveMessageEffect =
  | { type: "ignore" }
  | { type: "state"; view: LiveMatchView }
  | { type: "ended"; view: LiveMatchView }
  | { type: "redirect"; href: string };

interface ReduceOptions {
  readonly matchId: string;
  readonly gameId: string;
  readonly search: string;
}

/**
 * Apply a gateway message to a {@link LiveMatchView}.
 *
 * Branches:
 *   - `state_sync` / `state_update` with a matching gameId → update view
 *   - `game_ended` → mark ended + (eventually) bounce to matchmaking
 *   - `match_state` with `status: completed` → redirect to matchmaking
 *   - anything else → ignore
 */
export function reduceLiveGatewayMessage(
  view: LiveMatchView,
  message: LiveGatewayMessage,
  options: ReduceOptions,
): LiveMessageEffect {
  switch (message.type) {
    case "game_joined":
    case "state_sync":
    case "state_update": {
      if (message.gameId !== options.gameId) return { type: "ignore" };
      const state = isMatchState(message.state) ? message.state : null;
      if (!state) return { type: "ignore" };
      return {
        type: "state",
        view: {
          ...view,
          state,
          version: message.stateVersion ?? view.version,
          animationPackets: appendAnimationPackets(
            view.animationPackets,
            "animations" in message ? message.animations : [],
            message.stateVersion ?? view.version,
            turnNumberOf(state),
          ),
          ...(message.interactionView ? { interactionView: message.interactionView } : {}),
        },
      };
    }
    case "game_ended": {
      if (message.gameId !== options.gameId) return { type: "ignore" };
      return {
        type: "ended",
        view: {
          ...view,
          ended: {
            winnerId: message.winnerId ?? null,
            reason: message.reason ?? null,
          },
        },
      };
    }
    case "match_state": {
      const record = message as Record<string, unknown>;
      const status = typeof record.status === "string" ? record.status : null;
      if (status === "completed" || status === "abandoned") {
        return { type: "redirect", href: getMatchmakingReturnUrl(options.search) };
      }
      return { type: "ignore" };
    }
    default:
      return { type: "ignore" };
  }
}

function appendAnimationPackets(
  existing: LiveMatchView["animationPackets"],
  packets: readonly {
    readonly id: string;
    readonly kind: string;
    readonly durationMs?: number;
    readonly payload: unknown;
  }[],
  stateVersion: number,
  turnNumber: number,
): LiveMatchView["animationPackets"] {
  if (packets.length === 0) return existing;
  const ids = new Set(existing.map(({ packet }) => packet.id));
  const additions = packets
    .filter((packet) => !ids.has(packet.id))
    .map((packet) => ({ packet, stateVersion, turnNumber }));
  return [...existing, ...additions].slice(-256);
}

function turnNumberOf(state: Record<string, unknown>): number {
  const ctx = state.ctx;
  if (!ctx || typeof ctx !== "object") return 0;
  const status = (ctx as { status?: unknown }).status;
  if (!status || typeof status !== "object") return 0;
  const turn = (status as { turn?: unknown }).turn;
  return typeof turn === "number" ? turn : 0;
}

/**
 * Loose check that a payload looks like a Gundam `MatchState` snapshot:
 * the engine snapshot we get from `runtime.getState()` always has a
 * `ctx` field carrying turn / phase / zones, so we use that as the
 * discriminator. We can't reach in for the brand because the wire
 * payload is plain JSON.
 */
function isMatchState(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const maybe = value as { ctx?: unknown };
  return maybe.ctx !== undefined && typeof maybe.ctx === "object";
}

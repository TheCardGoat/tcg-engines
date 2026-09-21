import { isCanonicalEngineMoveLog } from "@tcg/shared/game-engine";
import type { GameLogEntry } from "@tcg/game-page-contract";
import { readGundamPresentation, type GundamPresentation } from "@tcg/gundam-server-adapter";

import type { LiveGatewayMessage } from "./liveGateway.ts";
import type { LiveEngineLogRecord, LiveMatchView } from "./matchContext.ts";
import { parseGundamLiveProjection } from "./liveProjection.ts";

export type LiveMessageEffect =
  | { type: "ignore" }
  | { type: "invalid_state"; reason: string }
  | {
      type: "state";
      view: LiveMatchView;
      /**
       * Set when the state advanced but the message carried no
       * `interactionView`, so the stored view was invalidated. The page
       * should request a fresh `state_sync` to republish it.
       */
      resyncInteractionView?: boolean;
    }
  | { type: "ended"; view: LiveMatchView };

interface ReduceOptions {
  readonly gameId: string;
}

/**
 * Apply a gateway message to a {@link LiveMatchView}.
 *
 * Branches:
 *   - `game_joined` / `state_sync` / `state_update` / `move_accepted`
 *     with a matching gameId → update view
 *   - `game_ended` → mark ended so the post-match overview can remain open
 *   - `match_state` → preserve the current route and overview
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
    case "state_update":
    case "move_accepted": {
      if (message.gameId !== options.gameId) return { type: "ignore" };
      if (message.state === undefined || message.state === null) return { type: "ignore" };
      const state = parseGundamLiveProjection(message.state);
      if (!state) {
        return {
          type: "invalid_state",
          reason: "Live state was not a privacy-filtered Gundam projection.",
        };
      }
      const version = message.stateVersion ?? view.version;
      // Viewer-filtered cards maps arrive with `game_joined` and full
      // `state_sync` replies. A match bootstrapped before any card was
      // visible starts with an empty overlay, so each message that carries
      // refreshed maps must widen the accumulated presentation — otherwise
      // mixed printings revealed mid-match keep rendering as defaults.
      const presentation = mergePresentations(
        view.presentation,
        "cardsMaps" in message
          ? readGundamPresentation({ cardsMaps: message.cardsMaps })
          : undefined,
      );
      // The stored interaction view is only valid for the state version it
      // was published at. A state advance without a fresh view invalidates
      // it — otherwise the UI would offer moves from the new state that
      // the stale view doesn't publish, and submits would fail client-side
      // with "Server did not publish a compatible interaction".
      const publishedView = message.interactionView;
      const storedView =
        publishedView ??
        (view.interactionView?.stateVersion === version ? view.interactionView : undefined);
      return {
        type: "state",
        resyncInteractionView: !publishedView && storedView === undefined,
        view: {
          ...view,
          state,
          version,
          presentation,
          // A state advance without an undoability field must revoke the
          // previous affordance. Otherwise a bot turn can leave the player
          // with a stale Undo button until the next full sync.
          canUndo: message.undoable === true,
          animationPackets: appendAnimationPlans(
            view.animationPackets,
            "animationPlan" in message ? message.animationPlan : null,
            version,
            turnNumberOf(state),
          ),
          engineLogRecords: appendEngineLogRecords(
            view.engineLogRecords,
            "engineLogs" in message ? message.engineLogs : undefined,
          ),
          // `undefined` clears a stale stored view; the conditional spread
          // above cannot remove the key carried in by `...view`.
          interactionView: storedView,
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
    case "game_recent_history": {
      // Join/reconnect replay of recent stored records. Log-only update: the
      // accompanying moves are already reflected in the bootstrap or gateway
      // state, so the view's state and interaction view stay untouched.
      if (message.gameId !== options.gameId) return { type: "ignore" };
      const engineLogRecords = appendEngineLogRecords(view.engineLogRecords, message.engineLogs);
      if (engineLogRecords === view.engineLogRecords) return { type: "ignore" };
      return { type: "state", view: { ...view, engineLogRecords } };
    }
    case "match_state": {
      return { type: "ignore" };
    }
    default:
      return { type: "ignore" };
  }
}

function appendAnimationPlans(
  existing: LiveMatchView["animationPackets"],
  plan: import("@tcg/protocol").AnimationPlanV2 | null,
  stateVersion: number,
  turnNumber: number,
): LiveMatchView["animationPackets"] {
  if (!plan || existing.some((entry) => entry.plan.id === plan.id)) return existing;
  return [...existing, { plan, stateVersion, turnNumber }].slice(-256);
}

/**
 * Union two presentation overlays. Per-instance printings are assigned at
 * match creation and never change, so entries from an earlier viewer-filtered
 * map stay valid when a later message reveals more cards; replacing wholesale
 * could temporarily hide already-revealed entries behind a sparser map.
 */
function mergePresentations(
  previous: GundamPresentation | undefined,
  next: GundamPresentation | undefined,
): GundamPresentation | undefined {
  if (!previous) return next;
  if (!next) return previous;
  const merged: GundamPresentation = {
    printingIdByInstanceId: {
      ...previous.printingIdByInstanceId,
      ...next.printingIdByInstanceId,
    },
  };
  const previousSlots = previous.printingIdBySetupSlotByOwnerId;
  const nextSlots = next.printingIdBySetupSlotByOwnerId;
  if (previousSlots || nextSlots) {
    merged.printingIdBySetupSlotByOwnerId = {
      ...previousSlots,
      ...Object.fromEntries(
        Object.entries(nextSlots ?? {}).map(([ownerId, slots]) => [
          ownerId,
          { ...previousSlots?.[ownerId], ...slots },
        ]),
      ),
    };
  }
  return merged;
}

/**
 * Accumulate viewer-safe engine log records across state messages.
 *
 * The same record can arrive twice with different visibility: the
 * public `state_update` broadcast and the actor-composed `move_accepted`
 * (or takeover reply). Both share the structural dedupe key, so on
 * collision we keep the copy with more visible messages — that's the
 * one composed for this viewer.
 */
function appendEngineLogRecords(
  existing: LiveMatchView["engineLogRecords"],
  candidates: unknown,
): LiveMatchView["engineLogRecords"] {
  if (!Array.isArray(candidates) || candidates.length === 0) return existing;
  const byKey = new Map(existing.map((record) => [engineLogKey(record), record]));
  let changed = false;
  for (const candidate of candidates) {
    const record = parseEngineLogRecord(candidate);
    if (!record) continue;
    const key = engineLogKey(record);
    const prior = byKey.get(key);
    if (prior && prior.log.public.length >= record.log.public.length) continue;
    byKey.set(key, record);
    changed = true;
  }
  if (!changed) return existing;
  return [...byKey.values()].slice(-512);
}

function parseEngineLogRecord(value: unknown): LiveEngineLogRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.stateVersion !== "number" || typeof candidate.timestamp !== "number") {
    return null;
  }
  if (!isCanonicalEngineMoveLog(candidate.log)) return null;
  return {
    stateVersion: candidate.stateVersion,
    timestamp: candidate.timestamp,
    log: candidate.log,
  };
}

/**
 * Rebuild log records from the HTTP bootstrap's `history.engineLogs` so a
 * page refresh restores the battle log without waiting for gateway traffic
 * (the gateway never replays it: `game_joined` and `state_sync` carry no
 * logs, and only FAB/grand-archive consume `game_recent_history`).
 *
 * Bootstrap entries carry the stored record split across `stateVersion`,
 * `ts`, and `data`; entries missing the version (legacy emitters) are
 * skipped rather than fabricated, matching the gateway record shape.
 */
export function engineLogRecordsFromBootstrapHistory(
  entries: readonly GameLogEntry[],
): LiveMatchView["engineLogRecords"] {
  const records: LiveEngineLogRecord[] = [];
  for (const entry of entries) {
    if (typeof entry.stateVersion !== "number" || typeof entry.ts !== "number") continue;
    const record = parseEngineLogRecord({
      stateVersion: entry.stateVersion,
      timestamp: entry.ts,
      log: entry.data,
    });
    if (record) records.push(record);
  }
  return records;
}

function engineLogKey(record: LiveEngineLogRecord): string {
  return [record.stateVersion, record.log.timestamp, record.log.moveType, record.log.playerId].join(
    "|",
  );
}

function turnNumberOf(state: NonNullable<LiveMatchView["state"]>): number {
  return state.status.turn;
}

import type { Draft } from "mutative";
import type { MatchState } from "./types";
import type { CardQueryAPI } from "./card-runtime";
import type {
  CardRuntimeAPI,
  CardRuntimeReadAPI,
  EventAPI,
  FrameworkReadAPI,
  FrameworkStateSnapshot,
  FrameworkWriteAPI,
  ProjectedLogEntry,
  RandomAPI,
  TimeOperationsAPI,
  TimeQueryAPI,
  UndoAPI,
  ZoneOperationsAPI,
  ZoneQueryAPI,
} from "./match-runtime.types";
import type { PlayerId } from "../types";
import type { BaseCardMeta } from "./card-contracts";
import { invalidateStaticEffects } from "../../runtime-moves/rules/static-effects-invalidation";

export function createCardRuntimeAPI(
  draft: Draft<MatchState>,
  cardsApi: CardQueryAPI,
): CardRuntimeAPI {
  return {
    ...cardsApi,
    setMeta: (cardId, meta) => {
      const old = (draft.ctx.zones.private.cardMeta[cardId] ?? {}) as Record<string, unknown>;
      draft.ctx.zones.private.cardMeta[cardId] = meta;

      // Invalidate the static-effect registry when static-ability-relevant meta changes.
      const next = meta as Record<string, unknown>;
      const STATIC_SIMPLE = ["state", "damage", "atLocationId", "isDrying"];
      const allKeys = new Set([...Object.keys(old), ...Object.keys(next)]);
      const changed =
        STATIC_SIMPLE.some((k) => old[k] !== next[k]) ||
        [...allKeys].some((k) => k.startsWith("temporary") && old[k] !== next[k]);
      if (changed) {
        invalidateStaticEffects(draft);
      }
    },
    patchMeta: (cardId, patch) => {
      const current = (draft.ctx.zones.private.cardMeta[cardId] ?? {}) as BaseCardMeta;
      const next = {
        ...(current as Record<string, unknown>),
        ...(patch as Record<string, unknown>),
      } as BaseCardMeta;
      draft.ctx.zones.private.cardMeta[cardId] = next;

      // Invalidate the static-effect registry when meta fields that affect static
      // ability conditions change (ready state, damage, location, or any temporary effect).
      const p = patch as Record<string, unknown>;
      if (
        "state" in p ||
        "damage" in p ||
        "atLocationId" in p ||
        "isDrying" in p ||
        Object.keys(p).some((k) => k.startsWith("temporary"))
      ) {
        invalidateStaticEffects(draft);
      }

      return next;
    },
    clearMeta: (cardId) => {
      const old = (draft.ctx.zones.private.cardMeta[cardId] ?? {}) as Record<string, unknown>;
      delete draft.ctx.zones.private.cardMeta[cardId];

      // Invalidate the static-effect registry if the cleared meta carried any
      // static-ability-relevant fields. Mirrors the key list in setMeta/patchMeta.
      const STATIC_SIMPLE = ["state", "damage", "atLocationId", "isDrying"];
      const carriedStatic =
        STATIC_SIMPLE.some((k) => k in old) ||
        Object.keys(old).some((k) => k.startsWith("temporary"));
      if (carriedStatic) {
        invalidateStaticEffects(draft);
      }
    },
    entriesMeta: () =>
      Object.entries(draft.ctx.zones.private.cardMeta).map(
        ([cardId, meta]) => [cardId, (meta ?? {}) as BaseCardMeta] as const,
      ),
  };
}

export function createFrameworkReadAPI(
  state: FrameworkStateSnapshot,
  zones: ZoneQueryAPI,
  time: TimeQueryAPI,
  cardsApi: CardQueryAPI,
): FrameworkReadAPI {
  return {
    state,
    zones,
    time,
    cards: cardsApi as CardRuntimeReadAPI,
  };
}

export function createFrameworkWriteAPI(
  draft: Draft<MatchState>,
  state: FrameworkStateSnapshot,
  zones: ZoneOperationsAPI,
  time: TimeOperationsAPI,
  random: RandomAPI,
  events: EventAPI,
  undo: UndoAPI,
  cardsApi: CardRuntimeAPI,
  onMoveLog?: (entries: readonly ProjectedLogEntry[]) => void,
): FrameworkWriteAPI {
  return {
    state,
    zones,
    time,
    random,
    events,
    undo,
    cards: cardsApi,
    status: {
      snapshot: draft.ctx.status,
      patch: (patch) => {
        Object.assign(draft.ctx.status, patch);
      },
      setPhase: (phase) => {
        draft.ctx.status.phase = phase;
      },
      setStep: (step) => {
        draft.ctx.status.step = step;
      },
      setGameSegment: (segment) => {
        draft.ctx.status.gameSegment = segment;
      },
      incrementTurn: (by = 1) => {
        draft.ctx.status.turn += by;
        return draft.ctx.status.turn;
      },
    },
    priority: {
      snapshot: draft.ctx.priority,
      patch: (patch) => {
        Object.assign(draft.ctx.priority, patch);
      },
      setHolder: (playerId) => {
        draft.ctx.priority.holder = playerId as string | undefined;
      },
      openWindow: (holder?: PlayerId) => {
        if (holder !== undefined) {
          draft.ctx.priority.holder = holder;
        }
        draft.ctx.priority.windowOpen = true;
      },
      closeWindow: () => {
        draft.ctx.priority.holder = undefined;
        draft.ctx.priority.windowOpen = false;
      },
      resetPasses: () => {
        draft.ctx.priority.passSequence = [];
      },
    },
    log: (entry) => {
      const entries = Array.isArray(entry) ? entry : [entry];
      if (!onMoveLog) {
        return;
      }
      onMoveLog(entries);
    },
    logPublicWithOverrides: (entry) => {
      const overrides = entry.overrides ?? {};
      const projected: ProjectedLogEntry = {
        category: entry.category,
        visibility: {
          mode: "PUBLIC_WITH_OVERRIDES",
          overrides,
        },
        defaultMessage: entry.defaultMessage,
      };
      if (!onMoveLog) {
        return;
      }
      onMoveLog([projected]);
    },
  };
}

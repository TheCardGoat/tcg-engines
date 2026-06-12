import type { CardInstanceId, DeepReadonly, PlayerId } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

import type { CardPlayedPayload, LorcanaG } from "../types";
import type { ActionResolutionInput } from "../runtime-moves/resolution/action-effects/types";
import type { CardRuntimeReadAPI, FrameworkReadAPI } from "../core/runtime";
import {
  getOrBuildMoveRegistry,
  type MoveRegistryCtx,
} from "../runtime-moves/rules/move-registry-cache";
import type { ConditionEvaluationContext, PlayZoneCardTypeCache } from "./condition-evaluator";
import type { StaticEffectRegistry } from "./static-effect-registry";

/**
 * Minimum runtime shape carried by every move/validation/triggered/replacement
 * pipeline. The canonical builder in this file is the only supported way to
 * construct a `ConditionEvaluationContext` from such a runtime.
 *
 * Inline literals are forbidden — see `evaluateCondition` callsites and
 * `rules/condition-evaluator.ts` for how each field flows. Adding a new field
 * to `ConditionEvaluationContext` should require updating only this builder.
 */
export interface ConditionContextRuntime extends MoveRegistryCtx {
  framework: FrameworkReadAPI & MoveRegistryCtx["framework"];
  cards: CardRuntimeReadAPI;
  G: DeepReadonly<LorcanaG>;
}

export interface BuildConditionContextArgs {
  ctx: ConditionContextRuntime;
  playerId: PlayerId;
  sourceCardId?: CardInstanceId;
  zoneTypeCache?: PlayZoneCardTypeCache;
  cardPlayed?: CardPlayedPayload;
  resolutionInput?: ActionResolutionInput;
  /** Override the registry; defaults to `getOrBuildMoveRegistry(ctx)`. */
  registry?: StaticEffectRegistry;
  /** Pass-through for callers that already provide stat overrides. */
  getCardStrengthByInstanceId?: (cardId: CardInstanceId) => number;
  getCardWillpowerByInstanceId?: (cardId: CardInstanceId) => number;
  /** Pass-through for the static-ability evaluation path. */
  disableFilterRegistry?: boolean;
}

/**
 * Canonical builder for `ConditionEvaluationContext` from a runtime ctx.
 *
 * Every callsite that previously hand-rolled a literal must route through here
 * so a forgotten field becomes a compile error rather than a silent wrong-answer.
 * Defaults `registry` via `getOrBuildMoveRegistry(ctx)` so callers cannot omit
 * it accidentally.
 */
export function buildConditionContext(args: BuildConditionContextArgs): ConditionEvaluationContext {
  const {
    ctx,
    playerId,
    sourceCardId,
    zoneTypeCache,
    cardPlayed,
    resolutionInput,
    registry,
    getCardStrengthByInstanceId,
    getCardWillpowerByInstanceId,
    disableFilterRegistry,
  } = args;

  return {
    framework: ctx.framework as unknown as ConditionEvaluationContext["framework"],
    cards: ctx.cards as unknown as ConditionEvaluationContext["cards"],
    G: ctx.G,
    playerId,
    sourceCardId,
    zoneTypeCache,
    cardPlayed,
    resolutionInput,
    registry: registry ?? getOrBuildMoveRegistry(ctx),
    getCardStrengthByInstanceId,
    getCardWillpowerByInstanceId,
    disableFilterRegistry,
  };
}

/**
 * Raw-state shape understood by the `FromMatchState` overload. Permissive on
 * purpose — both the `state.framework.state` shape (move-validation snapshots)
 * and the `state.ctx` shape (continuous-effect read context) flow through here.
 */
type RawCardIndex = Record<
  string,
  { zoneKey?: string; ownerID?: string; controllerID?: string } | undefined
>;
type RawCardMeta = Record<string, Record<string, unknown> | undefined>;
type RawZoneCards = Record<string, readonly string[] | undefined>;
type RawZoneSummaries = Record<string, { count?: number } | undefined>;
type RawPriority = { holder?: string };
type RawStatus = { turn?: number; turnOwnerId?: string; otp?: string };

export interface MatchStateLikeForCondition {
  // Intentionally permissive — callers pass partial/projected G shapes
  // (e.g. continuous-effect read contexts) that don't expose every field.
  // The helper casts to DeepReadonly<LorcanaG> at the boundary; condition
  // evaluators tolerate missing fields via optional-chaining.
  G?: unknown;
  ctx?: {
    priority?: RawPriority;
    status?: RawStatus;
    playerIds?: readonly string[];
    zones?: {
      private?: {
        cardIndex?: RawCardIndex;
        cardMeta?: RawCardMeta;
        zoneCards?: RawZoneCards;
      };
    };
  };
  framework?: {
    state: {
      priority?: RawPriority;
      status?: RawStatus;
      playerIds?: readonly string[];
      _zonesPrivate?: {
        cardIndex?: RawCardIndex;
        cardMeta?: RawCardMeta;
        zoneCards?: RawZoneCards;
      };
    };
  };
  // Flat shape used by `static-ability-utils` (`StaticAbilityState`):
  // priority/status/_zonesPrivate hoisted to the top level, plus public zone
  // summaries that the extended zone-getter falls back on.
  priority?: RawPriority;
  status?: RawStatus;
  playerIds?: readonly string[];
  _zonesPrivate?: {
    cardIndex?: RawCardIndex;
    cardMeta?: RawCardMeta;
    zoneCards?: RawZoneCards;
  };
  _zonesPublic?: {
    zoneSummaries?: RawZoneSummaries;
  };
}

interface NormalizedRawCtx {
  priority?: RawPriority;
  status?: RawStatus;
  playerIds?: readonly string[];
  zonesPrivate?: {
    cardIndex?: RawCardIndex;
    cardMeta?: RawCardMeta;
    zoneCards?: RawZoneCards;
  };
  zonesPublicSummaries?: RawZoneSummaries;
}

function normalizeRawCtx(state: MatchStateLikeForCondition): NormalizedRawCtx {
  if (state.framework?.state.priority) {
    return {
      priority: state.framework.state.priority,
      status: state.framework.state.status,
      playerIds: state.framework.state.playerIds,
      zonesPrivate: state.framework.state._zonesPrivate,
      // framework.state has no public-summaries; the flat shape provides those
      // via _zonesPublic, but framework callers don't need extended getters.
      zonesPublicSummaries: state._zonesPublic?.zoneSummaries,
    };
  }
  if (state.ctx) {
    return {
      priority: state.ctx.priority,
      status: state.ctx.status,
      playerIds: state.ctx.playerIds,
      zonesPrivate: state.ctx.zones?.private,
      zonesPublicSummaries: state._zonesPublic?.zoneSummaries,
    };
  }
  // Flat shape (StaticAbilityState): priority/status/_zonesPrivate at the top.
  return {
    priority: state.priority,
    status: state.status,
    playerIds: state.playerIds,
    zonesPrivate: state._zonesPrivate,
    zonesPublicSummaries: state._zonesPublic?.zoneSummaries,
  };
}

function derivePlayerIdsFromRawCtx(rawCtx: NormalizedRawCtx): PlayerId[] {
  if (rawCtx.playerIds && rawCtx.playerIds.length > 0) {
    return [...rawCtx.playerIds] as PlayerId[];
  }
  const cardIndex = rawCtx.zonesPrivate?.cardIndex ?? {};
  const seen = new Set<string>();
  for (const entry of Object.values(cardIndex)) {
    const ownerId = entry?.ownerID ?? entry?.controllerID;
    if (ownerId) seen.add(ownerId);
  }
  return [...seen] as PlayerId[];
}

export interface BuildConditionContextFromMatchStateArgs {
  state: MatchStateLikeForCondition;
  playerId: PlayerId;
  sourceCardId?: CardInstanceId;
  /** Override the resolved current player; defaults to the priority holder. */
  currentPlayer?: PlayerId;
  /** Override the derived player ids; defaults to `derivePlayerIdsFromRawCtx`. */
  playerIds?: readonly PlayerId[];
  getDefinitionByInstanceId?: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  registry?: StaticEffectRegistry;
  getCardStrengthByInstanceId?: (cardId: CardInstanceId) => number;
  getCardWillpowerByInstanceId?: (cardId: CardInstanceId) => number;
  disableFilterRegistry?: boolean;
  cardPlayed?: CardPlayedPayload;
  resolutionInput?: ActionResolutionInput;
  /**
   * Use the richer 3-tier zone-getter (scoped → global filtered by
   * controllerID OR ownerID → public-summary placeholder) and expose
   * `getCardZone` + `getCardOwner`. Required by the static-ability-evaluation
   * path where conditions may be evaluated against partially-hidden client
   * states. Defaults to false (matches the simpler continuous-effects shim).
   */
  extendedZoneGetters?: boolean;
}

/**
 * Builds a `ConditionEvaluationContext` from a permissive raw-state shape. Used
 * by paths that operate without a `MoveRegistryCtx` runtime (e.g. continuous-effect
 * read-side evaluation). Keeps zone-getter behavior aligned with the original
 * inline literal: scoped key first, with a play-zone fallback to the global
 * zone filtered by `controllerID`.
 *
 * NOTE: this overload intentionally does not match the richer fallback used by
 * `runtime-moves/rules/static-ability-utils.ts` (public-summary fallback,
 * `getCardZone` / `getCardOwner`, owner-OR-controller filter). That site has
 * different invariants (notably `disableFilterRegistry: true`) and stays as a
 * follow-up migration.
 */
export function buildConditionContextFromMatchState(
  args: BuildConditionContextFromMatchStateArgs,
): ConditionEvaluationContext {
  const {
    state,
    playerId,
    sourceCardId,
    currentPlayer,
    playerIds: providedPlayerIds,
    getDefinitionByInstanceId,
    registry,
    getCardStrengthByInstanceId,
    getCardWillpowerByInstanceId,
    disableFilterRegistry,
    cardPlayed,
    resolutionInput,
    extendedZoneGetters,
  } = args;

  const rawCtx = normalizeRawCtx(state);
  const playerIds = providedPlayerIds ?? derivePlayerIdsFromRawCtx(rawCtx);
  const resolvedCurrentPlayer = currentPlayer ?? (rawCtx.priority?.holder as PlayerId | undefined);
  const cardIndex = rawCtx.zonesPrivate?.cardIndex;
  const cardMeta = rawCtx.zonesPrivate?.cardMeta;
  const zoneCards = rawCtx.zonesPrivate?.zoneCards;
  const zoneSummaries = rawCtx.zonesPublicSummaries;

  const definitionLookup = getDefinitionByInstanceId ?? (() => undefined);

  const getCardsExtended = ({
    zone,
    playerId: scopedPlayerId,
  }: {
    zone: string;
    playerId: PlayerId;
  }): readonly CardInstanceId[] => {
    // Tier 1: player-scoped key.
    const scopedKey = `${zone}:${scopedPlayerId}`;
    const scopedCards = zoneCards?.[scopedKey];
    if (scopedCards !== undefined) {
      return scopedCards as CardInstanceId[];
    }

    // Tier 2: global zone, filtered by controllerID OR ownerID.
    const globalCards = zoneCards?.[zone];
    if (globalCards) {
      const ownerFiltered = globalCards.filter(
        (id) =>
          cardIndex?.[id]?.controllerID === scopedPlayerId ||
          cardIndex?.[id]?.ownerID === scopedPlayerId,
      ) as CardInstanceId[];
      if (ownerFiltered.length > 0) {
        return ownerFiltered;
      }
    }

    // Tier 3: public-summary placeholder array (count-only, for hidden zones).
    const summary = zoneSummaries?.[scopedKey];
    if (summary !== undefined) {
      const count = summary?.count ?? 0;
      return Array.from(
        { length: count },
        (_, i) => `__summary_${scopedKey}_${i}` as CardInstanceId,
      );
    }

    return [];
  };

  const getCardsSimple = ({
    zone,
    playerId: scopedPlayerId,
  }: {
    zone: string;
    playerId: PlayerId;
  }): readonly CardInstanceId[] => {
    if (zone === "play") {
      const playerZone = zoneCards?.[`play:${scopedPlayerId}`];
      if (playerZone) return playerZone as CardInstanceId[];

      const globalPlay = zoneCards?.play;
      if (globalPlay) {
        return globalPlay.filter(
          (id) => cardIndex?.[id]?.controllerID === scopedPlayerId,
        ) as CardInstanceId[];
      }
      return [];
    }
    return (zoneCards?.[`${zone}:${scopedPlayerId}`] ?? []) as CardInstanceId[];
  };

  const zonesShim = extendedZoneGetters
    ? {
        getCards: getCardsExtended,
        getCardZone: (cardId: CardInstanceId) => cardIndex?.[cardId]?.zoneKey,
        getCardOwner: (cardId: string) => cardIndex?.[cardId]?.ownerID,
      }
    : { getCards: getCardsSimple };

  return {
    framework: {
      state: {
        priority: rawCtx.priority as ConditionEvaluationContext["framework"]["state"]["priority"],
        status: rawCtx.status as ConditionEvaluationContext["framework"]["state"]["status"],
        _zonesPrivate:
          rawCtx.zonesPrivate as ConditionEvaluationContext["framework"]["state"]["_zonesPrivate"],
        currentPlayer: resolvedCurrentPlayer,
        playerIds,
      },
      zones: zonesShim as ConditionEvaluationContext["framework"]["zones"],
    },
    cards: {
      getDefinition: definitionLookup,
      require: (cardId) => ({
        meta: cardMeta?.[cardId] ?? {},
      }),
      get: (cardId) => ({
        definition: definitionLookup(cardId),
      }),
    },
    G: state.G as DeepReadonly<LorcanaG>,
    playerId,
    sourceCardId,
    getCardStrengthByInstanceId,
    getCardWillpowerByInstanceId,
    disableFilterRegistry,
    cardPlayed,
    resolutionInput,
    registry,
  };
}

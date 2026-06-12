/**
 * View Filter — Removes information a player shouldn't see based on zone
 * visibility rules and active reveals.
 */

import type { Card } from "@tcg/gundam-types";
import type { BaseCardMeta } from "../types/base-card.ts";
import type { MatchState } from "../types/match-state.ts";
import type { ZoneConfig, ZoneRuntimeState, ZoneVisibility } from "../types/zone-types.ts";
import type {
  ViewRoleContext,
  FilteredMatchView,
  FilteredZoneView,
  FilteredZoneData,
  FilteredCardView,
  ProjectedTimerView,
} from "../types/projection.ts";
// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Determine the base zone id from a zone key.
 * "hand:player1" -> "hand", "battlefield" -> "battlefield"
 */
function baseZoneId(key: string): string {
  const idx = key.indexOf(":");
  return idx === -1 ? key : key.substring(0, idx);
}

/**
 * Extract player id from a scoped zone key, if present.
 * "hand:player1" -> "player1", "battlefield" -> undefined
 */
function zoneKeyPlayerId(key: string): string | undefined {
  const idx = key.indexOf(":");
  return idx === -1 ? undefined : key.substring(idx + 1);
}

/**
 * Check if a card is revealed to a specific viewer via active reveals.
 */
function isCardRevealedTo(
  zones: ZoneRuntimeState,
  cardId: string,
  viewerId: string | undefined,
): boolean {
  for (const reveal of Object.values(zones.reveals.active)) {
    if (!reveal.cardIds.includes(cardId)) continue;

    if (reveal.visibleTo === "all") return true;
    if (viewerId && reveal.visibleTo.includes(viewerId)) return true;
  }
  return false;
}

/**
 * Build a visible card view (face-up, identity known).
 */
function makeVisibleCard(
  instanceId: string,
  definition: Card | undefined,
  definitionId: string | undefined,
  meta: BaseCardMeta | undefined,
  ownerId: string,
  controllerId: string,
  zoneId: string,
): FilteredCardView {
  return {
    instanceId,
    definition: definition ?? null,
    definitionId: definitionId ?? null,
    meta: meta ?? null,
    ownerId,
    controllerId,
    faceDown: false,
    zoneId,
  };
}

/**
 * Build a hidden card view (face-down, identity unknown).
 */
function makeHiddenCard(
  instanceId: string,
  ownerId: string,
  controllerId: string,
  zoneId: string,
): FilteredCardView {
  return {
    instanceId,
    definition: null,
    definitionId: null,
    meta: null,
    ownerId,
    controllerId,
    faceDown: true,
    zoneId,
  };
}

// ── Card definition resolver ───────────────────────────────────────────────

/**
 * Simple interface for looking up card definitions during view filtering.
 * Extracted to avoid a hard dependency on CardsMaps at this layer.
 */
interface CardDefLookup {
  getDefinitionId(instanceId: string): string | undefined;
  getDefinition(definitionId: string): Card | undefined;
}

// ── Main filter function ───────────────────────────────────────────────────

/**
 * Filter a full MatchState into a FilteredMatchView for a specific viewer.
 *
 * Visibility rules:
 * - "public" zones: all card data visible to everyone
 * - "private" zones (e.g., hand): only visible to the owning player
 * - "secret" zones (e.g., deck): card identities hidden from everyone
 *
 * Active reveals override hidden status: if a card has an active reveal
 * visible to this player, its identity is shown.
 *
 * @param state - The full match state
 * @param roleCtx - The viewer's role and optional player id
 * @param zoneConfigs - Zone configuration definitions keyed by zone id
 * @param cardDefLookup - Optional lookup for card definitions; when omitted,
 *   visible cards will have null definitions.
 */
export function filterMatchView<G extends object = object>(
  state: MatchState<G>,
  roleCtx: ViewRoleContext,
  zoneConfigs: Record<string, ZoneConfig>,
  cardDefLookup?: CardDefLookup,
): FilteredMatchView<G> {
  const zones = state.ctx.zones;
  const viewerId = roleCtx.playerId as string | undefined;
  const filteredZones = filterZones(zones, viewerId, zoneConfigs, cardDefLookup);

  return {
    G: state.G,
    stateID: state.ctx._stateID,
    status: state.ctx.status,
    zones: filteredZones,
    players: state.ctx.playerIds.map((pid) => ({
      playerId: pid,
      publicData: {},
    })),
    availableMoves: [],
    myPlayerId: roleCtx.playerId,
    timerView: projectTimerView(state, Date.now()),
  };
}

export function projectTimerView<G extends object>(
  state: MatchState<G>,
  serverTimestamp: number,
): ProjectedTimerView {
  const time = state.ctx.time;
  if (time.mode === "none") {
    return { serverTimestamp };
  }

  const hasDecisionCap = time.mode === "chess" || time.mode === "dynamic";
  const maxDecisionTimeMs = hasDecisionCap ? time.config.maxDecisionTimeMs : undefined;
  const activePlayerAccumulatedMs = hasDecisionCap
    ? (time.activePlayerAccumulatedMs ?? 0)
    : undefined;
  const players: ProjectedTimerView["players"] = {};

  for (const playerId of state.ctx.playerIds) {
    const id = String(playerId);
    const playerState = time.players[id];
    const isRunning = time.running && time.activePlayerID === id;

    players[id] = {
      reserveMsRemaining: playerState?.reserveMsRemaining ?? 0,
      isRunning,
      startedAtMs: isRunning ? time.startedAtMs : undefined,
      timeoutCount: playerState && "timeoutCount" in playerState ? playerState.timeoutCount : 0,
      isInNegativeTime:
        playerState && "isInNegativeTime" in playerState ? playerState.isInNegativeTime : false,
      activePlayerAccumulatedMs: isRunning ? activePlayerAccumulatedMs : undefined,
      maxDecisionTimeMs: isRunning ? maxDecisionTimeMs : undefined,
    };
  }

  return { serverTimestamp, players };
}

// ── Zone filtering ─────────────────────────────────────────────────────────

function filterZones(
  zones: ZoneRuntimeState,
  viewerId: string | undefined,
  zoneConfigs: Record<string, ZoneConfig>,
  cardDefLookup?: CardDefLookup,
): FilteredZoneView {
  const result: Record<string, FilteredZoneData> = {};

  for (const [zoneKey, cardIds] of Object.entries(zones.private.zoneCards)) {
    const baseId = baseZoneId(zoneKey);
    const config = zoneConfigs[baseId];
    if (!config) continue;

    const visibility = config.visibility;
    const zoneOwner = zoneKeyPlayerId(zoneKey);

    const cards = filterCardsForZone(
      zones,
      cardIds,
      zoneKey,
      visibility,
      zoneOwner,
      viewerId,
      config.faceDown ?? false,
      cardDefLookup,
    );

    const summary = zones.public.zoneSummaries[zoneKey];

    result[zoneKey] = {
      count: cardIds.length,
      cards,
      topCardId: summary?.topPublicCardID,
    };
  }

  return { zones: result };
}

function filterCardsForZone(
  zones: ZoneRuntimeState,
  cardIds: string[],
  zoneKey: string,
  visibility: ZoneVisibility,
  zoneOwner: string | undefined,
  viewerId: string | undefined,
  zoneFaceDown: boolean,
  cardDefLookup?: CardDefLookup,
): FilteredCardView[] {
  return cardIds.map((cardId) => {
    const indexEntry = zones.private.cardIndex[cardId];
    const ownerId = indexEntry?.ownerID ?? ("" as string);
    const controllerId = indexEntry?.controllerID ?? ("" as string);

    // Determine if the viewer can see this card's identity
    const canSee = canViewerSeeCard(visibility, zoneOwner, viewerId, zones, cardId);

    if (!canSee || zoneFaceDown) {
      // Even face-down cards can be revealed
      if (isCardRevealedTo(zones, cardId, viewerId)) {
        return resolveVisibleCard(cardId, ownerId, controllerId, zoneKey, zones, cardDefLookup);
      }
      return makeHiddenCard(cardId, ownerId, controllerId, zoneKey);
    }

    return resolveVisibleCard(cardId, ownerId, controllerId, zoneKey, zones, cardDefLookup);
  });
}

/**
 * Determine whether a viewer can see a card's identity based on zone visibility.
 */
function canViewerSeeCard(
  visibility: ZoneVisibility,
  zoneOwner: string | undefined,
  viewerId: string | undefined,
  zones: ZoneRuntimeState,
  cardId: string,
): boolean {
  switch (visibility) {
    case "public":
      // Everyone can see public zone cards
      return true;

    case "private":
      // Only the zone owner can see private zone cards
      return viewerId !== undefined && viewerId === zoneOwner;

    case "secret":
      // Nobody can see secret zone cards by default (must be revealed)
      // Check reveals as a fallback
      return isCardRevealedTo(zones, cardId, viewerId);

    default:
      return false;
  }
}

/**
 * Build a visible card view, resolving definition if a lookup is provided.
 */
function resolveVisibleCard(
  cardId: string,
  ownerId: string,
  controllerId: string,
  zoneKey: string,
  zones: ZoneRuntimeState,
  cardDefLookup?: CardDefLookup,
): FilteredCardView {
  const meta = zones.private.cardMeta[cardId] ?? null;
  let definition: Card | undefined;
  let definitionId: string | undefined;

  if (cardDefLookup) {
    definitionId = cardDefLookup.getDefinitionId(cardId);
    if (definitionId) {
      definition = cardDefLookup.getDefinition(definitionId);
    }
  }

  return makeVisibleCard(cardId, definition, definitionId, meta, ownerId, controllerId, zoneKey);
}

/**
 * View Filter - Role-Based State Filtering
 *
 * Implements VIEW_FILTERING.md from PLAN.md
 *
 * Server-side filtering of MatchState before transmission to clients.
 * Filtering is not a UI convention - it is a runtime guarantee.
 */

import type {
  MatchState,
  TCGCtx,
  ZoneRuntimeState,
  FilteredMatchView,
  FilteredTCGCtx,
  ViewRoleContext,
  Role,
  ZoneRevealWindow,
} from "./types";
import type { ZoneRegistry } from "./zone-registry";

// =============================================================================
// Main Filter Entry Point
// =============================================================================

/**
 * Filter match state based on role and player ID
 *
 * This is the core filtering function that ensures hidden information
 * is never leaked to unauthorized clients.
 */
export function filterMatchView(
  state: MatchState,
  roleCtx: ViewRoleContext,
  zoneRegistry: ZoneRegistry,
): FilteredMatchView {
  const { role, playerID } = roleCtx;

  // Filter ctx based on role
  const filteredCtx: FilteredTCGCtx = {
    ...state.ctx,
    zones: filterZones(state.ctx.zones, zoneRegistry, role, playerID),
    random: filterRandom(state.ctx.random),
    // Server-only fields are removed or sanitized
  };

  // Filter G based on game-specific playerView if provided
  let filteredG = state.G;

  return {
    G: filteredG,
    ctx: filteredCtx,
  };
}

// =============================================================================
// Zone Filtering
// =============================================================================

function filterZones(
  zones: ZoneRuntimeState,
  zoneRegistry: ZoneRegistry,
  role: Role,
  playerID?: string,
): FilteredTCGCtx["zones"] {
  const filteredPublic = { ...zones.public };
  const filteredReveals = filterReveals(zones.reveals.active, role, playerID);

  // Spectators never see private zone contents
  // Players start with public zone cards visible to them
  let filteredPrivate: ZoneRuntimeState["private"] =
    role === "player"
      ? filterPublicZoneCards(zones, zoneRegistry)
      : { zoneCards: {}, cardIndex: {}, cardMeta: {} };

  if (role === "judge") {
    // Judge sees all (subject to match policy)
    filteredPrivate = zones.private;
  } else if (role === "player" && playerID) {
    // Player sees their own private zones
    filteredPrivate = mergePrivateViews(
      filteredPrivate,
      filterPrivateZonesForPlayer(zones, zoneRegistry, playerID),
    );
  }
  // Spectators never see private zone contents

  // Add revealed card index/meta for visible reveal windows.
  addVisibleReveals(filteredPrivate, zones, filteredReveals);

  return {
    public: filteredPublic,
    private: filteredPrivate,
    reveals: {
      active: filteredReveals,
    },
  };
}

/**
 * Filter private zones for a player
 *
 * Player can see:
 * - Their own private zones (hand, etc.)
 * - Public zones
 * - Secret zones (counts only)
 * - Reveals visible to them
 */
function filterPrivateZonesForPlayer(
  zones: ZoneRuntimeState,
  zoneRegistry: ZoneRegistry,
  playerID: string,
): ZoneRuntimeState["private"] {
  const filteredZoneCards: Record<string, string[]> = {};
  const filteredCardIndex: ZoneRuntimeState["private"]["cardIndex"] = {};
  const filteredCardMeta: ZoneRuntimeState["private"]["cardMeta"] = {};

  for (const [zoneId, cardIds] of Object.entries(zones.private.zoneCards)) {
    const zoneDef = zoneRegistry[zoneId];
    if (!zoneDef) continue;

    if (zoneDef.visibility === "public") {
      // Public zones: all cards visible
      filteredZoneCards[zoneId] = cardIds;
      for (const cardId of cardIds) {
        const indexEntry = zones.private.cardIndex[cardId];
        if (indexEntry) {
          filteredCardIndex[cardId] = indexEntry;
        }
        if (zones.private.cardMeta[cardId]) {
          filteredCardMeta[cardId] = zones.private.cardMeta[cardId];
        }
      }
    } else if (zoneDef.visibility === "private") {
      // Private zones: only owner can see cards.
      // Keep owner-scoped zones with an empty array so patch adds/removals target
      // a stable path on the client side.
      const ownerID = zoneDef.ownerScoped ? zoneId.split(":", 2)[1] : undefined;
      const isOwnerZone = !zoneDef.ownerScoped || !ownerID || ownerID === playerID;
      if (!isOwnerZone) {
        continue;
      }

      const visibleCards = cardIds.filter((cardId) => {
        const indexEntry = zones.private.cardIndex[cardId];
        return indexEntry && indexEntry.ownerID === playerID;
      });

      filteredZoneCards[zoneId] = visibleCards;
      for (const cardId of visibleCards) {
        const indexEntry = zones.private.cardIndex[cardId];
        if (indexEntry) {
          filteredCardIndex[cardId] = indexEntry;
        }
        if (zones.private.cardMeta[cardId]) {
          filteredCardMeta[cardId] = zones.private.cardMeta[cardId];
        }
      }
    } else if (zoneDef.visibility === "secret" && zoneDef.ownerScoped) {
      const ownerID = zoneId.split(":", 2)[1];
      if (ownerID === playerID) {
        // Owner-scoped secret zones are still hidden, but we keep an empty
        // array so patch operations have a resolvable container, while retaining
        // card index entries so owner-facing clients can keep authoritative order.
        filteredZoneCards[zoneId] = [];
        for (const cardId of cardIds) {
          const indexEntry = zones.private.cardIndex[cardId];
          if (indexEntry) {
            filteredCardIndex[cardId] = indexEntry;
          }
          if (zones.private.cardMeta[cardId]) {
            filteredCardMeta[cardId] = zones.private.cardMeta[cardId];
          }
        }
      }
    }
  }

  return {
    zoneCards: filteredZoneCards,
    cardIndex: filteredCardIndex,
    cardMeta: filteredCardMeta,
  };
}

function filterPublicZoneCards(
  zones: ZoneRuntimeState,
  zoneRegistry: ZoneRegistry,
): ZoneRuntimeState["private"] {
  const filteredZoneCards: Record<string, string[]> = {};
  const filteredCardIndex: ZoneRuntimeState["private"]["cardIndex"] = {};
  const filteredCardMeta: ZoneRuntimeState["private"]["cardMeta"] = {};

  for (const [zoneId, cardIds] of Object.entries(zones.private.zoneCards)) {
    const zoneDef = zoneRegistry[zoneId];
    if (!zoneDef || zoneDef.visibility !== "public") {
      continue;
    }

    filteredZoneCards[zoneId] = [...cardIds];
    for (const cardId of cardIds) {
      const indexEntry = zones.private.cardIndex[cardId];
      if (indexEntry) {
        filteredCardIndex[cardId] = indexEntry;
      }
      if (zones.private.cardMeta[cardId]) {
        filteredCardMeta[cardId] = zones.private.cardMeta[cardId];
      }
    }
  }

  return {
    zoneCards: filteredZoneCards,
    cardIndex: filteredCardIndex,
    cardMeta: filteredCardMeta,
  };
}

function mergePrivateViews(
  base: ZoneRuntimeState["private"],
  extra: ZoneRuntimeState["private"],
): ZoneRuntimeState["private"] {
  return {
    zoneCards: { ...base.zoneCards, ...extra.zoneCards },
    cardIndex: { ...base.cardIndex, ...extra.cardIndex },
    cardMeta: { ...base.cardMeta, ...extra.cardMeta },
  };
}

function addVisibleReveals(
  target: ZoneRuntimeState["private"],
  zones: ZoneRuntimeState,
  reveals: ZoneRevealWindow[],
): void {
  for (const reveal of reveals) {
    for (const cardId of reveal.cardIDs) {
      const indexEntry = zones.private.cardIndex[cardId];
      if (indexEntry && !(cardId in target.cardIndex)) {
        target.cardIndex[cardId] = indexEntry;
      }
      if (zones.private.cardMeta[cardId] && !(cardId in target.cardMeta)) {
        target.cardMeta[cardId] = zones.private.cardMeta[cardId];
      }
    }
  }
}

/**
 * Filter reveals based on visibility
 */
function filterReveals(
  reveals: ZoneRevealWindow[],
  role: Role,
  playerID?: string,
): ZoneRevealWindow[] {
  return reveals.filter((reveal) => {
    if (reveal.visibleTo === "all") {
      return true;
    }
    if (role === "judge") {
      return true;
    }
    if (role === "player" && playerID && reveal.visibleTo.includes(playerID)) {
      return true;
    }
    return false;
  });
}

// =============================================================================
// Random State Filtering
// =============================================================================

function filterRandom(random: TCGCtx["random"]): TCGCtx["random"] {
  // Remove server-private RNG state
  return {
    seed: random.seed,
    draws: random.draws,
    state: null, // Server-only, never transmitted
  };
}

// =============================================================================
// Public Zone Summaries
// =============================================================================

/**
 * Get public-safe zone summary
 *
 * Returns counts and safe metadata without leaking secret info.
 */
export function getPublicZoneSummary(
  zones: ZoneRuntimeState,
  zoneRegistry: ZoneRegistry,
  zoneId: string,
): {
  count: number;
  revision: number;
  topCardID?: string;
} {
  const zoneDef = zoneRegistry[zoneId];
  const summary = zones.public.zoneSummaries[zoneId];

  if (!zoneDef || !summary) {
    return { count: 0, revision: 0 };
  }

  // For public zones, top card may be visible
  // Use the topPublicCardID from the summary if available
  let topCardID: string | undefined = summary.topPublicCardID;

  return {
    count: summary.count,
    revision: summary.revision,
    topCardID,
  };
}

// =============================================================================
// Patch Filtering
// =============================================================================

function normalizePatchPath(path: unknown): string[] | null {
  if (path == null) {
    return null;
  }

  if (Array.isArray(path)) {
    const normalizedSegments: string[] = [];
    for (const segment of path) {
      if (typeof segment === "number" || typeof segment === "string") {
        normalizedSegments.push(String(segment));
        continue;
      }
      return null;
    }
    return normalizedSegments;
  }

  if (typeof path !== "string") {
    return null;
  }

  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function isRngPath(pointerSegments: string[]): boolean {
  return (
    pointerSegments.length >= 2 &&
    pointerSegments[0] === "ctx" &&
    pointerSegments[1] === "random" &&
    pointerSegments[2] === "state"
  );
}

function isCardVisibleViaReveal(
  state: MatchState,
  cardId: string,
  roleCtx: ViewRoleContext,
): boolean {
  if (roleCtx.role === "judge") {
    return true;
  }

  const visibleReveals = filterReveals(
    state.ctx.zones.reveals.active,
    roleCtx.role,
    roleCtx.playerID,
  );
  return visibleReveals.some((reveal) => reveal.cardIDs.includes(cardId));
}

function getZoneCardIdFromPatch(
  state: MatchState,
  patch: unknown,
  pointerSegments: string[],
): string | undefined {
  const zoneKey = pointerSegments[4];
  const cardIndexOrToken = pointerSegments[5];
  if (!zoneKey || !cardIndexOrToken) {
    return undefined;
  }

  const op = (patch as { op?: unknown })?.op;
  const value = (patch as { value?: unknown })?.value;
  if ((op === "add" || op === "replace") && typeof value === "string") {
    return value;
  }

  const index = Number(cardIndexOrToken);
  if (!Number.isInteger(index) || index < 0) {
    return undefined;
  }

  const cards = state.ctx.zones.private.zoneCards[zoneKey];
  const existingCardId = Array.isArray(cards) ? cards[index] : undefined;
  return typeof existingCardId === "string" ? existingCardId : undefined;
}

function canViewPrivatePatch(
  patch: unknown,
  pointerSegments: string[],
  state: MatchState,
  roleCtx: ViewRoleContext,
  zoneRegistry: ZoneRegistry,
): boolean {
  const { role, playerID } = roleCtx;

  // /ctx/zones/private/zoneCards/{zoneId}/...
  // /ctx/zones/private/cardIndex/{cardId}/...
  // /ctx/zones/private/cardMeta/{cardId}/...
  const collection = pointerSegments[3];

  if (collection === "zoneCards") {
    const zoneKey = pointerSegments[4];
    if (!zoneKey) {
      return false;
    }

    const zoneDef = zoneRegistry[zoneKey];
    if (!zoneDef) {
      return false;
    }

    if (zoneDef.visibility === "secret") {
      return role === "judge";
    }

    if (zoneDef.visibility === "private") {
      if (role === "spectator") {
        return false;
      }

      if (zoneDef.ownerScoped) {
        if (role !== "player" || !playerID) {
          return false;
        }

        const ownerID = zoneKey.split(":", 2)[1];
        if (ownerID === playerID) {
          return true;
        }

        const op = (patch as { op?: unknown })?.op;
        if (op === "remove") {
          return true;
        }

        // Allow revealed-card writes/removals in opponent private zones.
        const revealedCardId = getZoneCardIdFromPatch(state, patch, pointerSegments);
        if (revealedCardId) {
          return isCardVisibleViaReveal(state, revealedCardId, roleCtx);
        }

        return false;
      }

      return true;
    }

    return true;
  }

  if (collection === "cardIndex" || collection === "cardMeta") {
    const cardId = pointerSegments[4];
    if (!cardId) {
      return false;
    }

    const indexEntry = state.ctx.zones.private.cardIndex[cardId];
    if (!indexEntry) {
      return role === "judge";
    }

    const zoneDef = zoneRegistry[indexEntry.zoneKey];
    if (!zoneDef) {
      return role === "judge";
    }

    if (zoneDef.visibility === "secret") {
      return role === "judge";
    }

    if (zoneDef.visibility === "private") {
      if (role === "spectator") {
        return false;
      }

      if (zoneDef.ownerScoped) {
        if (role !== "player" || !playerID) {
          return false;
        }

        return indexEntry.ownerID === playerID || isCardVisibleViaReveal(state, cardId, roleCtx);
      }

      return true;
    }

    return true;
  }

  return role === "judge";
}

// =============================================================================
// Testable Invariants
// =============================================================================

/**
 * Verify that no secret information is leaked in filtered state
 *
 * These invariants should be tested to ensure filtering correctness.
 */
export function verifyNoSecretLeakage(
  originalState: MatchState,
  filteredState: FilteredMatchView,
  roleCtx: ViewRoleContext,
  zoneRegistry: ZoneRegistry,
): { valid: true } | { valid: false; violations: string[] } {
  const violations: string[] = [];
  const { role, playerID } = roleCtx;

  // Check 1: Opponent hand card IDs should not appear
  if (role === "player" && playerID) {
    for (const [zoneId, zoneDef] of Object.entries(zoneRegistry)) {
      if (zoneDef.visibility === "private" && zoneDef.ownerScoped) {
        const originalCards = originalState.ctx.zones.private.zoneCards[zoneId] || [];
        const opponentCards = originalCards.filter((cardId) => {
          const index = originalState.ctx.zones.private.cardIndex[cardId];
          return index && index.ownerID !== playerID;
        });
        const visibleReveals = filterReveals(
          originalState.ctx.zones.reveals.active,
          roleCtx.role,
          roleCtx.playerID,
        );
        const revealVisibleCardIds = new Set(visibleReveals.flatMap((reveal) => reveal.cardIDs));

        // Check that opponent cards are not in filtered state
        const filteredCards =
          (filteredState.ctx.zones as ZoneRuntimeState).private?.zoneCards[zoneId] || [];
        for (const cardId of opponentCards) {
          if (filteredCards.includes(cardId) && !revealVisibleCardIds.has(cardId)) {
            violations.push(`Opponent card ${cardId} leaked in zone ${zoneId}`);
          }
        }
      }
    }
  }

  // Check 2: Secret deck order should not appear
  for (const [zoneId, zoneDef] of Object.entries(zoneRegistry)) {
    if (zoneDef.visibility === "secret") {
      const filteredCards = (filteredState.ctx.zones as ZoneRuntimeState).private?.zoneCards[
        zoneId
      ];
      if (filteredCards && filteredCards.length > 0) {
        violations.push(`Secret zone ${zoneId} contents leaked`);
      }
    }
  }

  // Check 3: RNG state should not appear
  if ((filteredState.ctx as TCGCtx).random.state !== null) {
    violations.push("RNG state leaked in filtered view");
  }

  return violations.length === 0 ? { valid: true } : { valid: false, violations };
}

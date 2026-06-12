/**
 * TargetDSL — Evaluates TargetFilter and EffectCondition from card definitions
 * against live game state. Read-optimized: designed for fast repeated evaluation,
 * pre-computation, and UI target enumeration.
 */

import type {
  AttributeFilter,
  CardColor,
  CardType,
  EffectCondition,
  KeywordEffect,
  SourceStatRef,
  TargetFilter,
  TargetOwner,
  Zone,
} from "@tcg/gundam-types";

import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { RuntimeCard } from "../types/base-card.ts";
import type { DeepReadonly } from "../types/move-types.ts";

// ── Context ──────────────────────────────────────────────────────────────────

/**
 * Minimal game-state snapshot needed by the evaluator.
 * Intentionally kept narrow so callers can provide a lightweight facade
 * rather than the full game state object.
 */
export interface TargetResolutionContext {
  /** Player who controls the card/effect being evaluated */
  sourcePlayerId: PlayerId;
  /** The card instance that owns the effect being evaluated */
  sourceCardId: CardInstanceId;
  /** The card instance that caused the current triggering event, when any. */
  eventSourceCardId?: CardInstanceId;
  /**
   * The card instance that `owner: "self"` target filters should resolve
   * against. For unit / base / command / resource sources this is the same
   * as `sourceCardId`. For pilot sources it is the *paired unit's*
   * instance id — rule 3-3-9-1: text printed on a pilot card belongs to
   * the pilot, but "this Unit" in that text refers to the paired unit.
   * When no paired unit exists (pilot not yet paired, or source is not a
   * pilot), this falls back to `sourceCardId`.
   */
  selfIdentityCardId: CardInstanceId;
  /** Opponent of the source player */
  opponentPlayerId: PlayerId;

  // ── Card accessors ──

  /** Return all cards currently in the given zone for a player */
  getCardsInZone(playerId: PlayerId, zone: Zone): readonly RuntimeCard[];
  /** Look up a single card by instance id */
  getCardById(id: CardInstanceId): RuntimeCard | undefined;

  // ── Game state for condition evaluation ──

  /** Whose turn is it? */
  activePlayerId: PlayerId;
  /** Current player's resource level */
  getPlayerLevel(playerId: PlayerId): number;
  /** Number of cards in a player's hand */
  getHandCount(playerId: PlayerId): number;
  /** Card ids deployed during the current turn. */
  deployedThisTurnIds?: ReadonlySet<CardInstanceId>;

  // ── Extended card metadata accessors ──
  // RuntimeCard.meta is a loose bag; these helpers let the DSL read
  // well-known card properties without coupling to concrete meta shapes.

  /** Card color(s), e.g. "Blue" */
  getCardColor(card: RuntimeCard): CardColor | undefined;
  /** Card type: "unit", "pilot", etc. */
  getCardType(card: RuntimeCard): CardType;
  /** Numeric AP (attack power), or undefined for non-unit cards */
  getCardAP(card: RuntimeCard): number | undefined;
  /** Numeric HP (hit points), or undefined for cards without HP */
  getCardHP(card: RuntimeCard): number | undefined;
  /**
   * Current remaining HP after damage counters, when available. Falls back
   * callers should use printed/effective HP from getCardHP.
   */
  getCardRemainingHP?(card: RuntimeCard): number | undefined;
  /** The printed cost of the card */
  getCardCost(card: RuntimeCard): number;
  /** The card's level requirement */
  getCardLevel(card: RuntimeCard): number;
  /** Trait array (e.g. ["Earth Federation", "White Base Team"]) */
  getCardTraits(card: RuntimeCard): readonly string[];
  /** Card name (primary) */
  getCardName(card: RuntimeCard): string;
  /** Keyword effects the card currently has (base + granted) */
  getCardKeywords(card: RuntimeCard): readonly KeywordEffect[];
  /** Activation timings printed on the card's executable effects. */
  getCardEffectTimings?(card: RuntimeCard): readonly string[];
  /** Zone the card is currently in */
  getCardZone(card: RuntimeCard): Zone;

  // ── Unit state ──

  /** Whether a unit is in "rested" state */
  isRested(card: RuntimeCard): boolean;
  /** Whether a unit is in "active" (standing) state */
  isActive(card: RuntimeCard): boolean;
  /** Whether a unit is currently damaged (HP < max HP) */
  isDamaged(card: RuntimeCard): boolean;
  /** Whether a unit is currently in a linked state */
  isLinked(card: RuntimeCard): boolean;
  /** Whether a unit is currently paired with a pilot */
  isPaired(card: RuntimeCard): boolean;
  /**
   * Return the instance id of the Pilot card paired with a Unit, or
   * `undefined` if the unit is not paired (or the card isn't a unit).
   * Used by the `pairedPilotTrait` AttributeFilter to fetch the pilot's
   * traits without exposing `pilotAssignments` to the DSL layer.
   */
  getPairedPilotId(card: RuntimeCard): CardInstanceId | undefined;
  /** Whether a unit is currently attacking */
  isAttacking(card: RuntimeCard): boolean;
  /** Whether a card is a token */
  isToken(card: RuntimeCard): boolean;

  // ── Battle context (optional, for attack-phase conditions) ──

  /** True when an enemy link unit was destroyed during the current attack */
  enemyLinkUnitDestroyedDuringAttack?: boolean;

  /**
   * Set of card instance ids currently participating in combat — populated
   * from `g.turnMetadata.pendingCombat`. Contains the attacker and, for
   * unit-vs-unit attacks, the defending unit. On direct attacks
   * (`pendingCombat.target === "direct"`) the defender is the opposing
   * player rather than a card, but the set additionally includes the
   * defender's baseSection card(s) (when present) or shieldArea cards
   * (otherwise) — mirroring rule 8-5-2-1's damage routing so card text
   * like "enemy Base/enemy Shield this Unit is battling" can resolve.
   * Omitted or empty when no combat is in progress. Consumed by the
   * `TargetFilter.isBattling` predicate.
   */
  currentBattleParticipantIds?: ReadonlySet<CardInstanceId>;

  /**
   * Per-card opponents in the current attack. For each combatant id, the
   * value is the set of card ids it is battling (always size 1 for
   * unit-vs-unit; may have multiple entries for direct attacks routed at
   * multi-base / multi-shield defenders). Consumed by
   * `TargetFilter.isBattling = { opponentMatches: <sub> }` to match cards
   * whose current opponent satisfies a sub-filter ("battling a Unit with
   * <Blocker>", "battling an enemy Lv.2 or lower Unit", etc.).
   */
  battleOpponents?: ReadonlyMap<CardInstanceId, readonly CardInstanceId[]>;

  /**
   * True when `pendingCombat.target === "direct"` — the current attack
   * targets the opposing player rather than a unit. Used by the
   * `isAttackingPlayer` condition.
   */
  isDirectAttack?: boolean;
}

// ── Owner Resolution ─────────────────────────────────────────────────────────

function resolveOwner(
  owner: DeepReadonly<TargetOwner>,
  ctx: TargetResolutionContext,
): PlayerId | "any" | "self" {
  switch (owner) {
    case "friendly":
      return ctx.sourcePlayerId;
    case "opponent":
      return ctx.opponentPlayerId;
    case "self":
      return "self";
    case "any":
      return "any";
  }
}

// ── Comparison Helper ────────────────────────────────────────────────────────

function compare(
  actual: number,
  comparison: "eq" | "lt" | "lte" | "gt" | "gte",
  expected: number,
): boolean {
  switch (comparison) {
    case "eq":
      return actual === expected;
    case "lt":
      return actual < expected;
    case "lte":
      return actual <= expected;
    case "gt":
      return actual > expected;
    case "gte":
      return actual >= expected;
  }
}

// ── Attribute Filter ─────────────────────────────────────────────────────────

/**
 * Resolve a numeric AttributeFilter RHS. Accepts either a printed literal
 * or a `SourceStatRef` sentinel, which reads the corresponding stat off the
 * effect source (via `ctx.selfIdentityCardId` so pilot-resident effects'
 * "this Unit" refers to the paired unit, per rule 3-3-9-1).
 *
 * Returns `undefined` when a source-stat ref cannot be resolved (source
 * missing, or the ref points at a stat the source lacks, e.g. HP on a
 * pilot with no paired unit); callers treat this as a non-match.
 */
function resolveNumericRhs(
  value: number | DeepReadonly<SourceStatRef>,
  ctx: TargetResolutionContext,
): number | undefined {
  if (typeof value === "number") return value;
  const refId =
    value.ref === "eventSource"
      ? ctx.eventSourceCardId
      : (ctx.selfIdentityCardId ?? ctx.sourceCardId);
  if (!refId) return undefined;
  const self = ctx.getCardById(refId);
  if (!self) return undefined;
  switch (value.stat) {
    case "hp":
      return ctx.getCardHP(self);
    case "ap":
      return ctx.getCardAP(self);
    case "cost":
      return ctx.getCardCost(self);
    case "level":
      return ctx.getCardLevel(self);
  }
}

function findUnitPairedWithPilot(
  pilot: RuntimeCard,
  ctx: TargetResolutionContext,
): RuntimeCard | undefined {
  if (ctx.getCardType(pilot) !== "pilot") return undefined;
  for (const playerId of [ctx.sourcePlayerId, ctx.opponentPlayerId]) {
    for (const unit of ctx.getCardsInZone(playerId, "battleArea")) {
      if (ctx.getCardType(unit) !== "unit") continue;
      if (ctx.getPairedPilotId(unit) === pilot.instanceId) return unit;
    }
  }
  return undefined;
}

export function evaluateAttributeFilter(
  filter: DeepReadonly<AttributeFilter>,
  card: RuntimeCard,
  ctx: TargetResolutionContext,
): boolean {
  switch (filter.attribute) {
    case "hp": {
      const hp = ctx.getCardHP(card);
      const rhs = resolveNumericRhs(filter.value, ctx);
      return hp !== undefined && rhs !== undefined && compare(hp, filter.comparison, rhs);
    }
    case "ap": {
      const ap = ctx.getCardAP(card);
      const rhs = resolveNumericRhs(filter.value, ctx);
      return ap !== undefined && rhs !== undefined && compare(ap, filter.comparison, rhs);
    }
    case "cost": {
      const rhs = resolveNumericRhs(filter.value, ctx);
      return rhs !== undefined && compare(ctx.getCardCost(card), filter.comparison, rhs);
    }
    case "level": {
      const rhs = resolveNumericRhs(filter.value, ctx);
      return rhs !== undefined && compare(ctx.getCardLevel(card), filter.comparison, rhs);
    }
    case "color": {
      const color = ctx.getCardColor(card);
      if (filter.comparison === "eq") return color === filter.value;
      return color !== filter.value;
    }
    case "zone": {
      const zone = ctx.getCardZone(card);
      if (filter.comparison === "eq") return zone === filter.value;
      return zone !== filter.value;
    }
    case "name": {
      const name = ctx.getCardName(card);
      if (filter.comparison === "eq") return name === filter.value;
      if (filter.comparison === "neq") return name !== filter.value;
      const actual = name.toLowerCase();
      const expected = filter.value.toLowerCase();
      if (filter.comparison === "includes") return actual.includes(expected);
      return !actual.includes(expected);
    }
    case "trait": {
      const traits = ctx.getCardTraits(card);
      const lower = filter.value.toLowerCase();
      const has = traits.some((t) => t.toLowerCase() === lower);
      if (filter.comparison === "includes") return has;
      return !has;
    }
    case "effectTiming": {
      const timings = ctx.getCardEffectTimings?.(card) ?? [];
      const has = timings.includes(filter.value);
      if (filter.comparison === "includes") return has;
      return !has;
    }
    case "paired": {
      // Only Units carry pair state; non-units never match the predicate.
      if (ctx.getCardType(card) !== "unit") return filter.value === false;
      return ctx.isPaired(card) === filter.value;
    }
    case "pairedPilotTrait": {
      if (ctx.getCardType(card) !== "unit") {
        return filter.comparison === "excludes";
      }
      const pilotId = ctx.getPairedPilotId(card);
      if (pilotId === undefined) {
        // Unpaired unit has no paired Pilot — `includes` fails, `excludes` holds.
        return filter.comparison === "excludes";
      }
      const pilot = ctx.getCardById(pilotId);
      if (pilot === undefined) return filter.comparison === "excludes";
      const lower = filter.value.toLowerCase();
      const has = ctx.getCardTraits(pilot).some((t) => t.toLowerCase() === lower);
      return filter.comparison === "includes" ? has : !has;
    }
    case "pairedUnitLevel": {
      const unit = findUnitPairedWithPilot(card, ctx);
      const rhs = resolveNumericRhs(filter.value, ctx);
      return (
        unit !== undefined &&
        rhs !== undefined &&
        compare(ctx.getCardLevel(unit), filter.comparison, rhs)
      );
    }
    case "or": {
      // Logical-OR: matches when ANY nested predicate matches.
      // Empty `filters` is vacuously false (no disjunct can match).
      return filter.filters.some((f) => evaluateAttributeFilter(f, card, ctx));
    }
  }
}

/**
 * Map a `cardType` to the zone where cards of that type "live" by
 * default for targeting purposes. Used as the implicit zone restriction
 * when a TargetFilter omits `zone` — matches the spec comment on
 * `TargetFilter.zone` ("defaults to BattleArea for units"), and aligns
 * with rule 10-2-2-1 ("a Unit/Base must be in play to be chosen").
 *
 * Returns `undefined` when the cardType has no canonical home zone (e.g.
 * `command` resides in trash/removalArea while resolving, and `cardType`
 * arrays span multiple zones — the call site falls back to the broad
 * candidate pool, preserving the historical permissive behavior).
 */
function implicitZoneForCardType(
  cardType: CardType | readonly CardType[] | undefined,
): "battleArea" | "baseSection" | "resourceArea" | undefined {
  if (typeof cardType !== "string") return undefined;
  switch (cardType) {
    case "unit":
    case "pilot":
      // Pilots in play are paired beneath their unit in battleArea
      // (rule 3-3-1). Pilots in hand/trash/deck are addressed via an
      // explicit `zone` and so never reach this default branch.
      return "battleArea";
    case "base":
      return "baseSection";
    case "resource":
      return "resourceArea";
    default:
      return undefined;
  }
}

// ── Single Card Matching ─────────────────────────────────────────────────────

function cardMatchesFilter(
  card: RuntimeCard,
  filter: DeepReadonly<TargetFilter>,
  ownerResolved: PlayerId | "any" | "self",
  ctx: TargetResolutionContext,
): boolean {
  // Owner check
  if (ownerResolved === "self") {
    // Rule 3-3-9-1: on a pilot source, "this Unit" means the paired unit;
    // `ctx.selfIdentityCardId` is rebound to that unit by
    // `buildTargetResolutionContext` so filters like
    // `{ owner: "self", cardType: "unit" }` on a pilot-resident effect
    // correctly match the paired unit instead of the (non-unit) pilot.
    if (card.instanceId !== ctx.selfIdentityCardId) return false;
  } else if (ownerResolved !== "any") {
    if (card.controllerId !== ownerResolved) return false;
  }

  // "another / other" — exclude the source card from the candidate set.
  // Used by Support (rule 13-1-3: "choose one other friendly unit") and
  // any printed effect phrased as "another friendly unit". Uses the
  // source identity from the target-DSL context; if `sourceCardId` is
  // unset (synthetic / source-less evaluation), the flag is a no-op.
  if (filter.excludeSource && ctx.sourceCardId) {
    const excludedIds = new Set([ctx.sourceCardId, ctx.selfIdentityCardId]);
    if (excludedIds.has(card.instanceId)) return false;
  }

  // Card type
  if (filter.cardType !== undefined) {
    const cardType = ctx.getCardType(card);
    if (Array.isArray(filter.cardType)) {
      if (!filter.cardType.includes(cardType)) return false;
    } else {
      if (cardType !== filter.cardType) return false;
    }
  }

  // Zone — explicit `zone` always wins. When omitted, fall back to the
  // implicit zone associated with the filter's cardType per the
  // TargetFilter contract: "Choose 1 enemy Unit" means a Unit on the
  // field (rules 1-2 / 10-2). Without this default, off-board copies of
  // the same printed type (e.g. opponent Units sitting in shieldArea or
  // trash) leak into the candidate pool and break rule 10-1-8-1-1
  // playability checks for Commands like Hawk of Endymion (ST04-013).
  if (filter.zone !== undefined) {
    if (ctx.getCardZone(card) !== filter.zone) return false;
  } else {
    const implicit = implicitZoneForCardType(filter.cardType);
    if (implicit !== undefined && ctx.getCardZone(card) !== implicit) return false;
  }

  // State
  if (filter.state !== undefined) {
    const requiredStates = Array.isArray(filter.state) ? filter.state : [filter.state];
    for (const state of requiredStates) {
      switch (state) {
        case "rested":
          if (!ctx.isRested(card)) return false;
          break;
        case "active":
          if (!ctx.isActive(card)) return false;
          break;
        case "damaged":
          if (!ctx.isDamaged(card)) return false;
          break;
        case "undamaged":
          if (ctx.isDamaged(card)) return false;
          break;
      }
    }
  }

  // Keywords
  if (filter.hasKeyword !== undefined) {
    const keywords = ctx.getCardKeywords(card);
    if (!keywords.includes(filter.hasKeyword)) return false;
  }
  if (filter.hasAnyKeyword !== undefined) {
    const hasAnyKeyword = ctx.getCardKeywords(card).length > 0;
    if (hasAnyKeyword !== filter.hasAnyKeyword) return false;
  }

  // Link unit flag
  if (filter.isLinkUnit !== undefined) {
    if (ctx.isLinked(card) !== filter.isLinkUnit) return false;
  }

  // Token flag
  if (filter.isToken !== undefined) {
    if (ctx.isToken(card) !== filter.isToken) return false;
  }

  // Battling predicate — card is/isn't a combatant in the current attack.
  // Empty (or absent) participant set means no combat is in progress:
  // `isBattling: true` matches nothing, `isBattling: false` matches every
  // card (since none are battling).
  if (filter.isBattling !== undefined) {
    const battlingSet = ctx.currentBattleParticipantIds;
    const isBattling = battlingSet?.has(card.instanceId) ?? false;
    if (typeof filter.isBattling === "boolean") {
      if (isBattling !== filter.isBattling) return false;
    } else {
      // { opponentMatches: <sub-filter> } — card must be battling AND its
      // current opponent must match the sub-filter. Depth-of-1: reject
      // nested opponentMatches to prevent recursion.
      if (!isBattling) return false;
      const sub = filter.isBattling.opponentMatches;
      if (typeof sub.isBattling === "object") return false;
      const opponentIds = ctx.battleOpponents?.get(card.instanceId) ?? [];
      const subOwnerResolved = resolveOwner(sub.owner, ctx);
      let any = false;
      for (const oppId of opponentIds) {
        // Find the opponent's RuntimeCard among the candidate pool. If it's
        // not present (e.g. evaluating against a restricted zone), skip.
        // Sub-filter is evaluated via cardMatchesFilter, not via the full
        // pool, so we need the opponent card object itself.
        const oppCard = ctx.getCardById(oppId);
        if (!oppCard) continue;
        if (cardMatchesFilter(oppCard, sub, subOwnerResolved, ctx)) {
          any = true;
          break;
        }
      }
      if (!any) return false;
    }
  }

  // Attribute filters (ANDed)
  if (filter.attributeFilters !== undefined) {
    for (const af of filter.attributeFilters) {
      if (!evaluateAttributeFilter(af, card, ctx)) return false;
    }
  }

  return true;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Evaluate a TargetFilter against a collection of RuntimeCards.
 * Returns the instance IDs of all matching cards.
 *
 * This does NOT enforce `count` limits — it returns every match.
 * Count limiting is a UI/player-choice concern handled at a higher layer.
 */
export function evaluateTargetFilter(
  filter: DeepReadonly<TargetFilter>,
  cards: readonly RuntimeCard[],
  ctx: TargetResolutionContext,
): CardInstanceId[] {
  const ownerResolved = resolveOwner(filter.owner, ctx);
  const result: CardInstanceId[] = [];

  for (const card of cards) {
    if (cardMatchesFilter(card, filter, ownerResolved, ctx)) {
      result.push(card.instanceId);
    }
  }

  if (filter.highest !== undefined && result.length > 1) {
    let max = Number.NEGATIVE_INFINITY;
    const values = new Map<CardInstanceId, number>();
    for (const id of result) {
      const card = ctx.getCardById(id);
      if (!card) continue;
      const value = numericProperty(card, filter.highest, ctx);
      if (value === undefined) continue;
      values.set(id, value);
      if (value > max) max = value;
    }
    return result.filter((id) => values.get(id) === max);
  }

  if (filter.lowest !== undefined && result.length > 1) {
    let min = Number.POSITIVE_INFINITY;
    const values = new Map<CardInstanceId, number>();
    for (const id of result) {
      const card = ctx.getCardById(id);
      if (!card) continue;
      const value = numericProperty(card, filter.lowest, ctx);
      if (value === undefined) continue;
      values.set(id, value);
      if (value < min) min = value;
    }
    return result.filter((id) => values.get(id) === min);
  }

  return result;
}

function numericProperty(
  card: RuntimeCard,
  prop: NonNullable<TargetFilter["highest"]>,
  ctx: TargetResolutionContext,
): number | undefined {
  switch (prop) {
    case "level":
      return ctx.getCardLevel(card);
    case "cost":
      return ctx.getCardCost(card);
    case "ap":
      return ctx.getCardAP(card);
    case "hp":
      return ctx.getCardHP(card);
  }
}

/**
 * Count how many cards match a TargetFilter without materializing the full
 * list. Useful for condition evaluation where only the count matters.
 */
export function countMatching(
  filter: DeepReadonly<TargetFilter>,
  cards: readonly RuntimeCard[],
  ctx: TargetResolutionContext,
): number {
  const ownerResolved = resolveOwner(filter.owner, ctx);
  let count = 0;

  for (const card of cards) {
    if (cardMatchesFilter(card, filter, ownerResolved, ctx)) {
      count++;
    }
  }

  return count;
}

// ── Condition Evaluation ─────────────────────────────────────────────────────

/**
 * Compile an `EffectCondition.hasTrait` predicate into a per-card tester so
 * the lowercased needle(s) are materialized once per condition evaluation
 * rather than once per candidate card.
 *
 * Semantics (matches the types-side docstring):
 * - `undefined` → always matches (no trait constraint).
 * - `string` → card must carry that trait in its trait list (case-insensitive).
 * - `string[]` → card must carry at least one of the listed traits (OR
 *   semantics). An empty array deliberately matches nothing so card-data
 *   authors can't accidentally produce an always-true condition by emitting
 *   `hasTrait: []`.
 */
function compileTraitPredicate(
  predicate: string | readonly string[] | undefined,
): (cardTraits: readonly string[]) => boolean {
  if (predicate === undefined) return () => true;
  if (typeof predicate === "string") {
    const needle = predicate.toLowerCase();
    return (cardTraits) => {
      for (const t of cardTraits) {
        if (t.toLowerCase() === needle) return true;
      }
      return false;
    };
  }
  if (predicate.length === 0) return () => false;
  const needles = new Set(predicate.map((p) => p.toLowerCase()));
  return (cardTraits) => {
    for (const t of cardTraits) {
      if (needles.has(t.toLowerCase())) return true;
    }
    return false;
  };
}

/**
 * Gather all cards in the battle area for a resolved owner.
 * Helper used by unit-count style conditions.
 */
function getBattleAreaCards(
  owner: "friendly" | "opponent",
  ctx: TargetResolutionContext,
): readonly RuntimeCard[] {
  const playerId = owner === "friendly" ? ctx.sourcePlayerId : ctx.opponentPlayerId;
  return ctx.getCardsInZone(playerId, "battleArea");
}

/**
 * Gather all cards in a given zone for a resolved owner.
 */
function getZoneCards(
  owner: "friendly" | "opponent",
  zone: Zone,
  ctx: TargetResolutionContext,
): readonly RuntimeCard[] {
  const playerId = owner === "friendly" ? ctx.sourcePlayerId : ctx.opponentPlayerId;
  return ctx.getCardsInZone(playerId, zone);
}

/**
 * Evaluate an EffectCondition against the current game state.
 * Returns true when the condition is satisfied.
 */
export function evaluateCondition(
  condition: DeepReadonly<EffectCondition>,
  ctx: TargetResolutionContext,
): boolean {
  switch (condition.type) {
    // ── Unit count ──
    case "unitCount": {
      const units = getBattleAreaCards(condition.owner, ctx);
      const traitMatches = compileTraitPredicate(condition.hasTrait);
      let count = 0;
      for (const u of units) {
        if (ctx.getCardType(u) !== "unit") continue;
        if (condition.excludeSelf && u.instanceId === ctx.sourceCardId) continue;
        if (!traitMatches(ctx.getCardTraits(u))) continue;
        if (condition.isToken !== undefined && ctx.isToken(u) !== condition.isToken) continue;
        if (condition.isLinkUnit !== undefined && ctx.isLinked(u) !== condition.isLinkUnit)
          continue;
        if (condition.state === "rested" && !ctx.isRested(u)) continue;
        if (condition.state === "active" && !ctx.isActive(u)) continue;
        count++;
      }
      return compare(count, condition.comparison, condition.count);
    }

    // ── Card in zone ──
    case "cardInZone": {
      const cards = getZoneCards(condition.owner, condition.zone, ctx);
      const traitMatches = compileTraitPredicate(condition.hasTrait);
      let count = 0;
      for (const c of cards) {
        if (condition.cardType !== undefined && ctx.getCardType(c) !== condition.cardType) continue;
        if (!traitMatches(ctx.getCardTraits(c))) continue;
        if (condition.hasColor !== undefined && ctx.getCardColor(c) !== condition.hasColor)
          continue;
        if (condition.hasName !== undefined) {
          const name = ctx.getCardName(c).toLowerCase();
          if (!name.includes(condition.hasName.toLowerCase())) continue;
        }
        if (condition.attributeFilters !== undefined) {
          if (!condition.attributeFilters.every((af) => evaluateAttributeFilter(af, c, ctx))) {
            continue;
          }
        }
        count++;
      }
      return compare(count, condition.comparison, condition.count);
    }

    case "deployedThisTurnCount": {
      const ownerId = condition.owner === "friendly" ? ctx.sourcePlayerId : ctx.opponentPlayerId;
      const traitMatches = compileTraitPredicate(condition.hasTrait);
      let count = 0;
      for (const cardId of ctx.deployedThisTurnIds ?? []) {
        const card = ctx.getCardById(cardId);
        if (!card) continue;
        if (condition.cardType !== undefined && ctx.getCardType(card) !== condition.cardType)
          continue;
        if (card.ownerId !== ownerId) continue;
        if (!traitMatches(ctx.getCardTraits(card))) continue;
        if (condition.attributeFilters !== undefined) {
          if (!condition.attributeFilters.every((af) => evaluateAttributeFilter(af, card, ctx))) {
            continue;
          }
        }
        count++;
      }
      return compare(count, condition.comparison, condition.count);
    }

    // ── Hand count ──
    case "handCount": {
      const playerId = condition.owner === "friendly" ? ctx.sourcePlayerId : ctx.opponentPlayerId;
      const handSize = ctx.getHandCount(playerId);
      return compare(handSize, condition.comparison, condition.count);
    }

    // ── Self-referencing conditions ──
    // Rule 3-3-9-1: when the source is a pilot, "this Unit" in the
    // pilot's text refers to the paired unit. `selfIdentityCardId`
    // rebinds onto that unit for pilot sources (falling back to
    // `sourceCardId` when unpaired or non-pilot). Every `self*`
    // condition must read through the rebound id so pilot-resident
    // conditions evaluate against the unit's live state.
    case "selfIsDamaged": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isDamaged(self);
    }
    case "selfIsAttacking": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isAttacking(self);
    }
    case "selfIsUnpaired": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && !ctx.isPaired(self);
    }
    case "duringPair": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isPaired(self);
    }
    case "duringLink": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isLinked(self);
    }
    case "selfIsRested": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isRested(self);
    }
    case "selfIsActive": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isActive(self);
    }
    case "isAttackingUnit": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isAttacking(self) && ctx.isDirectAttack !== true;
    }
    case "isAttackingPlayer": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      return self !== undefined && ctx.isAttacking(self) && ctx.isDirectAttack === true;
    }
    case "selfHasKeyword": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      if (self === undefined) return false;
      return ctx.getCardKeywords(self).includes(condition.keyword);
    }
    case "selfHasTrait": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      if (self === undefined) return false;
      return ctx.getCardTraits(self).some((t) => t.toLowerCase() === condition.trait.toLowerCase());
    }
    case "selfPairedPilotHasTrait": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      if (self === undefined || ctx.getCardType(self) !== "unit") return false;
      const pilotId = ctx.getPairedPilotId(self);
      if (pilotId === undefined) return false;
      const pilot = ctx.getCardById(pilotId);
      if (pilot === undefined) return false;
      return ctx
        .getCardTraits(pilot)
        .some((t) => t.toLowerCase() === condition.trait.toLowerCase());
    }
    case "selfPairedPilotHasColor": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      if (self === undefined || ctx.getCardType(self) !== "unit") return false;
      const pilotId = ctx.getPairedPilotId(self);
      if (pilotId === undefined) return false;
      const pilot = ctx.getCardById(pilotId);
      if (pilot === undefined) return false;
      return ctx.getCardColor(pilot) === condition.color;
    }
    case "deployedFromZone":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventCardIsSelf":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventSourceIsSelf":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventCardMatches":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventSourceMatches":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventPlayerIsSelf":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventPlayerIsOpponent":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventPaidExResources":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "eventDamageSourceIsOpponent":
      // Event-scoped condition. The pending-effect/executor layer evaluates
      // this with trigger context; the pure target DSL has no event payload.
      return false;
    case "linkedUnitHasTrait": {
      // Only meaningful for pilot sources: `selfIdentityCardId` is rebound
      // to the paired unit by `buildTargetResolutionContext` (rule 3-3-9-1)
      // only when the source is a pilot AND is currently paired. If the
      // rebinding did NOT happen — non-pilot source, unpaired pilot, or
      // the paired id isn't resolvable — this condition returns false.
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      if (selfId === ctx.sourceCardId) return false;
      const linkedUnit = ctx.getCardById(selfId);
      if (linkedUnit === undefined) return false;
      const traitMatches = compileTraitPredicate(condition.trait);
      return traitMatches(ctx.getCardTraits(linkedUnit));
    }
    case "linkedUnitHasColor": {
      // Same pilot-rebound logic as `linkedUnitHasTrait`: the linked
      // unit is only reachable when `selfIdentityCardId` was rebound by
      // `buildTargetResolutionContext` (rule 3-3-9-1).
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      if (selfId === ctx.sourceCardId) return false;
      const linkedUnit = ctx.getCardById(selfId);
      if (linkedUnit === undefined) return false;
      return ctx.getCardColor(linkedUnit) === condition.color;
    }
    case "selfIsColor": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      if (self === undefined) return false;
      return ctx.getCardColor(self) === condition.color;
    }
    case "selfStat": {
      const selfId = ctx.selfIdentityCardId ?? ctx.sourceCardId;
      const self = ctx.getCardById(selfId);
      if (self === undefined) return false;
      const val =
        condition.stat === "ap"
          ? ctx.getCardAP(self)
          : (ctx.getCardRemainingHP?.(self) ?? ctx.getCardHP(self));
      return val !== undefined && compare(val, condition.comparison, condition.value);
    }

    // ── Turn ──
    case "isTurn": {
      const expected = condition.whose === "friendly" ? ctx.sourcePlayerId : ctx.opponentPlayerId;
      return ctx.activePlayerId === expected;
    }

    // ── Player level ──
    case "playerLevel": {
      const level = ctx.getPlayerLevel(ctx.sourcePlayerId);
      return compare(level, condition.comparison, condition.value);
    }

    // ── Base / Pilot in play ──
    case "friendlyBaseInPlay": {
      const cards = getZoneCards("friendly", "baseSection", ctx);
      return cards.some((c) => {
        if (ctx.getCardType(c) !== "base") return false;
        if (condition.color !== undefined && ctx.getCardColor(c) !== condition.color) return false;
        if (condition.hasTrait !== undefined) {
          const traits = ctx.getCardTraits(c);
          if (!traits.some((t) => t.toLowerCase() === condition.hasTrait!.toLowerCase()))
            return false;
        }
        return true;
      });
    }
    // ── Battle event ──
    case "enemyLinkUnitDestroyedDuringAttack":
      return ctx.enemyLinkUnitDestroyedDuringAttack === true;

    // ── Compound ──
    case "and":
      return condition.conditions.every((c) => evaluateCondition(c, ctx));
  }
}

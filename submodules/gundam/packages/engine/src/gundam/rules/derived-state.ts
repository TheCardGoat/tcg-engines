/**
 * Gundam TCG — Derived State
 *
 * Computes effective card stats by applying:
 *   1. Base stats from the card definition
 *   2. Pilot bonus (if a pilot is assigned)
 *   3. Active continuous effects (stat modifiers, keyword grants, restrictions)
 *   4. Per-card meta overrides (permanent modifiers stored in GundamCardMeta)
 */

import type {
  Card,
  UnitCard,
  BaseCard,
  KeywordEffect,
  CardColor,
  CardType,
  Zone,
  CardEffect,
  EffectCondition,
  EffectDirective,
  AttributeFilter,
  TargetFilter,
} from "@tcg/gundam-types";
import type { CardReadAPI, FrameworkReadAPI } from "../../types/move-types.ts";
import type { ReadonlyGundamG, GundamCardMeta } from "../types.ts";
import type { RuntimeCard } from "../../types/base-card.ts";
import type { CardInstanceId, PlayerId } from "../../types/branded.ts";
import type { TargetResolutionContext } from "../../runtime/target-dsl.ts";
import {
  evaluateCondition,
  evaluateTargetFilter,
  evaluateAttributeFilter,
} from "../../runtime/target-dsl.ts";

// =============================================================================
// Target Resolution Context Factory
// =============================================================================

export interface BuildTargetResolutionContextOptions {
  /**
   * The card whose effect is being evaluated (if any). Omit for
   * contexts not tied to a specific source (e.g. zone-level damage
   * prevention).
   */
  sourceCardId?: string;
  /** Card that caused the current triggering event, when evaluating one. */
  eventSourceCardId?: string;

  /**
   * Override for the card that "this Unit" should resolve to. Used by
   * delayed execution of pilot-resident destroyed triggers after the host
   * Unit has already left play and `pilotAssignments` has been cleaned up.
   */
  selfIdentityCardId?: string;

  /**
   * When true, stat getters (getCardAP/getCardHP/getCardKeywords) skip
   * Constant-effect evaluation by calling getEffectiveStats without
   * `framework`. Used internally by getEffectiveStats itself when
   * evaluating Constant-effect target filters — prevents the infinite
   * recursion that would otherwise occur if Constant effect A's filter
   * reads stats that themselves depend on Constant effect B, etc.
   */
  recursionGuard?: boolean;
}

/**
 * Build a TargetResolutionContext from the Gundam runtime state.
 *
 * Used by moves, effect handlers, and internally by getEffectiveStats
 * (with recursionGuard: true) to evaluate Constant-effect target filters.
 */
export function buildTargetResolutionContext(
  G: ReadonlyGundamG,
  sourcePlayerId: string,
  framework: FrameworkReadAPI,
  opts?: BuildTargetResolutionContextOptions,
): TargetResolutionContext {
  const allPlayerIds = Object.keys(G.players);
  const opponentPlayerId = allPlayerIds.find((id) => id !== sourcePlayerId) ?? sourcePlayerId;
  const activePlayerId = framework.state.status.activePlayer as PlayerId;
  const cards = framework.cards;
  const statsFramework = opts?.recursionGuard ? undefined : framework;

  // Rule 3-3-9-1: text printed on a pilot card belongs to the pilot, but
  // "this Unit" in that text refers to the paired unit. When the source is
  // a pilot card that is currently paired, rebind the "self" identity used
  // by `owner: "self"` target filters to the paired unit's id. Falls back
  // to sourceCardId for non-pilot sources or unpaired pilots.
  const rawSourceId = opts?.sourceCardId ?? "";
  let selfIdentityId = opts?.selfIdentityCardId ?? rawSourceId;
  if (rawSourceId && opts?.selfIdentityCardId === undefined) {
    const sourceDef = cards.getDefinition(rawSourceId) as Card | undefined;
    if (sourceDef?.type === "pilot") {
      for (const [unitId, pilotId] of Object.entries(G.pilotAssignments)) {
        if (pilotId === rawSourceId) {
          selfIdentityId = unitId;
          break;
        }
      }
    }
  }

  // Build the combat-participant set from pendingCombat so the
  // `TargetFilter.isBattling` predicate can answer "is this card one of
  // the current combatants?". Unit-vs-unit combat contributes both units.
  // For direct attacks the defender is the opposing player (not a card),
  // but rule 8-5-2-1 routes the attack's damage at the defender's Base
  // (if any) — and otherwise consumes shields. For card-text purposes
  // ("enemy Base/enemy Shield this Unit is battling") we mirror that
  // routing: include the defender's baseSection card(s) when present,
  // and fall back to shieldArea cards only when no base exists.
  const pendingCombat = G.turnMetadata.pendingCombat;
  let currentBattleParticipantIds: ReadonlySet<CardInstanceId> | undefined;
  let battleOpponents: ReadonlyMap<CardInstanceId, readonly CardInstanceId[]> | undefined;
  if (pendingCombat) {
    const ids = new Set<CardInstanceId>();
    const opponents = new Map<CardInstanceId, CardInstanceId[]>();
    const attackerId = pendingCombat.attackerId as CardInstanceId;
    ids.add(attackerId);
    const defenderIds: CardInstanceId[] = [];
    if (pendingCombat.target !== "direct") {
      const t = pendingCombat.target as CardInstanceId;
      ids.add(t);
      defenderIds.push(t);
    } else {
      const defenderPlayerId = allPlayerIds.find((id) => id !== pendingCombat.attackerPlayerId);
      if (defenderPlayerId) {
        const baseIds = framework.zones.getCards({
          zone: "baseSection",
          playerId: defenderPlayerId,
        });
        const sourceIds =
          baseIds.length > 0
            ? baseIds
            : framework.zones.getCards({ zone: "shieldArea", playerId: defenderPlayerId });
        for (const id of sourceIds) {
          ids.add(id as CardInstanceId);
          defenderIds.push(id as CardInstanceId);
        }
      }
    }
    opponents.set(attackerId, defenderIds);
    for (const dId of defenderIds) {
      opponents.set(dId, [attackerId]);
    }
    currentBattleParticipantIds = ids;
    battleOpponents = opponents;
  }

  return {
    sourcePlayerId: sourcePlayerId as PlayerId,
    sourceCardId: rawSourceId as CardInstanceId,
    eventSourceCardId: opts?.eventSourceCardId as CardInstanceId | undefined,
    selfIdentityCardId: selfIdentityId as CardInstanceId,
    opponentPlayerId: opponentPlayerId as PlayerId,
    activePlayerId,
    currentBattleParticipantIds,
    deployedThisTurnIds: new Set(G.turnMetadata.deployedThisTurn as CardInstanceId[]),
    battleOpponents,
    isDirectAttack: pendingCombat?.target === "direct",

    getCardsInZone(playerId: PlayerId, zone: Zone): readonly RuntimeCard[] {
      const ids = framework.zones.getCards({ zone, playerId: playerId as string });
      return ids.map((id) => cards.get(id)).filter((c): c is RuntimeCard => c !== undefined);
    },

    getCardById(id: CardInstanceId): RuntimeCard | undefined {
      return cards.get(id as string);
    },

    getPlayerLevel(playerId: PlayerId): number {
      return framework.zones.getCardCount({ zone: "resourceArea", playerId: playerId as string });
    },

    getHandCount(playerId: PlayerId): number {
      return framework.zones.getCardCount({ zone: "hand", playerId: playerId as string });
    },

    getCardColor(card: RuntimeCard): CardColor | undefined {
      return (card.definition as Card).color as CardColor | undefined;
    },

    getCardType(card: RuntimeCard): CardType {
      return (card.definition as Card).type as CardType;
    },

    getCardAP(card: RuntimeCard): number | undefined {
      const def = card.definition as Card;
      if (def.type !== "unit") return undefined;
      return getEffectiveStats(card.instanceId as string, G, cards, statsFramework).ap;
    },

    getCardHP(card: RuntimeCard): number | undefined {
      const def = card.definition as Card;
      if (def.type !== "unit" && def.type !== "base") return undefined;
      if (def.type === "base") return (def as BaseCard).hp;
      return getEffectiveStats(card.instanceId as string, G, cards, statsFramework).hp;
    },

    getCardRemainingHP(card: RuntimeCard): number | undefined {
      const maxHp = this.getCardHP(card);
      if (maxHp === undefined) return undefined;
      return Math.max(0, maxHp - (G.damage[card.instanceId as string] ?? 0));
    },

    getCardCost(card: RuntimeCard): number {
      return (card.definition as Card).cost;
    },

    getCardLevel(card: RuntimeCard): number {
      return (card.definition as Card).level;
    },

    getCardTraits(card: RuntimeCard): readonly string[] {
      const traits = new Set((card.definition as Card).traits);
      for (const effect of G.continuousEffects) {
        if (effect.targetId === card.instanceId && effect.payload.kind === "trait-grant") {
          traits.add(effect.payload.trait);
        }
      }
      return [...traits];
    },

    getCardName(card: RuntimeCard): string {
      return (card.definition as Card).name;
    },

    getCardKeywords(card: RuntimeCard): readonly KeywordEffect[] {
      return getEffectiveStats(card.instanceId as string, G, cards, statsFramework).keywords;
    },

    getCardEffectTimings(card: RuntimeCard): readonly string[] {
      const def = card.definition as Card;
      return (def.effects ?? []).flatMap(
        (effect) => (effect.activation.timing ?? []) as readonly string[],
      );
    },

    getCardZone(card: RuntimeCard): Zone {
      return card.zoneId.split(":")[0] as Zone;
    },

    isRested(card: RuntimeCard): boolean {
      return G.exhausted[card.instanceId as string] ?? false;
    },

    isActive(card: RuntimeCard): boolean {
      return !(G.exhausted[card.instanceId as string] ?? false);
    },

    isDamaged(card: RuntimeCard): boolean {
      return (G.damage[card.instanceId as string] ?? 0) > 0;
    },

    isLinked(card: RuntimeCard): boolean {
      const unitId = card.instanceId as string;
      const pilotId = G.pilotAssignments[unitId];
      if (!pilotId) return false;
      return satisfiesLinkCondition(pilotId, unitId, cards);
    },

    isPaired(card: RuntimeCard): boolean {
      return (card.instanceId as string) in G.pilotAssignments;
    },

    getPairedPilotId(card: RuntimeCard): CardInstanceId | undefined {
      const pilotId = G.pilotAssignments[card.instanceId as string];
      return pilotId as CardInstanceId | undefined;
    },

    isAttacking(card: RuntimeCard): boolean {
      return G.turnMetadata.pendingCombat?.attackerId === (card.instanceId as string);
    },

    isToken(card: RuntimeCard): boolean {
      const meta = card.meta as GundamCardMeta;
      return meta?.isToken === true;
    },
  };
}

// =============================================================================
// Effective Stats
// =============================================================================

export interface EffectiveUnitStats {
  ap: number;
  hp: number;
  cost: number;
  keywords: KeywordEffect[];
  restrictions: string[];
}

/**
 * Compute effective stats for a card instance.
 * Non-unit cards return zeroed stats.
 *
 * When `framework` is provided, also evaluates Constant effects from all
 * in-play cards in both players' BattleAreas and applies any matching
 * stat-modifier or keyword-grant actions.
 */
/**
 * Pre-scan constant effects for `preventStatReduction` restrictions
 * targeting `cardId`. Called before processing `G.continuousEffects` so
 * the restrictions are available when stat modifiers are applied.
 */
function collectConstantRestrictions(
  cardId: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
  framework: FrameworkReadAPI,
  restrictions: Set<string>,
): void {
  const allPlayerIds = Object.keys(G.players);
  const allBattleAreaCards: RuntimeCard[] = [];
  for (const pid of allPlayerIds) {
    for (const id of framework.zones.getCards({ zone: "battleArea", playerId: pid })) {
      const card = cards.get(id);
      if (card) allBattleAreaCards.push(card);
    }
    for (const id of framework.zones.getCards({ zone: "baseSection", playerId: pid })) {
      const card = cards.get(id);
      if (card) allBattleAreaCards.push(card);
    }
  }

  for (const ownerId of allPlayerIds) {
    const zonesToScan = [
      ...framework.zones.getCards({ zone: "battleArea", playerId: ownerId }),
      ...framework.zones.getCards({ zone: "baseSection", playerId: ownerId }),
    ];
    for (const sourceId of zonesToScan) {
      const sourceDef = cards.getDefinition(sourceId) as Card | undefined;
      if (!sourceDef?.effects?.length) continue;

      const ctx = buildTargetResolutionContext(G, ownerId, framework, {
        sourceCardId: sourceId,
        recursionGuard: true,
      });

      for (const effect of sourceDef.effects as CardEffect[]) {
        if (effect.type !== "constant") continue;

        const gateUnitId =
          sourceDef.type === "pilot"
            ? Object.entries(G.pilotAssignments).find(([, pid]) => pid === sourceId)?.[0]
            : sourceId;

        // Qualification check
        const qualification = effect.activation.qualification as AttributeFilter | undefined;
        if (qualification && gateUnitId) {
          const pilotIdForQual = G.pilotAssignments[gateUnitId];
          if (!pilotIdForQual) continue;
          const pilotCard = cards.get(pilotIdForQual);
          if (!pilotCard) continue;
          if (!evaluateAttributeFilter(qualification, pilotCard, ctx)) continue;
        }

        // Conditions
        if (effect.activation.conditions?.length) {
          const allMet = effect.activation.conditions.every((cond) =>
            evaluateCondition(cond as EffectCondition, ctx),
          );
          if (!allMet) continue;
        }

        for (const directive of effect.directives) {
          if (!("action" in directive)) continue;
          const action = (directive as EffectDirective).action;
          if (action.action === "preventStatReduction") {
            const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
            if (matchedIds.includes(cardId as CardInstanceId)) {
              const suffix = action.source === "enemy" ? "-enemy" : "";
              restrictions.add(`prevent-stat-reduction-${action.stat}${suffix}`);
            }
          }
        }
      }
    }
  }
}

function countUniqueNamesMatching(
  filter: TargetFilter,
  ctx: TargetResolutionContext,
  framework: FrameworkReadAPI,
): number {
  const zones = [
    "battleArea",
    "baseSection",
    "hand",
    "trash",
    "shieldArea",
    "resourceArea",
  ] as const;
  const playerIds = [ctx.sourcePlayerId as string, ctx.opponentPlayerId as string];
  const candidates: RuntimeCard[] = [];
  for (const playerId of playerIds) {
    for (const zone of zones) {
      for (const id of framework.zones.getCards({ zone, playerId })) {
        const card = framework.cards.get(id);
        if (card) candidates.push(card);
      }
    }
  }

  const names = new Set<string>();
  for (const id of evaluateTargetFilter(filter, candidates, ctx)) {
    const def = framework.cards.getDefinition(id as string) as Card | undefined;
    if (def) names.add(def.name.toLowerCase());
  }
  return names.size;
}

export function getEffectiveStats(
  cardId: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
  framework?: FrameworkReadAPI,
): EffectiveUnitStats {
  const definition = cards.getDefinition(cardId) as Card | undefined;

  if (!definition || definition.type !== "unit") {
    // For non-units, return default zeroed stats
    const isBase = definition?.type === "base";
    const baseHp = isBase ? (definition as BaseCard).hp : 0;
    return {
      ap: 0,
      hp: baseHp,
      cost: definition?.cost ?? 0,
      keywords: [],
      restrictions: [],
    };
  }

  const unit = definition as UnitCard;
  let ap = unit.ap;
  let hp = unit.hp;
  let cost = unit.cost;

  const keywords = new Set<string>(unit.keywordEffects.map((k) => k.keyword));
  const restrictions = new Set<string>();

  // ------------------------------------------------------------------
  // Pilot bonus
  // ------------------------------------------------------------------
  const pilotId = G.pilotAssignments[cardId];
  if (pilotId) {
    const pilotDef = cards.getDefinition(pilotId) as Card | undefined;
    const pilotBonus = getPairedPilotBonus(pilotDef);
    if (pilotBonus) {
      ap += pilotBonus.ap;
      hp += pilotBonus.hp;
      for (const { keyword: kw } of pilotBonus.keywordEffects) keywords.add(kw);
    }
  }

  // ------------------------------------------------------------------
  // Pre-scan: collect prevent-stat-reduction restrictions from constant
  // effects BEFORE processing runtime continuous effects, so that enemy
  // AP reductions pushed via `G.continuousEffects` are correctly blocked.
  // ------------------------------------------------------------------
  if (framework) {
    collectConstantRestrictions(cardId, G, cards, framework, restrictions);
  }

  // ------------------------------------------------------------------
  // Active continuous effects
  // ------------------------------------------------------------------
  // First pass: collect all restrictions (needed to gate stat modifiers below).
  for (const effect of G.continuousEffects) {
    if (effect.targetId !== cardId) continue;
    const p = effect.payload;
    if (p.kind === "restriction") {
      restrictions.add(p.restriction);
    } else if (p.kind === "keyword-grant") {
      keywords.add(p.keyword);
    }
  }
  // Second pass: apply stat modifiers, respecting prevent-stat-reduction.
  for (const effect of G.continuousEffects) {
    if (effect.targetId !== cardId) continue;
    const p = effect.payload;
    if (p.kind === "stat-modifier") {
      if (p.modifier < 0) {
        // Check prevent-stat-reduction restrictions.
        const preventAll = restrictions.has(`prevent-stat-reduction-${p.stat}`);
        if (preventAll) continue;
        const preventEnemy = restrictions.has(`prevent-stat-reduction-${p.stat}-enemy`);
        if (preventEnemy) {
          // "Enemy" means the source card's owner differs from the target card's owner.
          const sourceOwner = cards.getOwner(effect.sourceId);
          const targetOwner = cards.getOwner(cardId);
          if (sourceOwner && targetOwner && sourceOwner !== targetOwner) continue;
        }
      }
      if (p.stat === "ap") ap += p.modifier;
      else if (p.stat === "hp") hp += p.modifier;
    }
  }

  // ------------------------------------------------------------------
  // Constant effects from in-play cards
  // ------------------------------------------------------------------
  if (framework) {
    const allPlayerIds = Object.keys(G.players);

    // Collect all BattleArea and BaseSection cards once, reused for target evaluation
    const allBattleAreaCards: RuntimeCard[] = [];
    for (const pid of allPlayerIds) {
      const ids = framework.zones.getCards({ zone: "battleArea", playerId: pid });
      for (const id of ids) {
        const card = cards.get(id);
        if (card) allBattleAreaCards.push(card);
      }
      const baseIds = framework.zones.getCards({ zone: "baseSection", playerId: pid });
      for (const id of baseIds) {
        const card = cards.get(id);
        if (card) allBattleAreaCards.push(card);
      }
    }

    for (const ownerId of allPlayerIds) {
      const zonesToScan = [
        ...framework.zones.getCards({ zone: "battleArea", playerId: ownerId }),
        ...framework.zones.getCards({ zone: "baseSection", playerId: ownerId }),
      ];

      for (const sourceId of zonesToScan) {
        const sourceDef = cards.getDefinition(sourceId) as Card | undefined;
        if (!sourceDef?.effects?.length) continue;

        const ctx = buildTargetResolutionContext(G, ownerId, framework, {
          sourceCardId: sourceId,
          recursionGuard: true,
        });

        for (const effect of sourceDef.effects as CardEffect[]) {
          if (effect.type !== "constant") continue;

          // Resolve the unit identity these gates check against. For a
          // pilot source, the gates ask about the *paired unit* — rule
          // 3-3-9-1: pilot-printed `【During Link】` / `【During Pair】`
          // refers to the unit the pilot is paired with, not to the
          // pilot card itself (which is never a link / paired unit by
          // construction).
          const gateUnitId =
            sourceDef.type === "pilot"
              ? Object.entries(G.pilotAssignments).find(([, pid]) => pid === sourceId)?.[0]
              : sourceId;

          // Check qualification (pilot attribute gate for duringPair/duringLink).
          // The qualification predicate checks the *pilot* card's attributes —
          // e.g. "【During Pair·Red Pilot】" → { attribute: "color", comparison: "eq", value: "red" }.
          const qualification = effect.activation.qualification as AttributeFilter | undefined;
          if (qualification && gateUnitId) {
            const pilotIdForQual = G.pilotAssignments[gateUnitId];
            if (!pilotIdForQual) continue; // no pilot → qualification can't be met
            const pilotCard = cards.get(pilotIdForQual);
            if (!pilotCard) continue;
            if (!evaluateAttributeFilter(qualification, pilotCard, ctx)) continue;
          }

          // Check conditions
          if (effect.activation.conditions?.length) {
            const allMet = effect.activation.conditions.every((cond) =>
              evaluateCondition(cond as EffectCondition, ctx),
            );
            if (!allMet) continue;
          }

          for (const directive of effect.directives) {
            if (!("action" in directive)) continue; // skip ConditionalDirective

            const action = (directive as EffectDirective).action;
            if (action.action === "statModifier") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                // Respect prevent-stat-reduction for negative modifiers.
                if (action.amount < 0) {
                  const preventAll = restrictions.has(`prevent-stat-reduction-${action.stat}`);
                  if (preventAll) continue;
                  const preventEnemy = restrictions.has(
                    `prevent-stat-reduction-${action.stat}-enemy`,
                  );
                  if (preventEnemy) {
                    const targetOwner = cards.getOwner(cardId);
                    if (targetOwner && ownerId !== targetOwner) continue;
                  }
                }
                if (action.stat === "ap") ap += action.amount;
                else if (action.stat === "hp") hp += action.amount;
              }
            } else if (action.action === "statModifierByCount") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                const count = evaluateTargetFilter(
                  action.countFilter,
                  allBattleAreaCards,
                  ctx,
                ).length;
                const amount = action.amountPerMatch * count;
                // Respect prevent-stat-reduction for negative modifiers.
                if (amount < 0) {
                  const preventAll = restrictions.has(`prevent-stat-reduction-${action.stat}`);
                  if (preventAll) continue;
                  const preventEnemy = restrictions.has(
                    `prevent-stat-reduction-${action.stat}-enemy`,
                  );
                  if (preventEnemy) {
                    const targetOwner = cards.getOwner(cardId);
                    if (targetOwner && ownerId !== targetOwner) continue;
                  }
                }
                if (action.stat === "ap") ap += amount;
                else if (action.stat === "hp") hp += amount;
              }
            } else if (action.action === "statModifierByUniqueNameCount") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                const count = countUniqueNamesMatching(action.countFilter, ctx, framework);
                const amount = action.amountPerUniqueName * count;
                if (amount < 0) {
                  const preventAll = restrictions.has(`prevent-stat-reduction-${action.stat}`);
                  if (preventAll) continue;
                  const preventEnemy = restrictions.has(
                    `prevent-stat-reduction-${action.stat}-enemy`,
                  );
                  if (preventEnemy) {
                    const targetOwner = cards.getOwner(cardId);
                    if (targetOwner && ownerId !== targetOwner) continue;
                  }
                }
                if (action.stat === "ap") ap += amount;
                else if (action.stat === "hp") hp += amount;
              }
            } else if (action.action === "grantKeyword") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                keywords.add(action.keyword);
              }
            } else if (action.action === "preventStatReduction") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                const suffix = action.source === "enemy" ? "-enemy" : "";
                restrictions.add(`prevent-stat-reduction-${action.stat}${suffix}`);
              }
            } else if (action.action === "cantAttack") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                restrictions.add("cannot-attack");
              }
            } else if (action.action === "cantTargetPlayer") {
              // "This Unit can't choose the enemy player as its attack target."
              // Applies to the source card itself (no target filter).
              if (sourceId === cardId) {
                restrictions.add("cannot-target-player");
              }
            } else if (action.action === "restrictUnit") {
              const matchedIds = evaluateTargetFilter(action.target, allBattleAreaCards, ctx);
              if (matchedIds.includes(cardId as CardInstanceId)) {
                if (action.restrictions.includes("cannotSetActive")) {
                  restrictions.add("cannot-set-active");
                }
                if (action.restrictions.includes("cannotPairPilot")) {
                  restrictions.add("cannot-pair-pilot");
                }
              }
            }
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // Per-card meta overrides
  // ------------------------------------------------------------------
  const meta = cards.getMeta(cardId) as GundamCardMeta | undefined;
  if (meta) {
    for (const kw of meta.grantedKeywords ?? []) keywords.add(kw);
    for (const kw of meta.removedKeywords ?? []) keywords.delete(kw);
    ap += meta.apModifier ?? 0;
    hp += meta.hpModifier ?? 0;
  }

  return {
    ap: Math.max(0, ap),
    hp: Math.max(1, hp),
    cost: Math.max(0, cost),
    keywords: [...keywords] as KeywordEffect[],
    restrictions: [...restrictions],
  };
}

function getPairedPilotBonus(pilotDef: Card | undefined): {
  readonly ap: number;
  readonly hp: number;
  readonly keywordEffects: Card["keywordEffects"];
} | null {
  if (!pilotDef) return null;

  if (pilotDef.type === "pilot") {
    return {
      ap: pilotDef.apBonus,
      hp: pilotDef.hpBonus,
      keywordEffects: pilotDef.keywordEffects,
    };
  }

  if (pilotDef.type === "command" && pilotDef.pilotName !== undefined) {
    return {
      ap: pilotDef.apBonus ?? 0,
      hp: pilotDef.hpBonus ?? 0,
      keywordEffects: pilotDef.keywordEffects,
    };
  }

  return null;
}

// =============================================================================
// Link Condition (rules 3-2-6-1, 3-2-6-2, 3-2-6-4)
// =============================================================================

/**
 * Whether a pilot satisfies a unit's link condition.
 *
 * A unit with no linkCondition accepts any pilot (returns true).
 *
 * The link condition takes one of two printed shapes (rule 3-2-6-4):
 *   - `[Pilot Name]` — bracketed partial name (case-insensitive substring)
 *     match against the pilot's primary or alternate name.
 *   - `(Trait Name) Trait` — parenthesised trait reference. Multiple
 *     traits are joined with `/` for OR semantics (e.g. "(Newtype) /
 *     (Cyber-Newtype) Trait"). The pilot must carry at least one named
 *     trait (case-insensitive).
 *
 * Mixed forms ("[Char Aznable] / (Newtype) Trait") are satisfied when
 * EITHER side matches — the engine treats every bracketed name and
 * every parenthesised trait as alternatives.
 */
export function satisfiesLinkCondition(
  pilotId: string,
  unitId: string,
  cards: CardReadAPI,
): boolean {
  const unitDef = cards.getDefinition(unitId) as Card | undefined;
  if (!unitDef || unitDef.type !== "unit") return false;

  const unit = unitDef as UnitCard;
  // Rule 3-2-6-1/2: Link Unit status requires the Unit to HAVE a link
  // condition AND the paired Pilot satisfies it. A Unit printed without
  // a link condition is never a Link Unit, regardless of who's paired.
  if (!unit.linkCondition) return false;

  const condition = unit.linkCondition;
  const nameRequirements = [...condition.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]!.toLowerCase());
  const traitRequirements = [...condition.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]!.toLowerCase());

  if (nameRequirements.length === 0 && traitRequirements.length === 0) {
    return false; // malformed condition — fail safe
  }

  const pilotDef = cards.getDefinition(pilotId) as Card | undefined;
  if (!pilotDef) return false;
  // Accept either a real Pilot card OR a Command card carrying the
  // 【Pilot】 keyword (rule 3-3-9-2 / 13-1-1: a Command with the Pilot
  // keyword can be paired as a Pilot and inherits its name & traits for
  // link-condition purposes).
  const isPilotShape =
    pilotDef.type === "pilot" || (pilotDef.type === "command" && pilotDef.pilotName !== undefined);
  if (!isPilotShape) return false;

  if (nameRequirements.length > 0) {
    const altNames = (pilotDef as { alternateNames?: readonly string[] }).alternateNames ?? [];
    const commandPilotName = pilotDef.type === "command" ? pilotDef.pilotName : undefined;
    const namesToCheck = [commandPilotName, pilotDef.name, ...altNames].filter(
      (name): name is string => name !== undefined,
    );
    if (nameRequirements.some((req) => namesToCheck.some((n) => n.toLowerCase().includes(req)))) {
      return true;
    }
  }

  if (traitRequirements.length > 0) {
    const pilotTraits = pilotDef.traits.map((t) => t.toLowerCase());
    if (traitRequirements.some((req) => pilotTraits.includes(req))) {
      return true;
    }
  }

  return false;
}

/**
 * Whether a unit is a Link Unit — paired with a pilot that satisfies its link condition.
 * Rules 3-2-6-2: a Unit with a Pilot satisfying its link conditions placed beneath it
 * is called a Link Unit.
 */
export function isLinkUnit(cardId: string, G: ReadonlyGundamG, cards: CardReadAPI): boolean {
  const pilotId = G.pilotAssignments[cardId];
  if (!pilotId) return false;
  return satisfiesLinkCondition(pilotId, cardId, cards);
}

// =============================================================================
// Keyword & Restriction Checks
// =============================================================================

export function hasKeyword(
  cardId: string,
  keyword: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
  framework?: FrameworkReadAPI,
): boolean {
  return getEffectiveStats(cardId, G, cards, framework).keywords.includes(keyword as KeywordEffect);
}

/**
 * Get the aggregated numeric value for a keyword effect.
 * Per rules 13-1-1-2, 13-1-2-5, 13-1-3-2: if a unit gains a new copy of
 * a keyword, the values are ADDED (e.g. Repair 1 + Repair 1 = Repair 2).
 * Returns 0 if the keyword is not present.
 */
export function getKeywordValue(
  cardId: string,
  keyword: KeywordEffect,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
): number {
  const definition = cards.getDefinition(cardId) as Card | undefined;
  if (!definition) return 0;

  let total = 0;

  // Base keyword values from card definition
  for (const entry of definition.keywordEffects) {
    if (entry.keyword === keyword) {
      total += entry.value ?? 1;
    }
  }

  // Pilot keyword values
  const pilotId = G.pilotAssignments[cardId];
  if (pilotId) {
    const pilotDef = cards.getDefinition(pilotId) as Card | undefined;
    const pilotBonus = getPairedPilotBonus(pilotDef);
    if (pilotBonus) {
      for (const entry of pilotBonus.keywordEffects) {
        if (entry.keyword === keyword) {
          total += entry.value ?? 1;
        }
      }
    }
  }

  // Continuous keyword grants (from G.continuousEffects)
  for (const effect of G.continuousEffects) {
    if (effect.targetId !== cardId) continue;
    if (effect.payload.kind === "keyword-grant" && effect.payload.keyword === keyword) {
      total += 1;
    }
  }

  // Meta keyword grants
  const meta = cards.getMeta(cardId) as GundamCardMeta | undefined;
  if (meta?.grantedKeywords?.includes(keyword)) {
    total += 1;
  }

  return total;
}

export function hasRestriction(
  cardId: string,
  restriction: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
  framework?: FrameworkReadAPI,
): boolean {
  return getEffectiveStats(cardId, G, cards, framework).restrictions.includes(restriction);
}

function hasDeployTurnAttackPermission(cardId: string, G: ReadonlyGundamG): boolean {
  return G.continuousEffects.some(
    (effect) =>
      effect.targetId === cardId && effect.payload.kind === "allow-attack-deployed-this-turn",
  );
}

// =============================================================================
// Activated Abilities (printed + keyword-synthesised)
// =============================================================================

/**
 * All activated abilities visible on a card — printed `type: "activated"`
 * effects, followed by synthetic activated abilities derived from
 * keywords (currently only `<Support (N)>`, rule 13-1-3).
 *
 * Stable order: printed effects first in their definition order, synthetic
 * ones appended at the tail. This preserves printed effects' relative
 * ordering. The synthetic Support ability remains *after* all printed
 * activated effects, but its own index still shifts if the card gains or
 * loses printed activated effects.
 *
 * Returns `[]` when the card has no definition or no relevant effects.
 */
export function getActivatedEffects(
  cardId: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
): readonly CardEffect[] {
  const def = cards.getDefinition(cardId) as Card | undefined;
  if (!def) return [];
  const printed = ((def.effects ?? []) as CardEffect[]).filter((e) => e.type === "activated");
  const synthetic = synthesiseKeywordActivatedEffects(cardId, G, cards);
  return synthetic.length === 0 ? printed : [...printed, ...synthetic];
}

/**
 * Marker used by test harnesses (and any future UX layer) to locate the
 * synthesised Support ability inside `getActivatedEffects` output. The
 * `sourceText` prefix is stable across card values and is what the
 * ability renders as in UI ("<Support 2>", "<Support 1>", …).
 */
export function isSupportActivatedEffect(effect: CardEffect): boolean {
  return effect.type === "activated" && (effect.sourceText ?? "").startsWith("<Support ");
}

function synthesiseKeywordActivatedEffects(
  cardId: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
): CardEffect[] {
  const out: CardEffect[] = [];
  const supportValue = getKeywordValue(cardId, "Support", G, cards);
  if (supportValue > 0) {
    out.push(makeSupportActivatedEffect(supportValue));
  }
  return out;
}

function makeSupportActivatedEffect(value: number): CardEffect {
  // Rule 13-1-3: <Support (N)> expands to the implicit activated ability:
  //   【Activate･Main】Rest this Unit → choose one OTHER friendly Unit; it
  //   gets AP+N during this turn.
  // Modeled as a regular activated effect so it flows through
  // activateAbility / pendingEffects / resolveEffect like any printed
  // ability — no bespoke move needed.
  return {
    type: "activated",
    activation: { timing: ["activate:main"] },
    cost: { restSelf: true },
    directives: [
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: value,
          duration: "thisTurn",
          target: {
            owner: "friendly",
            cardType: "unit",
            // Rule 13-1-3 Support targets a unit in the battle area. The
            // target DSL does not auto-default `zone` for units, so omit
            // this and the filter would match friendly Unit cards in
            // hand/trash/etc. — buffing cards that aren't in play.
            zone: "battleArea",
            count: 1,
            excludeSource: true,
          },
        },
      },
    ],
    sourceText: `<Support ${value}>`,
  } as CardEffect;
}

// =============================================================================
// Combat Eligibility
// =============================================================================

/**
 * Whether a unit can declare an attack this turn.
 * Rules: not exhausted, not deployed this turn (unless Link Unit), has not
 * already attacked, no "cannot-attack" restriction.
 *
 * Rule 3-2-4: newly deployed units cannot attack the turn they are deployed.
 * Rule 3-2-6-3: Link Units are exempt — they can attack the turn they are
 * deployed.
 */
export function canAttack(
  cardId: string,
  G: ReadonlyGundamG,
  cards: CardReadAPI,
  framework?: FrameworkReadAPI,
): boolean {
  const meta = cards.getMeta(cardId) as GundamCardMeta | undefined;
  if (meta?.exhausted) return false;
  if (G.exhausted[cardId]) return false;

  const deployedThisTurn = G.turnMetadata.deployedThisTurn.includes(cardId);
  if (
    deployedThisTurn &&
    !isLinkUnit(cardId, G, cards) &&
    !hasDeployTurnAttackPermission(cardId, G)
  ) {
    return false;
  }

  if (G.turnMetadata.attackedThisTurn.includes(cardId)) return false;
  if (hasRestriction(cardId, "cannot-attack", G, cards, framework)) return false;

  return true;
}

/**
 * Whether a unit can block an incoming attack.
 */
export function canBlock(cardId: string, G: ReadonlyGundamG, cards: CardReadAPI): boolean {
  const meta = cards.getMeta(cardId) as GundamCardMeta | undefined;
  if (meta?.exhausted || G.exhausted[cardId]) return false;
  if (hasRestriction(cardId, "cannot-block", G, cards)) return false;
  return true;
}

// =============================================================================
// Damage / Defeat
// =============================================================================

export function getDamage(cardId: string, G: ReadonlyGundamG): number {
  return G.damage[cardId] ?? 0;
}

/**
 * Whether a unit's accumulated damage meets or exceeds its effective HP.
 */
export function isDefeated(cardId: string, G: ReadonlyGundamG, cards: CardReadAPI): boolean {
  const damage = getDamage(cardId, G);
  const stats = getEffectiveStats(cardId, G, cards);
  return damage >= stats.hp;
}

// =============================================================================
// Resources
// =============================================================================

// =============================================================================
// Conditional Cost Reduction (rule pattern: "While X, this card's cost is -N")
// =============================================================================

function gatherCardsForHandModifierContext(
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): RuntimeCard[] {
  const zones: Zone[] = [
    "battleArea",
    "baseSection",
    "hand",
    "trash",
    "resourceArea",
    "shieldArea",
    "deck",
  ];
  const cards: RuntimeCard[] = [];
  for (const playerId of Object.keys(G.players)) {
    for (const zone of zones) {
      const ids = framework.zones.getCards({ zone, playerId });
      for (const id of ids) {
        const card = framework.cards.get(id);
        if (card) cards.push(card);
      }
    }
  }
  return cards;
}

function countHandModifierMatches(
  filter: TargetFilter,
  ctx: TargetResolutionContext,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): number {
  return evaluateTargetFilter(filter, gatherCardsForHandModifierContext(G, framework), ctx).length;
}

/**
 * Compute the effective cost of a card *while it is in hand*, factoring in:
 *
 *   1. **Self-referencing** cost modifiers — Constant `statModifier
 *      { stat: "cost" }` effects on the card itself with
 *      `target.zone: "hand" / owner: "self"` (legacy path, e.g. parser-
 *      emitted shapes). These are evaluated with the in-hand card as the
 *      source context so `selfIsColor`, `unitCount`, `cardInZone` etc.
 *      all resolve correctly.
 *
 *   2. **Self-referencing `costReduction`** — same semantics as (1) but
 *      using the dedicated `costReduction` action shape.
 *
 *   3. **External `costReduction`** — Constant effects on in-play cards
 *      (battleArea / baseSection) whose `costReduction` target filter
 *      matches the card about to be played. This is the "Friendly (AEUG)
 *      Units cost 1 less to play" pattern. The scan mirrors the structure
 *      of the `getEffectiveStats` constant-effect pass.
 *
 * @returns the base cost minus all active reductions, clamped at 0.
 */
export function computeEffectiveCostInHand(
  cardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): number {
  const definition = framework.cards.getDefinition(cardId) as Card | undefined;
  if (!definition) return 0;

  let cost = definition.cost;

  // ------------------------------------------------------------------
  // 1 & 2. Self-referencing cost modifiers / costReduction on own card
  // ------------------------------------------------------------------
  const effects = (definition.effects ?? []) as CardEffect[];
  if (effects.length > 0) {
    const ctx = buildTargetResolutionContext(G, playerId, framework, {
      sourceCardId: cardId,
    });

    for (const effect of effects) {
      if (effect.type !== "constant") continue;

      // Check whether this constant effect contains a relevant directive.
      const directives = effect.directives;
      const hasRelevant = directives.some((d) => {
        if (!("action" in d)) return false;
        const action = (d as EffectDirective).action;
        if (
          action.action === "statModifier" &&
          action.stat === "cost" &&
          action.target.zone === "hand" &&
          action.target.owner === "self"
        ) {
          return true;
        }
        if (
          action.action === "costReduction" &&
          action.target.owner === "self" &&
          action.target.zone !== "trash"
        ) {
          return true;
        }
        if (action.action === "costReductionByCount" && action.target.owner === "self") {
          return true;
        }
        return false;
      });
      if (!hasRelevant) continue;

      const conditions = effect.activation.conditions ?? [];
      const allMet = conditions.every((c) => evaluateCondition(c as EffectCondition, ctx));
      if (!allMet) continue;

      for (const d of directives) {
        if (!("action" in d)) continue;
        const action = (d as EffectDirective).action;
        if (
          action.action === "statModifier" &&
          action.stat === "cost" &&
          action.target.zone === "hand" &&
          action.target.owner === "self"
        ) {
          cost += action.amount;
        }
        if (
          action.action === "costReduction" &&
          action.target.owner === "self" &&
          action.target.zone !== "trash"
        ) {
          cost -= action.amount;
        }
        if (action.action === "costReductionByCount" && action.target.owner === "self") {
          cost -=
            action.amountPerMatch * countHandModifierMatches(action.countFilter, ctx, G, framework);
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // 3. External costReduction from in-play cards
  // ------------------------------------------------------------------
  const handCard = framework.cards.get(cardId);
  if (handCard) {
    const allPlayerIds = Object.keys(G.players);

    for (const ownerId of allPlayerIds) {
      const zonesToScan = [
        ...framework.zones.getCards({ zone: "battleArea", playerId: ownerId }),
        ...framework.zones.getCards({ zone: "baseSection", playerId: ownerId }),
      ];

      for (const sourceId of zonesToScan) {
        const sourceDef = framework.cards.getDefinition(sourceId) as Card | undefined;
        if (!sourceDef?.effects?.length) continue;

        const ctx = buildTargetResolutionContext(G, ownerId, framework, {
          sourceCardId: sourceId,
          recursionGuard: true,
        });

        for (const effect of sourceDef.effects as CardEffect[]) {
          if (effect.type !== "constant") continue;

          // Must contain at least one costReduction directive.
          const hasCostReduction = effect.directives.some((d) => {
            if (!("action" in d)) return false;
            const action = (d as EffectDirective).action;
            return action.action === "costReduction" || action.action === "costReductionByCount";
          });
          if (!hasCostReduction) continue;

          // Evaluate conditions.
          if (effect.activation.conditions?.length) {
            const allMet = effect.activation.conditions.every((cond) =>
              evaluateCondition(cond as EffectCondition, ctx),
            );
            if (!allMet) continue;
          }

          for (const d of effect.directives) {
            if (!("action" in d)) continue;
            const action = (d as EffectDirective).action;
            if (action.action !== "costReduction") continue;

            // Check if the hand card matches the target filter.
            const matched = evaluateTargetFilter(action.target, [handCard], ctx);
            if (matched.includes(cardId as CardInstanceId)) {
              cost -= action.amount;
            }
          }
        }
      }
    }
  }

  return Math.max(0, cost);
}

export function computeEffectiveCostInTrash(
  cardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): number {
  const definition = framework.cards.getDefinition(cardId) as Card | undefined;
  const runtimeCard = framework.cards.get(cardId);
  if (!definition || !runtimeCard) return 0;

  let cost = definition.cost;
  const effects = (definition.effects ?? []) as CardEffect[];
  if (effects.length === 0) return Math.max(0, cost);

  const ctx = buildTargetResolutionContext(G, playerId, framework, {
    sourceCardId: cardId,
  });

  for (const effect of effects) {
    if (effect.type !== "constant") continue;

    const conditions = effect.activation.conditions ?? [];
    const allMet = conditions.every((c) => evaluateCondition(c as EffectCondition, ctx));
    if (!allMet) continue;

    for (const d of effect.directives) {
      if (!("action" in d)) continue;
      const action = (d as EffectDirective).action;
      if (
        action.action === "statModifier" &&
        action.stat === "cost" &&
        action.target.owner === "self" &&
        action.target.zone === "trash" &&
        evaluateTargetFilter(action.target, [runtimeCard], ctx).includes(cardId as CardInstanceId)
      ) {
        cost += action.amount;
      }
      if (
        action.action === "costReduction" &&
        action.target.owner === "self" &&
        action.target.zone === "trash" &&
        evaluateTargetFilter(action.target, [runtimeCard], ctx).includes(cardId as CardInstanceId)
      ) {
        cost -= action.amount;
      }
      if (
        action.action === "costReductionByCount" &&
        action.target.owner === "self" &&
        action.target.zone === "trash" &&
        evaluateTargetFilter(action.target, [runtimeCard], ctx).includes(cardId as CardInstanceId)
      ) {
        cost -=
          action.amountPerMatch * countHandModifierMatches(action.countFilter, ctx, G, framework);
      }
    }
  }

  return Math.max(0, cost);
}

export function computeEffectiveLevelInHand(
  cardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): number {
  const definition = framework.cards.getDefinition(cardId) as Card | undefined;
  if (!definition) return 0;

  let level = definition.level;
  const effects = (definition.effects ?? []) as CardEffect[];
  if (effects.length === 0) return level;

  const ctx = buildTargetResolutionContext(G, playerId, framework, {
    sourceCardId: cardId,
  });

  for (const effect of effects) {
    if (effect.type !== "constant") continue;

    const hasRelevant = effect.directives.some((d) => {
      if (!("action" in d)) return false;
      const action = (d as EffectDirective).action;
      return action.action === "levelReductionByCount" && action.target.owner === "self";
    });
    if (!hasRelevant) continue;

    const conditions = effect.activation.conditions ?? [];
    const allMet = conditions.every((c) => evaluateCondition(c as EffectCondition, ctx));
    if (!allMet) continue;

    for (const d of effect.directives) {
      if (!("action" in d)) continue;
      const action = (d as EffectDirective).action;
      if (action.action === "levelReductionByCount" && action.target.owner === "self") {
        level -=
          action.amountPerMatch * countHandModifierMatches(action.countFilter, ctx, G, framework);
      }
    }
  }

  return Math.max(0, level);
}

/**
 * Count of active (non-exhausted) resource cards in the player's resource area.
 * Use this to check whether a player can afford a card cost.
 */
export function getAvailableResources(
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): number {
  const resourceIds = framework.zones.getCards({ zone: "resourceArea", playerId });
  return resourceIds.filter((id) => !G.exhausted[id]).length;
}

/**
 * Total number of resource cards in the player's resource area (active + exhausted).
 * This equals the player's resource level for card-level requirement checks (Rule: level =
 * count of resources in resource area).
 */
export function getResourceLevel(playerId: string, framework: FrameworkReadAPI): number {
  return framework.zones.getCardCount({ zone: "resourceArea", playerId });
}

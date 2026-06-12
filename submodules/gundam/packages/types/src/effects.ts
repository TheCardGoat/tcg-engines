import type { CardColor, CardType, KeywordEffect, KeywordEffectEntry, Zone } from "./card.ts";

// ── Duration ──────────────────────────────────────────────────────────────────
// How long a buff/debuff/grant lasts once applied.

export type EffectDuration =
  | "permanent" // While the card is in play / while the precondition holds
  | "thisTurn" // Until end of the current turn
  | "thisBattle" // Until end of the current battle
  | "whileLinked"; // While this unit is in a linked state

// ── Timing ────────────────────────────────────────────────────────────────────
// When an effect activates from a game event or player action.

export type EffectTiming =
  | "burst" // When this card's shield is flipped
  | "deploy" // When this card enters the battle area
  | "attack" // When this unit declares an attack
  | "whenPaired" // At the moment a pilot is paired with this unit
  | "whenLinked" // At the moment this unit links with a pilot
  | "destroyed" // When this card is sent to the trash by destruction
  | "whenHealed" // When this card's damage counters are reduced by a recoverHP action
  | "main" // Command card: can be played during Main Phase
  | "action" // Command card: can be played during Action Step
  | "activate:main" // Activated ability: pay cost during Main Phase
  | "activate:action" // Activated ability: pay cost during Action Step
  | "onEnemyEffectDamage" // When this unit receives enemy effect damage
  | "onEffectDamageReceived" // When a card receives effect damage
  | "onRestedByEnemyEffect" // When one of your cards is rested by an enemy effect
  | "onUnitEffectCostPaid" // When a player pays resources for one of their Unit effects
  | "onApReducedByEnemy" // When this unit's AP is reduced by an enemy effect
  | "onExResourcePlaced" // When you place an EX Resource
  | "onEnemyLinkUnitDestroyed" // When an enemy Link Unit is destroyed
  | "onDestroyByBattle" // When this Unit destroys an enemy Unit with battle damage (attacker side)
  | "onBattleDamageDealtToUnit" // When this Unit deals battle damage to an enemy Unit
  | "onRestedByEffect" // When this Unit is rested by an effect
  | "onSetActiveByEffect" // When this Unit is set active by an effect
  | "onBlocked" // When this Unit is blocked by an enemy Unit
  | "onShieldAreaCardDestroyByBattle" // When this Unit destroys an enemy shield-area card with battle damage
  | "onBattleDamageReceived" // When this card receives battle damage
  | "onDrawByEffect" // When a player draws one or more cards with an effect
  | "onSupportUsed" // When this card's <Support> increases a Unit's AP
  | "onCommandEffectActivated" // When a Command's Main/Action effect is activated
  | "endOfTurn"; // At the end of the source controller's turn

// ── Effect Type ───────────────────────────────────────────────────────────────
// Game-rule category, maps to how the engine registers the effect.

export type EffectType =
  | "constant" // Passively evaluated; no event trigger
  | "triggered" // Fires automatically when the timing event occurs
  | "activated" // Player pays a cost to fire during their turn
  | "command" // One-time resolution when a Command card is played
  | "substitution"; // Replaces a game rule rather than adding to it

// ── Activation Cost ───────────────────────────────────────────────────────────
// What the player pays to activate the effect. Kept separate from conditions
// because costs mutate game state (you pay them), while conditions are read-only checks.

export interface EffectCost {
  /** Rest the card that owns this effect (e.g. "Rest this Base：") */
  restSelf?: boolean;
  /** Number of resources to rest, shown as ② in card text */
  payResources?: number;
  /** Discard N cards from hand as cost */
  discardCount?: number;
  /** Optional hand-card restriction for discard costs like "discard 1 (Zeon) Unit card". */
  discardFilter?: TargetFilter;
  /** Rest N friendly units as cost */
  restFriendlyUnits?: number;
  /** Rest the first matching friendly card as an activation cost. */
  restTarget?: TargetFilter;
  /** Exile the first matching card from your trash as an activation cost. */
  exileFromTrash?: TargetFilter;
  /**
   * Destroy the card that owns this effect as part of paying the cost
   * (printed "Destroy this Unit：" — e.g. GD02-011 Moebius Peacemaker Team).
   *
   * Semantically a cost, not an effect action: paid up-front in `payCost`
   * before any directive resolves. Executes AFTER every other cost
   * component so any self-resting / resource-spending / discarding /
   * friendly-resting is observed before the source leaves play. In
   * practice mutually exclusive with `restSelf` (a printed cost doesn't
   * both rest and destroy the same card); if both are ever specified,
   * `destroySelf` still wins at the end.
   */
  destroySelf?: boolean;
}

// ── Restriction ───────────────────────────────────────────────────────────────
// Modifiers on when/how often an effect can activate.

export type EffectRestriction = { type: "oncePerTurn" } | { type: "optional" };

// ── Activation ────────────────────────────────────────────────────────────────
// Answers the question: WHEN does this effect activate?
// Triggered, activated, and command effects use timing. Constant and passive
// substitution effects are always evaluated and only use qualification,
// conditions, and restrictions.

export interface EffectActivation {
  /** When the effect fires. Multiple timings allowed, e.g. ["main", "action"]. */
  timing?: EffectTiming[];
  /**
   * Pilot attribute qualification for pair/link-gated effects.
   * Reuses AttributeFilter so any card attribute can be matched.
   * Undefined = any pilot qualifies (or timing doesn't involve pilot pairing).
   *
   * Example: 【When Paired･(Cyclops Team) Pilot】→ { attribute: "trait", comparison: "includes", value: "Cyclops Team" }
   */
  qualification?: AttributeFilter;
  /**
   * Board-state conditions that must all hold true (ANDed) before the effect can activate.
   * These are read-only checks — they do not mutate game state.
   */
  conditions?: EffectCondition[];
  /**
   * Meta-restrictions on activation: once-per-turn, optional, etc.
   */
  restrictions?: EffectRestriction[];
}

// ── Target Filter ─────────────────────────────────────────────────────────────
// Describes which card(s) an action targets or a condition inspects.
// Answers the question: TO WHOM does this effect apply?

export type TargetOwner = "self" | "friendly" | "opponent" | "any";

/**
 * A numeric reference to a stat on the effect's source card.
 *
 * Used as the `value` of a numeric AttributeFilter to express card text like
 * "enemy Unit whose Lv. is equal to or lower than this Unit" — the RHS of
 * the comparison is resolved at evaluation time from the source card's own
 * stat rather than a printed literal.
 *
 * For pilot-resident effects, "this Unit" refers to the paired unit (rule
 * 3-3-9-1); the engine reads via `ctx.selfIdentityCardId`, which is rebound
 * to the paired unit by `buildTargetResolutionContext`.
 */
export interface SourceStatRef {
  ref: "source" | "eventSource";
  stat: "hp" | "ap" | "cost" | "level";
}

/**
 * Structured attribute predicate for TargetFilter.
 *
 * Numeric attributes (hp, ap, cost, level) support ordered comparisons.
 * Single-value string attributes (color, zone, name) support equality checks.
 * Array string attributes (trait) support membership checks.
 *
 * The `or` variant composes a logical-OR of nested predicates. Because the
 * outer `attributeFilters` list is ANDed together, nesting `or` inside that
 * list gives full mixed AND/OR expressive power — e.g. "(Zeon) OR (Neo Zeon)
 * Unit with Lv.4 or lower" becomes a two-element list: `[OR{Zeon,NeoZeon}, lvLte4]`.
 */
export type AttributeFilter =
  | {
      attribute: "hp" | "ap" | "cost" | "level";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      /**
       * A printed numeric literal, OR a `SourceStatRef` sentinel that resolves
       * to a stat on the effect source at evaluation time. See `SourceStatRef`.
       */
      value: number | SourceStatRef;
    }
  | {
      attribute: "color" | "zone";
      comparison: "eq" | "neq";
      value: string;
    }
  | {
      attribute: "name";
      comparison: "eq" | "neq" | "includes" | "excludes";
      value: string;
    }
  | {
      attribute: "trait";
      comparison: "includes" | "excludes";
      value: string;
    }
  | {
      /**
       * Match cards that carry an effect with the given activation timing,
       * e.g. "enemy Unit with a 【Destroyed】 effect".
       */
      attribute: "effectTiming";
      comparison: "includes" | "excludes";
      value: EffectTiming;
    }
  | {
      /**
       * "Unit (is paired with) / (has no paired) Pilot" predicate. `value:
       * true` matches a Unit currently paired with any Pilot; `value:
       * false` matches a Unit with no paired Pilot. Returns false for
       * non-unit cards (only units carry pair state).
       */
      attribute: "paired";
      comparison: "eq";
      value: boolean;
    }
  | {
      /**
       * "Unit paired with an (X)-trait Pilot" predicate. Matches a Unit
       * whose currently paired Pilot's traits list includes the named
       * trait (case-insensitive). With `comparison: "excludes"`, matches
       * a Unit that is either unpaired OR whose paired Pilot lacks the
       * trait. Returns false for non-unit cards.
       */
      attribute: "pairedPilotTrait";
      comparison: "includes" | "excludes";
      value: string;
    }
  | {
      /**
       * "Pilot paired with a Unit whose level is N" predicate. Matches a
       * Pilot in play by looking up the Unit currently paired to it.
       * Returns false for non-pilot cards or unpaired pilots.
       */
      attribute: "pairedUnitLevel";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      value: number | SourceStatRef;
    }
  | {
      /**
       * Logical-OR composition of nested attribute predicates.
       * Matches when ANY of the `filters` matches. Nestable.
       *
       * Example — "(Zeon) OR (Neo Zeon) Unit":
       *   { attribute: "or", filters: [
       *       { attribute: "trait", comparison: "includes", value: "zeon" },
       *       { attribute: "trait", comparison: "includes", value: "neo zeon" },
       *   ]}
       */
      attribute: "or";
      filters: AttributeFilter[];
    };

export interface TargetFilter {
  owner: TargetOwner;
  cardType?: CardType | CardType[];
  /** "Choose 1" → count: 1 | "Choose 1 to 2" → count: { min: 1, max: 2 } | "All" → count: "all" */
  count?: number | "all" | { min: number; max: number };
  state?:
    | "rested"
    | "active"
    | "damaged"
    | "undamaged"
    | readonly ("rested" | "active" | "damaged" | "undamaged")[];
  /**
   * Zone the target must be in. When absent, defaults to BattleArea for units.
   * Used for effects like "this card in your hand gets cost -1".
   */
  zone?: Zone;
  /** Structured attribute predicates, ANDed together */
  attributeFilters?: AttributeFilter[];
  /** Restrict matches to cards with the highest value of this numeric property among candidates. */
  highest?: "level" | "cost" | "ap" | "hp";
  /** Restrict matches to cards with the lowest value of this numeric property among candidates. */
  lowest?: "level" | "cost" | "ap" | "hp";
  hasKeyword?: KeywordEffect;
  hasAnyKeyword?: boolean;
  isLinkUnit?: boolean;
  isToken?: boolean;
  /**
   * When true, the card owning the effect (the source) is excluded from
   * the candidate set. Used by "choose one OTHER friendly unit" phrasings
   * — Support (rule 13-1-3), "another friendly unit" activated abilities,
   * etc. Relies on the target-DSL context's `sourceCardId` to identify
   * the source at evaluation time.
   */
  excludeSource?: boolean;
  /**
   * Combat-participation predicate for "battling" phrasings.
   *
   * - `true`  → card must be one of the two combatants in the current
   *             attack (`g.turnMetadata.pendingCombat.attackerId` or,
   *             when the target is a card rather than `"direct"`, the
   *             defending unit's id). On a direct attack the defender is
   *             a player rather than a card, but damage is routed by rule
   *             8-5-2-1 at the defender's Base (if any) and otherwise at
   *             shields — the resolver mirrors that routing, so the
   *             defender's baseSection card(s) (when present) or
   *             shieldArea cards (otherwise) also match `true`.
   * - `false` → card must NOT be a combatant in the current attack.
   * - omitted → no constraint (default).
   *
   * When no combat is in progress the battling set is empty: `true`
   * matches nothing and `false` matches every card. Composes naturally
   * with `owner` — e.g. `{ owner: "opponent", isBattling: true }` picks
   * the enemy unit currently in combat with the source, the canonical
   * "battling enemy Unit" phrasing (Carta's Graze Ritter GD02-073,
   * Moebius Peacemaker Team GD02-011, Heart Set on Revenge GD02-118).
   *
   * Object form `{ opponentMatches: <sub-filter> }` — card is battling AND
   * its current opponent matches `<sub-filter>`. Used for phrasing like
   * "battling a Unit with <Blocker>" where the constraint applies to the
   * combatant facing this card, not this card itself. Sub-filter must not
   * nest another `isBattling.opponentMatches` (depth-of-1 only).
   */
  isBattling?: boolean | { opponentMatches: TargetFilter };
}

// ── Token Spec ────────────────────────────────────────────────────────────────
// Inline token definition found in card text:
// [Gundam]((White Base Team)·AP3·HP3) → { name:"Gundam", traits:["white base team"], ap:3, hp:3 }

export interface TokenSpec {
  name: string;
  traits: string[];
  ap: number;
  hp: number;
  keywordEffects?: KeywordEffectEntry[];
  /** Static token text: "This Unit can't choose the enemy player as its attack target." */
  cantTargetPlayer?: boolean;
  deployState: "active" | "rested";
  /**
   * Card number of the printed token card backing this token (e.g.
   * "T-001" for the Gundam token from White Base). When present, the
   * `deployToken` handler registers the printed card definition from
   * the catalog so the simulator's CDN image pipeline can resolve real
   * artwork. Absent → handler falls back to a synthetic UnitCard def
   * built from the inline TokenSpec, which renders only the tinted
   * fallback (no image).
   */
  printedCardNumber?: string;
}

// ── Conditions ────────────────────────────────────────────────────────────────
// Discriminated union. Engine switches on `type` to evaluate board state.
// These are read-only checks — they never mutate game state.

export type EffectCondition =
  | {
      type: "unitCount";
      owner: "friendly" | "opponent";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      count: number;
      /**
       * Trait predicate. A single string matches cards whose trait list
       * includes that trait (case-insensitive). An array matches cards
       * carrying ANY one of the listed traits (OR semantics) — used for
       * "(Zeon)/(Neo Zeon) Units" and similar faction-OR preconditions.
       * An empty array matches nothing.
       */
      hasTrait?: string | readonly string[];
      isToken?: boolean;
      /** True when "another" is used — the unit owning this effect is excluded from the count */
      excludeSelf?: boolean;
      /** True when the condition targets link units specifically */
      isLinkUnit?: boolean;
      /** Filter by exhaustion state — "rested" or "active" */
      state?: "rested" | "active";
    }
  | {
      type: "cardInZone";
      owner: "friendly" | "opponent";
      zone: Zone;
      cardType?: CardType;
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      count: number;
      /**
       * Trait predicate. A single string matches cards whose trait list
       * includes that trait (case-insensitive). An array matches cards
       * carrying ANY one of the listed traits (OR semantics) — e.g.
       * "(Zeon)/(Neo Zeon) Unit cards in your trash". An empty array
       * matches nothing.
       */
      hasTrait?: string | readonly string[];
      /** Match cards with the specified color. Resources and tokens without color do not match. */
      hasColor?: CardColor;
      /** Match cards whose name contains this substring (case-insensitive) */
      hasName?: string;
      /** Structured attribute predicates, ANDed together */
      attributeFilters?: AttributeFilter[];
    }
  | {
      type: "deployedThisTurnCount";
      owner: "friendly" | "opponent";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      count: number;
      cardType?: CardType;
      hasTrait?: string | readonly string[];
      attributeFilters?: AttributeFilter[];
    }
  | {
      type: "handCount";
      owner: "friendly" | "opponent";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      count: number;
    }
  | { type: "selfIsDamaged" }
  | { type: "selfIsAttacking" }
  | { type: "selfIsUnpaired" }
  | {
      /**
       * 【During Pair】 — true while this Unit has a paired Pilot.
       *
       * For pilot-resident effects, "this Unit" resolves to the paired
       * unit via `selfIdentityCardId` (rule 3-3-9-1). This encodes rules
       * 13-2-10-1 / 13-2-10-2 as a continuous state gate rather than as
       * an activation timing.
       */
      type: "duringPair";
    }
  | {
      /**
       * 【During Link】 — true while this Unit is linked with a Pilot that
       * satisfies its link condition.
       *
       * For pilot-resident effects, "this Unit" resolves to the paired
       * unit via `selfIdentityCardId` (rule 3-3-9-1). This encodes rules
       * 13-2-12-1 / 13-2-12-2 as a continuous state gate rather than as
       * an activation timing.
       */
      type: "duringLink";
    }
  | {
      /**
       * "While this Unit is rested" — true when the source card (or, for
       * pilot-resident effects, the paired unit it identifies as) is in
       * the rested (exhausted) state. Returns false for cards that have
       * no rest state (commands, resources, pilots without a paired unit).
       */
      type: "selfIsRested";
    }
  | {
      /**
       * "While this Unit is active" — the inverse of `selfIsRested`.
       * Returns false for cards that have no rest state.
       */
      type: "selfIsActive";
    }
  | {
      /**
       * True when the source unit is attacking an opposing Unit, not the enemy player.
       * Reads `pendingCombat.target` and returns false for direct attacks.
       */
      type: "isAttackingUnit";
    }
  | {
      /**
       * True when the source unit is the attacker and the attack target is
       * the opposing player (i.e. a "direct" attack). Reads
       * `pendingCombat.target === "direct"` combined with
       * `isAttacking(self)`. Returns false when no combat is in progress,
       * the source is not the attacker, or the attack targets a unit.
       */
      type: "isAttackingPlayer";
    }
  | { type: "selfHasKeyword"; keyword: KeywordEffect }
  | { type: "selfHasTrait"; trait: string }
  | {
      /**
       * True when the source Unit is paired with a Pilot carrying the named
       * trait. For pilot-resident effects, "self" resolves to the paired
       * unit via rule 3-3-9-1 before checking that unit's paired Pilot.
       */
      type: "selfPairedPilotHasTrait";
      trait: string;
    }
  | {
      /**
       * True when the source Unit is paired with a Pilot of the specified
       * color. For pilot-resident effects, "self" resolves to the paired
       * unit before checking that unit's paired Pilot.
       */
      type: "selfPairedPilotHasColor";
      color: CardColor;
    }
  | {
      /**
       * True when the source card's current Deploy trigger came from the
       * specified zone. Used by text such as "If you deploy this Unit from
       * your trash...". Only meaningful on deploy-timed effects.
       */
      type: "deployedFromZone";
      zone: Zone;
    }
  | {
      /**
       * True when the event that triggered this effect references "this Unit".
       * For pilot-resident effects, "this Unit" resolves to the paired unit
       * via rule 3-3-9-1.
       */
      type: "eventCardIsSelf";
    }
  | {
      /**
       * True when the event that triggered this effect was caused by "this Unit".
       * For pilot-resident effects, "this Unit" resolves to the paired unit
       * via rule 3-3-9-1.
       */
      type: "eventSourceIsSelf";
    }
  | {
      /**
       * True when the card referenced by the triggering event matches the
       * supplied filter. Used by observer text such as "when one of your
       * (Tekkadan)/(Teiwaz) Units receives effect damage".
       */
      type: "eventCardMatches";
      target: TargetFilter;
    }
  | {
      /**
       * True when the card that caused the triggering event matches the
       * supplied filter. Used by "when your Unit deals battle damage..."
       * observer text.
       */
      type: "eventSourceMatches";
      target: TargetFilter;
    }
  | {
      /**
       * True when the triggering event's player is the source controller.
       * Used by "when you ..." event text.
       */
      type: "eventPlayerIsSelf";
    }
  | {
      /**
       * True when the triggering event's player is the source controller's opponent.
       * Used by text like "by one of your opponent's effects".
       */
      type: "eventPlayerIsOpponent";
    }
  | {
      /** Compares the number of EX Resources used by the triggering event. */
      type: "eventPaidExResources";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      count: number;
    }
  | {
      /** True when the damage event came from the source controller's opponent. */
      type: "eventDamageSourceIsOpponent";
    }
  | {
      /**
       * "the unit this pilot is linked to has trait X" — evaluated against
       * the paired unit's trait list when the effect source is a pilot.
       * A single string matches when the linked unit carries that trait;
       * an array matches when the linked unit carries ANY of the listed
       * traits (OR semantics — mirrors PR #118's trait-OR shape).
       *
       * Returns false when the source is not a pilot, the pilot is not
       * paired, or the linked unit carries none of the specified traits.
       * An empty array matches nothing (deliberately vacuously false, to
       * avoid card-data bugs producing an always-true gate).
       *
       * Case-insensitive, matching `selfHasTrait` / `AttributeFilter.trait`.
       */
      type: "linkedUnitHasTrait";
      trait: string | readonly string[];
    }
  | {
      /**
       * True when the linked unit's color matches the specified value.
       *
       * Semantics mirror `linkedUnitHasTrait`: resolves via the
       * pilot-rebound `selfIdentityCardId` (rule 3-3-9-1) and is false
       * when the source is not a pilot, the pilot is not paired, or the
       * linked unit's color does not match.
       */
      type: "linkedUnitHasColor";
      color: CardColor;
    }
  | { type: "selfIsColor"; color: CardColor }
  | {
      /** "this Unit has 5 or more AP" — checks a stat on the card owning this effect */
      type: "selfStat";
      stat: "ap" | "hp";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      value: number;
    }
  | { type: "isTurn"; whose: "friendly" | "opponent" }
  | {
      type: "playerLevel";
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      value: number;
    }
  | { type: "friendlyBaseInPlay"; color?: CardColor; hasTrait?: string }
  | { type: "enemyLinkUnitDestroyedDuringAttack" }
  | {
      /** Compound condition: all sub-conditions must hold */
      type: "and";
      conditions: EffectCondition[];
    };

// ── Actions ───────────────────────────────────────────────────────────────────
// Discriminated union — every variant is fully typed.
// Answers the question: WHAT happens?

export type EffectAction =
  | { action: "draw"; count: number }
  | { action: "drawIfTargetMatches"; count: number; target: TargetFilter }
  | { action: "drawAll"; count: number }
  | {
      /** Effect-step resource payment for text like "You may pay ①. If you do..." */
      action: "payResources";
      count: number;
    }
  | {
      /**
       * Create a temporary trigger that watches a later game event during
       * the declared duration, then resolves `effect` if the event's card
       * matches `eventCardFilter`.
       */
      action: "createDelayedTrigger";
      duration: EffectDuration;
      eventType: "attackerDestroyedDefender" | "battleDamageDealtToUnit";
      eventCardFilter: TargetFilter;
      eventSourceFilter?: TargetFilter;
      effect: CardEffect;
    }
  | {
      /** Continuous replacement: matching Units enter the battle area rested. */
      action: "deployRested";
      target: TargetFilter;
    }
  | {
      action: "discard";
      count: number;
      /** Optional hand-card restriction for text like "discard 1 red card". */
      filter?: TargetFilter;
    }
  | { action: "millDeckThenDrawIfTrait"; count: number; trait: string; drawCount: number }
  | {
      action: "millDeckThenDamageIfTrait";
      count: number;
      owner: TargetOwner;
      traits: string | readonly string[];
      damage: number;
      target: TargetFilter;
    }
  | {
      action: "millDeckThenDamageByTraitCount";
      count: number;
      owner: TargetOwner;
      traits: string | readonly string[];
      target: TargetFilter;
    }
  | {
      action: "millDeckThenStatModifierIfTrait";
      count: number;
      owner: TargetOwner;
      traits: string | readonly string[];
      stat: "ap" | "hp";
      amount: number;
      duration: EffectDuration;
      target: TargetFilter;
    }
  | {
      /**
       * Apply a stat modifier whose magnitude is `amountPerMatch` multiplied
       * by the number of cards matching `countFilter`.
       */
      action: "statModifierByCount";
      countFilter: TargetFilter;
      stat: "ap" | "hp";
      amountPerMatch: number;
      duration: EffectDuration;
      target: TargetFilter;
    }
  | {
      /**
       * Apply a stat modifier whose magnitude is `amountPerUniqueName`
       * multiplied by the number of distinct card names matching
       * `countFilter`.
       */
      action: "statModifierByUniqueNameCount";
      countFilter: TargetFilter;
      stat: "ap" | "hp";
      amountPerUniqueName: number;
      duration: EffectDuration;
      target: TargetFilter;
    }
  | { action: "dealDamage"; amount: number; target: TargetFilter }
  | {
      /**
       * Deal damage, then draw only if a Unit damaged by this action is
       * destroyed by that damage.
       */
      action: "dealDamageThenDrawIfDestroyed";
      amount: number;
      target: TargetFilter;
      drawCount: number;
    }
  | {
      /**
       * Deal damage to the card that caused the triggering event.
       * Used for "that Unit" retaliation text after battle damage.
       */
      action: "dealDamageEventSource";
      amount: number;
      sourceFilter?: TargetFilter;
    }
  | {
      /**
       * Destroy the card referenced by the triggering event.
       * Used for "when this Unit deals battle damage to an enemy Unit,
       * destroy that Unit."
       */
      action: "destroyEventCard";
    }
  | {
      /**
       * Return the card referenced by the triggering event to its owner's hand.
       * Used for "when this Unit deals battle damage to an enemy Unit,
       * return that Unit to its owner's hand."
       */
      action: "returnEventCardToHand";
    }
  | {
      /**
       * Deal damage equal to the number of cards matching `countFilter`.
       * Used by effects such as "damage equal to the number of friendly
       * Unit tokens in play".
       */
      action: "dealDamageByCount";
      countFilter: TargetFilter;
      target: TargetFilter;
    }
  | {
      /**
       * Deal damage based on the source Unit's effective stat. `divisor`
       * models "for each N AP/HP" by flooring stat / divisor.
       */
      action: "dealDamageBySourceStat";
      stat: "ap" | "hp";
      divisor: number;
      damagePerStep: number;
      target: TargetFilter;
    }
  | {
      /**
       * Deal damage to a target whose level is equal to or lower than the
       * Unit selected by an earlier directive in the same effect.
       */
      action: "dealDamageByChosenUnitLevel";
      amount: number;
      referenceTarget: TargetFilter;
      target: TargetFilter;
    }
  | { action: "dealDamageAll"; amount: number; target: TargetFilter }
  | { action: "recoverHP"; amount: number; target: TargetFilter }
  | {
      /**
       * Recover HP from the card referenced by the triggering event.
       * Used by observer text such as "that friendly Unit may recover 2 HP"
       * after a battle-destroy event.
       */
      action: "recoverHPEventCard";
      amount: number;
      sourceFilter?: TargetFilter;
    }
  | { action: "rest"; target: TargetFilter }
  | { action: "setActive"; target: TargetFilter }
  /** "Change the attack target of the battling enemy Unit to it." */
  | { action: "changeAttackTarget"; target: TargetFilter }
  | { action: "returnToHand"; target: TargetFilter }
  /** Return the Pilot that was paired with the triggering Unit to its owner's hand. */
  | { action: "returnPairedPilotToHand" }
  | {
      action: "returnToDeck";
      target: TargetFilter;
      position: "top" | "bottom";
      /** Shuffle each affected owner's deck after the return completes. */
      shuffle?: boolean;
    }
  | { action: "destroy"; target: TargetFilter }
  | { action: "destroyEventCard" }
  | { action: "exile"; target: TargetFilter }
  | { action: "deploy"; target: TargetFilter }
  /**
   * "Place the top N cards of the specified player's deck into that player's trash."
   *
   * Mill semantics — see Freeden (GD02-127) 【Destroyed】. `owner` follows the
   * same resolution semantics as other actions:
   *   - `"self"` / `"friendly"` → source controller's deck → own trash
   *   - `"opponent"` → opponent's deck → opponent's trash
   *   - `"any"` → treated as `"self"` (no printed card currently uses `"any"`
   *     for mill; included only for union parity with other actions).
   *
   * `count` greater than the remaining deck is clamped — the handler mills
   * whatever's left and never crashes on an empty / short deck.
   */
  | { action: "millDeck"; count: number; owner: TargetOwner }
  | {
      action: "deployFromTrash";
      target?: TargetFilter;
      levelAtMost?: number;
      /** If true, the player must pay the card's printed cost */
      payCost: boolean;
    }
  | { action: "deployToken"; token: TokenSpec; count?: number }
  /** "Add this card to your hand." — universal Burst clause on Pilots/Commands */
  | { action: "addSelfToHand" }
  /** "Deploy this card." — Base Burst clause */
  | { action: "deploySelf" }
  | { action: "addShieldToHand"; count: number }
  | { action: "addFromTrash"; target: TargetFilter }
  | {
      action: "placeResource";
      resourceType: "EX" | "normal";
      state: "active" | "rested";
    }
  | {
      /**
       * Place new EX Resource token(s) into the source controller's resource
       * area. Unlike legacy `placeResource`, this does not move the source
       * card itself.
       */
      action: "placeExResource";
      count?: number;
      state: "active" | "rested";
    }
  | {
      /** Deploy new EX Base token(s) into the source controller's base section. */
      action: "deployExBase";
      count?: number;
    }
  | {
      action: "lookAtTopDeck";
      count: number;
      return: "topAndBottom" | "chooseTop" | "topOrTrash";
      /**
       * Destination for revealed cards not selected to stay on top when
       * `return: "chooseTop"` models "return 1 to the top. Place the
       * remaining card(s) ...". When set, the first remaining revealed
       * card stays on top and the rest move to this destination. Omit for
       * legacy tutor-style effects that return all non-tutored cards to
       * the deck bottom.
       */
      remainingDestination?: "bottom" | "trash";
      /** If present, player may reveal a matching card and add it to hand */
      tutorFilter?: TargetFilter;
      /** Where a tutored matching card goes. Defaults to hand. */
      tutorDestination?: "hand" | "battleArea";
    }
  /** "Activate this card's 【Main】." — Burst redirects to another timing */
  | { action: "activateTiming"; timing: "main" | "action" }
  | { action: "pairPilot"; target: TargetFilter }
  | { action: "pairEventCardAsPilot"; target: TargetFilter }
  | {
      action: "grantKeyword";
      keyword: KeywordEffect;
      /** The keyword's numeric parameter, e.g. 3 in <Breach 3> */
      keywordValue?: number;
      duration: EffectDuration;
      target: TargetFilter;
    }
  | {
      /** Copy printed keyword effects from a chosen source card onto target. */
      action: "copyKeywordEffects";
      source: TargetFilter;
      target: TargetFilter;
      duration: EffectDuration;
    }
  | {
      action: "grantTrait";
      trait: string;
      duration: EffectDuration;
      target: TargetFilter;
    }
  | {
      action: "statModifier";
      stat: "ap" | "hp" | "cost";
      amount: number;
      duration: EffectDuration;
      target: TargetFilter;
    }
  | {
      /**
       * Modify a stat by the resource count carried on the triggering
       * `unitEffectCostPaid` event. Used by text like "increase AP by an
       * amount equal to the cost paid."
       */
      action: "statModifierByEventPaidCost";
      stat: "ap" | "hp";
      duration: EffectDuration;
      target: TargetFilter;
    }
  /**
   * "This Unit's AP can't be reduced by enemy effects."
   *
   * `source` narrows which effects are blocked:
   *   - `"enemy"` — only reductions originating from the opponent are blocked.
   *   - omitted / undefined — ALL reductions are blocked (legacy behaviour).
   */
  | { action: "preventStatReduction"; stat: "ap" | "hp"; target: TargetFilter; source?: "enemy" }
  /**
   * "can't receive battle damage from enemy Units with N or less AP"
   *
   * `damageType` narrows to battle-only or effect-only damage. When
   * absent, ALL damage from matching sources is prevented (legacy
   * behaviour).
   *
   * `sourceCardType` narrows the source to a specific card type — used
   * by "can't receive effect damage from enemy Commands" (Gundam Leopard
   * GD02-064). When absent, any card type qualifies.
   */
  | {
      action: "preventDamage";
      target: TargetFilter;
      unitFilter?: TargetFilter;
      damageType?: "battle" | "effect";
      sourceCardType?: CardType;
      /**
       * How long the prevention persists. Defaults to "permanent" when
       * omitted (preserves the original handler behavior). Cards printing
       * "during this turn" / "during this battle" set the field
       * explicitly so the entry expires on the right cleanup boundary.
       */
      duration?: EffectDuration;
    }
  | {
      /**
       * Reduce the next damage the target receives. `exResourceAmount`
       * applies instead of `amount` when the resolving Command was paid
       * with one or more EX Resources.
       */
      action: "reduceNextDamage";
      amount: number;
      exResourceAmount?: number;
      target: TargetFilter;
      damageType?: "battle" | "effect";
      source?: "enemy";
      duration: EffectDuration;
    }
  | {
      /** Battle damage the target would receive is dealt to redirectTo instead. */
      action: "redirectBattleDamage";
      target: TargetFilter;
      redirectTo: TargetFilter;
      duration: EffectDuration;
    }
  | {
      /** "can't be destroyed by enemy effects" */
      action: "preventDestroy";
      target: TargetFilter;
      source?: "enemy";
      duration: EffectDuration;
    }
  /** "it may choose an active enemy Unit that is Lv.N or lower as its attack target" */
  | {
      action: "chooseAttackTarget";
      unit: TargetFilter;
      /** Alternate `unit.count` when this Command was paid with an EX Resource. */
      exResourceUnitCount?: TargetFilter["count"];
      attackTarget: TargetFilter;
      /** How long the option persists. Defaults to "permanent" when omitted. */
      duration?: EffectDuration;
    }
  /** "Enemy Units must choose that Unit as their attack target when attacking." */
  | {
      action: "forceAttackTarget";
      unit: TargetFilter;
      attackTarget: TargetFilter;
      /** How long the restriction persists. Defaults to "permanent" when omitted. */
      duration?: EffectDuration;
    }
  /** "It won't be set as active during the start phase of your opponent's next turn." */
  | { action: "preventActive"; target: TargetFilter }
  /** "It can't attack during this turn" */
  | { action: "cantAttack"; duration: EffectDuration; target: TargetFilter }
  /** "It may attack on the turn it is deployed." */
  | { action: "allowAttackDeployedThisTurn"; duration: EffectDuration; target: TargetFilter }
  /** "This Unit can't choose the enemy player as its attack target." */
  | { action: "cantTargetPlayer"; whose: "opponent" | "friendly" }
  /**
   * Static unit restrictions that do not fit target modifiers.
   *
   * Used by token/setup text such as "This Unit can't be paired with a
   * Pilot" and "This Unit can't be set as active or paired with a Pilot."
   * The engine may enforce individual restrictions separately; the parser
   * keeps the printed text structured instead of dropping it.
   */
  | {
      action: "restrictUnit";
      target: TargetFilter;
      restrictions: ("cannotSetActive" | "cannotPairPilot")[];
      duration?: EffectDuration;
    }
  /**
   * Prevents destruction matching a source/effect class.
   *
   * Represents text such as "friendly Units can't be destroyed by enemy
   * effects during this turn." This is intentionally separate from
   * `preventDamage`, because the card is allowed to receive damage; only
   * the destruction event is blocked.
   */
  | {
      action: "preventDestruction";
      target: TargetFilter;
      source?: "enemy";
      cause?: "effect" | "battle";
      duration?: EffectDuration;
    }
  /**
   * "your shield area cards can't receive damage from enemy Units that are Lv.N or lower"
   * Protects all cards in a zone from damage dealt by a filtered set of units.
   */
  | {
      action: "preventDamageToZone";
      zone: Zone;
      unitFilter: TargetFilter;
      duration: EffectDuration;
    }
  /**
   * Constant-effect cost reduction for play-from-hand.
   *
   * A card in play (or in hand, targeting itself) declares that cards
   * matching `target` cost `amount` less to play.  `amount` is a
   * positive integer (the engine subtracts it).
   *
   * Consumed by `computeEffectiveCostInHand` — never pushed into
   * `G.continuousEffects` or handled by the executor.
   *
   * Examples:
   *   - "Friendly (Earth Federation) Units cost 1 less to play"
   *   - "While …, this card in your hand gets cost -1"
   */
  | { action: "costReduction"; amount: number; target: TargetFilter }
  | {
      action: "costReductionByCount";
      amountPerMatch: number;
      countFilter: TargetFilter;
      target: TargetFilter;
    }
  | {
      action: "levelReductionByCount";
      amountPerMatch: number;
      countFilter: TargetFilter;
      target: TargetFilter;
    }
  /**
   * Lossless parser fallback for card text that is not yet executable.
   *
   * This keeps generated structured JSON faithful to the source card text
   * while making the remaining parser/engine work explicit. Runtime
   * execution currently skips this action; follow-up parser passes should
   * replace it with narrower action variants.
   */
  | { action: "unparsedText"; text: string };

// ── Directives ────────────────────────────────────────────────────────────────
// A directive is a single thing that happens as part of an effect.
// It wraps an action with an optional flag ("you may") and carries the
// instruction for WHAT happens.

export interface EffectDirective {
  /** The action to perform */
  action: EffectAction;
  /**
   * True when the directive is optional ("you may" in card text).
   * The player can choose to skip this directive without failing the effect.
   */
  optional?: boolean;
  /**
   * True when this directive's execution depends on the **immediately
   * preceding** directive actually having **resolved** ("If you do, ..." in
   * card text). Encodes the card-text connective phrase as an inter-directive
   * dependency so the executor can skip this directive when the predecessor
   * did not actually produce an effect.
   *
   * "Resolved" — per action kind — means:
   *   - Optional (`optional: true`): controller opted in AND the action's
   *     own "resolved" check below passes. Declined ⇒ not resolved.
   *   - Mandatory: action's "resolved" check passes.
   *   - Targeted actions (`dealDamage`, `destroy`, `rest`, `setActive`,
   *     `returnToHand`, `returnToDeck`, `exile`, `deploy`, `recoverHP`, `addFromTrash`,
   *     `pairPilot`, `grantKeyword`, `statModifier`, `preventDamage`,
   *     `cantAttack`, `preventStatReduction`, `chooseAttackTarget`,
   *     `dealDamageAll`): resolved iff at least one legal target was
   *     actually picked (after `chosenTargets` intersection and `count`
   *     clamp). "No legal target" ⇒ not resolved.
   *   - Zone-level / non-targeted actions that always report resolved
   *     (`draw`, `discard`, `addSelfToHand`, `addShieldToHand`,
   *     `deploySelf`, `deployToken`, `deployFromTrash`, `placeResource`,
   *     `lookAtTopDeck`, `activateTiming`, `preventDamageToZone`):
   *     resolved = true. Note: several of these can be _effective_
   *     no-ops when the relevant zone is empty (empty deck/hand/shields,
   *     trash with no valid Unit, no room for a resource). The
   *     "resolved" flag is kept `true` in those cases for predictability
   *     — the printed card text for every known `dependsOnPrevious`
   *     pairing chains off an _optional_ predecessor (see Skip rules
   *     below), so declining the optional already covers the observable
   *     "nothing happened" branch. Clauses that need finer-grained
   *     gating on zone emptiness should model it via an explicit
   *     `EffectCondition` rather than relying on `dependsOnPrevious`.
   *
   * Skip rules:
   *   - Preceding resolved: this directive runs.
   *   - Preceding not resolved (optional declined OR targeted with no
   *     legal targets): this directive is skipped.
   *   - No prior directive in the same list OR prior was a conditional
   *     branch: this directive still runs, but the executor emits a
   *     console warning (card-data bug tolerant).
   *
   * Scope: single list level — the effect's top-level `directives` array,
   * or within a single `thenDirectives` / `elseDirectives` list inside a
   * `ConditionalDirective`. Nesting "If you do" across branches is not
   * modelled; card text that would require it should be restructured into
   * a `ConditionalDirective`.
   *
   * Rule anchor: "If you do" is not a rulebook primitive, but it appears
   * across many cards (Zedas GD02-057, Gundam Mk-II Titans GD02-003,
   * Rick Dias Red GD02-075, Ryusei-Go GD02-058, Quattro Bajeena GD02-098,
   * Gwadan GD02-125, etc.) and always refers back to whether the
   * preceding directive actually resolved.
   */
  dependsOnPrevious?: boolean;
}

// ── Conditional Directive ─────────────────────────────────────────────────────
// if/then/else tree within an effect's directives.

export interface ConditionalDirective {
  condition: EffectCondition;
  thenDirectives: Directive[];
  elseDirectives?: Directive[];
}

// ── Choose-One Directive ──────────────────────────────────────────────────────
// Modal "do A or B" effects (e.g. ST04-012 Striker Pack: "deploy 1 [Sword
// Strike] or 1 [Launcher Strike]"). The controller picks exactly one option
// at resolution time; the executor runs only that option's directives.
//
// Distinct from `optional` (single skippable directive — allows neither/both
// when combined with another optional) and from `ConditionalDirective` (game-
// state branch, not player choice). Modelled as a player-input primitive so
// the choice is surfaced through the same pending-effect halt machinery as
// target selection and "you may" prompts.
//
// === Authoring constraints (read before nesting prompts inside options) ===
//
//   1. **No nested player-input directives inside an option.** The pending-
//      effect queue halts on a chooseOne, the controller answers via
//      `resolveEffect({ chooseOneAnswers })`, and the executor then runs
//      the chosen branch in one pass. A nested `optional`, counted target
//      selection, or another `chooseOne` inside an option WILL NOT halt a
//      second time — the executor silently defaults (option 0 / accept /
//      no-target). If a card prints "Choose one: [draw 1] / [destroy a unit;
//      then choose one of your units to take 1 damage]", the engine cannot
//      represent the inner choice today; flag it for a multi-pass refactor
//      rather than encoding a hidden default.
//
//   2. **`chooseOneAnswers` is keyed by top-level directive index.** Same
//      semantics as `optionalAnswers`: nested directives inherit the index
//      of the enclosing top-level entry. Two `chooseOne`s nested inside
//      the same top-level conditional/branch would collide on the key.
//      Place each `chooseOne` at its own top-level slot in the effect's
//      `directives` array if more than one is needed.

export interface ChooseOneOption {
  /** Short label for UI / logs (e.g. "Sword Strike Gundam"). */
  label?: string;
  /**
   * Directives to execute if this option is picked. See the authoring
   * constraints on `ChooseOneDirective` — these directives must NOT
   * contain further player-input prompts (nested `optional`, counted
   * target selection, or another `chooseOne`); the executor cannot
   * halt a second time after the modal answer.
   */
  directives: Directive[];
}

export interface ChooseOneDirective {
  kind: "chooseOne";
  /** At least two options must be present — a single-option chooseOne is a card-data bug. */
  options: ChooseOneOption[];
}

/** A directive is either a direct action, a conditional branch, or a choose-one prompt. */
export type Directive = EffectDirective | ConditionalDirective | ChooseOneDirective;

// ── Pilot Keyword ─────────────────────────────────────────────────────────────
// Found on Command cards: 【Pilot】[Name]

export interface PilotKeyword {
  pilotName: string;
}

// ── Card Effect ───────────────────────────────────────────────────────────────
// One 【Keyword】...text block on a card = one CardEffect entry.
// Cards with multiple blocks have multiple entries in their effects[] array.
//
// Three pillars:
//   WHEN  → activation (timing when applicable, qualification, conditions, restrictions) + cost
//   WHAT  → directives (what happens, in order)
//   TO WHOM → target filters on each directive's action

export interface CardEffect {
  /** Game-rule category — tells the engine how to register this effect */
  type: EffectType;
  /** WHEN: activation rules */
  activation: EffectActivation;
  /**
   * WHAT the player pays to activate this effect. Mutates game state.
   * Separate from activation.conditions because costs are paid, not just checked.
   */
  cost?: EffectCost;
  /** WHAT happens: ordered list of actions / conditional branches to execute */
  directives: Directive[];
  /** Present only on Command cards that have a 【Pilot】 restriction */
  pilotKeyword?: PilotKeyword;
  /** The original raw text segment that produced this effect — for UI / debug */
  sourceText: string;
}

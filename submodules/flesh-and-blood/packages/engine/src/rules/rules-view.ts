import type {
  FabBaseObjectProperties,
  FabCardFilter,
  FabCondition,
  FabNumericProperty,
  FabTarget,
  FabTurnHistoryEvent,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import type { FabObjectDeclarationFact } from "../game/objects.ts";
import type { FabCounterRecord, FabObjectHistory, FabObjectMarker, FabZoneRef } from "../state.ts";
import type {
  FabContinuousAtom,
  FabContinuousApplication,
  FabObjectRef,
  FabResolvedBindings,
  FabRuleAction,
  FabRuleParameters,
  FabRulesTimestamp,
} from "./continuous/ir.ts";

export interface FabEvaluatedObjectProperties extends FabBaseObjectProperties {
  readonly numeric: Readonly<Partial<Record<FabNumericProperty, number>>>;
}

export interface FabPropertyProvenance {
  readonly property: string;
  readonly operation: string;
  readonly effectId: string | null;
  readonly atomId: string | null;
}

export interface FabEvaluatedObject {
  readonly ref: FabObjectRef;
  readonly canonicalId: string;
  readonly ownerId: string;
  readonly controllerId: string | null;
  readonly zone: FabZoneRef;
  readonly zoneIndex: number;
  readonly visibility: "public" | "private";
  readonly base: FabBaseObjectProperties;
  /** Immutable properties after CR 6.3.2 stage 1. Copy effects freeze this
   * projection, never the printed base or the later fully-evaluated value. */
  readonly copyable: FabBaseObjectProperties;
  /** Stage-7 base numeric values, including accepted base modifications. */
  readonly baseNumeric: Readonly<Partial<Record<FabNumericProperty, number>>>;
  readonly current: FabEvaluatedObjectProperties;
  readonly counters: readonly FabCounterRecord[];
  readonly history: FabObjectHistory;
  readonly appliedEffectIds: readonly string[];
  readonly provenance: readonly FabPropertyProvenance[];
}

export interface FabRulesBaseObject {
  readonly ref: FabObjectRef;
  readonly canonicalId: string;
  readonly ownerId: string;
  readonly controllerId: string | null;
  readonly zone: FabZoneRef;
  readonly zoneIndex: number;
  readonly visibility: "public" | "private";
  readonly base: FabBaseObjectProperties;
  /** Persisted stage-1 projection for pre-evaluated LKI objects. */
  readonly copyable?: FabBaseObjectProperties;
  readonly baseNumeric?: Readonly<Partial<Record<FabNumericProperty, number>>>;
  /** Pre-evaluated immutable LKI. Live objects omit this and start from base. */
  readonly current?: FabEvaluatedObjectProperties;
  readonly counters: readonly FabCounterRecord[];
  readonly markers: readonly FabObjectMarker[];
  readonly declarationFacts?: readonly FabObjectDeclarationFact[];
  readonly history: FabObjectHistory;
  readonly lifeGained?: number;
  readonly lifeLost?: number;
  /** Instance ids of cards underneath this object (material / Evo transform). */
  readonly underInstanceIds?: readonly string[];
}

export interface FabActiveContinuousAtom {
  readonly effectId: string;
  readonly controllerId: string;
  readonly source: FabObjectRef;
  readonly atom: FabContinuousAtom;
  readonly timestamp: FabRulesTimestamp;
  readonly lockedBindings: FabResolvedBindings;
  /** Persisted turn-player ordering for equal-timestamp object-effect atoms. */
  readonly simultaneousOrder: number | null;
  /** Persisted replacement-accepted contributions for this atom. */
  readonly acceptedApplications: readonly FabContinuousApplication[];
  /** Existing layer applications remain latched even after the target stops matching. */
  readonly latchedSubjects?: readonly FabObjectRef[];
}

export interface FabObjectQuery {
  readonly controllerId?: string;
  readonly ownerId?: string;
  readonly zones?: readonly FabZoneRef["zone"][];
  readonly filter?: FabCardFilter;
}

export interface FabEvalContext {
  readonly controllerId: string;
  readonly source: FabObjectRef | null;
  /** Object currently receiving a continuous atom, when amount or condition
   * semantics are relative to that object rather than the source. */
  readonly subject?: FabObjectRef;
  readonly bindings: FabResolvedBindings;
  readonly facts?: FabRulesFacts;
  /** Active continuous rules that can alter canonical comparisons. */
  readonly rules?: readonly FabEvaluatedRule[];
}

/** Base game facts that are not object properties but are required by canonical selectors. */
export interface FabRulesFacts {
  /** Reachable move-fact LKI, interned in the authoritative snapshot. */
  readonly moveLkiById?: Readonly<
    Record<import("../state.ts").FabLkiId, import("../state.ts").FabMoveLkiSnapshot>
  >;
  readonly activePlayerId: string | null;
  /** Current turn phase (start | action | end). Used by activation gates such
   * as "Activate only during your action phase" (Crown of Reflection). */
  readonly phase: "start" | "action" | "end" | null;
  readonly turnNumber: number;
  /** Per-player Instant play fact for the currently open chain link. */
  readonly playerPlayedInstantThisChainLink?: Readonly<Record<string, boolean>>;
  readonly playerLife: Readonly<Record<string, number>>;
  /**
   * Damage currently pending against each hero seat: the open chain link's
   * attack damage minus declared defense (hero targets only), plus the
   * static amounts of unresolved deal-damage effects on the rules stack
   * (arcane/generic pings). Dynamic amounts stay excluded (fail-closed).
   */
  readonly pendingDamageByPlayerId: Readonly<Record<string, number>>;
  readonly playerMarked: Readonly<Record<string, boolean>>;
  /** Objects currently frozen by an active duration-based Freeze restriction.
   * Discrete freeze effects also retain their ordinary `frozen` marker. */
  readonly frozenObjectRefs: readonly FabObjectRef[];
  readonly playerCardsDrawn: Readonly<Record<string, number>>;
  /** Exhaustive typed projection of each player's authoritative turn history. */
  readonly playerPerformedThisTurn: Readonly<
    Record<string, Readonly<Record<FabTurnHistoryEvent, boolean>>>
  >;
  readonly playerBlueCardsPlayed: Readonly<Record<string, number>>;
  readonly playerRedCardsPlayed: Readonly<Record<string, number>>;
  readonly playerYellowCardPutIntoSoulThisTurn: Readonly<Record<string, boolean>>;
  /**
   * Per-player: lowercased printed names of Token objects that player
   * destroyed this turn (Adversity limbs: "destroyed a Vigor/Might/Agility
   * token this turn"). Derived from committed destroy events.
   */
  readonly playerDestroyedTokenNamesThisTurn: Readonly<Record<string, readonly string[]>>;
  /**
   * Per-player: an Aura they controlled was destroyed this turn
   * ("if an aura you control was destroyed this turn" — Ominous family).
   */
  readonly playerDestroyedAuraThisTurn: Readonly<Record<string, boolean>>;
  readonly playerWeaponHit: Readonly<Record<string, boolean>>;
  /**
   * Per-player: any attack hit this turn ("if you've hit this turn" —
   * Iris of the Blossom).
   */
  readonly playerHit: Readonly<Record<string, boolean>>;
  /**
   * Instance ids that produced a hit this turn. Dawnblade "if this hasn't
   * hit this turn" reads the subject's id here (CR 7.5.5b hit ledger).
   */
  readonly sourceHitThisTurn: Readonly<Record<string, true>>;
  /**
   * Per-player: an attack they controlled fragmented this turn.
   * has-status `attack-fragmented-this-turn` is true if any seat is true
   * ("if an attack has fragmented this turn" — Starfield Veil).
   */
  readonly playerAttackFragmented: Readonly<Record<string, boolean>>;
  /**
   * Per-player: an aura with a holo counter entered under their control this
   * turn (Aphrodias activate gate).
   */
  readonly playerHoloAuraEnteredThisTurn: Readonly<Record<string, boolean>>;
  /**
   * Per-player: a card with Herald in its name entered their soul during their
   * turn (Empyrean Rapture continuous cost gate).
   */
  readonly playerHeraldPutIntoSoulThisTurn: Readonly<Record<string, boolean>>;
  /**
   * Per-player: any card entered their soul this turn (Vestige of Sol pitch
   * replacement gate).
   */
  readonly playerCardPutIntoSoulThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player weapon attacks declared this turn. */
  readonly playerWeaponAttacks: Readonly<Record<string, number>>;
  /** Per-player: weapon instance ids attacked with this turn. */
  readonly playerWeaponAttackInstanceIdsThisTurn: Readonly<Record<string, readonly string[]>>;
  /** Per-player, per-weapon attack declaration counts this turn. */
  readonly playerWeaponAttackCountsByInstanceIdThisTurn: Readonly<
    Record<string, Readonly<Record<string, number>>>
  >;
  /** Per-player whether any damage was dealt by them this turn. */
  readonly playerDealtDamageThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player count of sword-subtype weapon hits this turn. */
  readonly playerSwordHitsThisTurn: Readonly<Record<string, number>>;
  /** Per-player weapon attacks that hit this turn. */
  readonly playerWeaponHits: Readonly<Record<string, number>>;
  /** Per-player total life actually gained this turn. */
  readonly playerLifeGainedThisTurn: Readonly<Record<string, number>>;
  /** Per-player clashes won this turn (Boast +X{d}). */
  readonly playerClashesWonThisTurn: Readonly<Record<string, number>>;
  /** Per-player: number of Draconic chain links on the combat chain.
   * Used by "control 2 or more Draconic chain links" continuous gates. */
  readonly playerDraconicChainLinks: Readonly<Record<string, number>>;
  readonly playerPitchedPower6: Readonly<Record<string, boolean>>;
  /** Per-player: created a Seismic Surge token this turn (Volcanic Vice). */
  readonly playerCreatedSeismicSurgeThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player: controlled a Seismic Surge token this turn — currently in
   * their arena or entered under their control via create/play/equip
   * (Tremorshield Sabatons "you've controlled a Seismic Surge token this
   * turn"). Broader than {@link playerCreatedSeismicSurgeThisTurn}. */
  readonly playerControlledSeismicSurgeThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player: created or gained control of a Gold token this turn. */
  readonly playerCreatedOrStolenGoldThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player: a power-6+ card entered this player's banished zone this turn. */
  readonly playerBanishedPower6: Readonly<Record<string, boolean>>;
  /** Per-player: MON Charge — charged a card to soul this turn. */
  readonly playerCharged: Readonly<Record<string, boolean>>;
  /** Per-player: Mechanologist boost this turn ("if you've boosted this turn"). */
  readonly playerBoosted: Readonly<Record<string, boolean>>;
  /** Times this player paid the boost additional cost this turn (CR 8.3.9a). */
  readonly playerBoostsThisTurn: Readonly<Record<string, number>>;
  readonly playerBanishedFromBoostingThisTurn: Readonly<Record<string, boolean>>;
  readonly playerEvoBanishedFromBoostingThisTurn: Readonly<Record<string, boolean>>;
  /** CR 8.5.10a intimidate effects generated this turn, including empty-hand resolutions. */
  readonly playerIntimidatesThisTurn: Readonly<Record<string, number>>;
  readonly playerIntimidatedAnOpponentThisTurn: Readonly<Record<string, boolean>>;
  readonly playerAttackedOrDefendedWithAttackActionThisTurn: Readonly<Record<string, boolean>>;
  readonly playerLastActionCardPlayedSupertypes: Readonly<Record<string, readonly string[]>>;
  readonly playerActionCardPlaysThisTurn: Readonly<
    Record<
      string,
      readonly {
        readonly instanceId: string;
        readonly supertypes: readonly string[];
        readonly types?: readonly string[];
        readonly subtypes?: readonly string[];
      }[]
    >
  >;
  readonly playerControlledToughnessThisTurn: Readonly<Record<string, boolean>>;
  readonly playerCreatedCrouchingTigerThisTurn: Readonly<Record<string, boolean>>;
  readonly playerControlledVigorThisTurn: Readonly<Record<string, boolean>>;
  readonly playerControlledMightThisTurn: Readonly<Record<string, boolean>>;
  readonly playerDiscardedPower6AsAdditionalCost: Readonly<Record<string, boolean>>;
  readonly playerHighestPowerRevealedThisTurn: Readonly<Record<string, number>>;
  readonly playerFusedSupertypesThisTurn: Readonly<Record<string, readonly string[]>>;
  readonly playerDiplomacyChoice: Readonly<Record<string, "war" | "peace" | null>>;
  readonly playerBoostsThisCombatChain: Readonly<Record<string, number>>;
  /** Per-player cards banished from their soul on the open combat chain. */
  readonly playerCardsBanishedFromSoulThisCombatChain: Readonly<Record<string, number>>;
  /** Per-player dagger-source hits on the open combat chain. */
  readonly playerDaggerHitsThisCombatChain: Readonly<Record<string, number>>;
  /** Per-player: the crowd cheered this hero this turn ("if you've been cheered"). */
  readonly playerCrowdCheered: Readonly<Record<string, boolean>>;
  /** Per-player: the crowd booed this hero this turn ("if you've been booed"). */
  readonly playerCrowdBooed: Readonly<Record<string, boolean>>;
  readonly playerBeatenChest: Readonly<Record<string, boolean>>;
  readonly playerCranked: Readonly<Record<string, boolean>>;
  /** Per-player: completed a contract this turn (CR 8.4.7 / 8.5.39a; DYN123 Pay Day). */
  readonly playerCompletedAContractThisTurn: Readonly<Record<string, boolean>>;
  /** Highest face each player rolled on a die this turn. */
  readonly playerHighestDieRollThisTurn: Readonly<Record<string, number>>;
  readonly playerLostLifeThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player total attack declarations this turn (weapons + actions). */
  readonly playerAttacksThisTurn: Readonly<Record<string, number>>;
  /** Per-player number of declarations that attacked that hero this turn. */
  readonly playerTimesAttackedThisTurn: Readonly<Record<string, number>>;
  /** Per-player whether they banished an Earth-talent card this turn. */
  readonly playerBanishedEarthCardThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player whether a Lightning Flow they controlled was destroyed this turn. */
  readonly playerDestroyedLightningFlowThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player names this player scrapped this turn. */
  /** Per-player: created or activated a Gate to i'Arathael this turn
   * (viserai-usurper IAR106 a2 end-phase traverse gate). Derived from
   * committed create/activate events on the Gate to i'Arathael token. */
  readonly playerCreatedOrActivatedGateToIArathaelThisTurn: Readonly<Record<string, boolean>>;
  /**
   * Per-player: count of Runechant tokens created this turn (IAR
   * viserai-between-worlds / the-forsaken "3 or more Runechants this turn").
   * Derived from committed create events for `token:runechant` / name Runechant.
   */
  readonly playerRunechantsCreatedThisTurn: Readonly<Record<string, number>>;
  /**
   * Per-player: a blue card was put into this player's graveyard this turn
   * (Gravy Bones watery-grave GY permission). Derived from committed events —
   * discard / put-into-graveyard / destroy→GY / move-zone→GY.
   */
  readonly playerBluePutIntoGraveyardThisTurn: Readonly<Record<string, boolean>>;
  readonly playerNonAttackActionPlayed: Readonly<Record<string, number>>;
  /** Per-player: attack-action cards played this turn (play role "attack"). */
  readonly playerAttackActionPlayed: Readonly<Record<string, number>>;
  /**
   * Per-player: names of cards played from hand this turn (play events).
   * Used by name-gated activations such as "Activate this only if you've
   * played a Nimblism this turn" (SEA183/SEA186 — the catalog encodes the
   * Nimblism family as plain "Generic Action" cards named "Nimblism", so
   * the gate reads the played card NAME).
   */
  readonly playerPlayedCardNamesThisTurn: Readonly<Record<string, readonly string[]>>;
  /** Per-player: played a card from their banished zone this turn (galaxxi-
   * black +2{p} / Shadow Runeblade "played from banished" gates). */
  readonly playerPlayedFromBanishedThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player: weapon instanceIds whose attacks gained go-again this turn
   * (quicksilver-dagger \"another weapon gained go again\" gate). Derived
   * from committed go-again events on Weapon typeBox sources. */
  readonly playerWeaponInstancesGainedGoAgainThisTurn: Readonly<Record<string, readonly string[]>>;
  /** Per-player: played a card with type Aura or created an Aura token this
   * turn (rotwood-reaper +2{p} / Earth Runeblade family). Derived from play
   * and create events on Aura-typed cards/tokens. */
  readonly playerPlayedOrCreatedAuraThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player: discarded a printed-power-6+ card this turn (Brute gate). */
  readonly playerDiscardedPower6: Readonly<Record<string, boolean>>;
  /**
   * Per-player: printed name of the last attack that completed this turn
   * (chain close / multi-link advance). Used by "last attack this turn" gates.
   */
  readonly playerLastAttackNamesThisTurn: Readonly<Record<string, readonly string[]>>;
  /**
   * Per-player: declared an attack with a Crouching Tiger this turn
   * (Blood Scent Instant destroy gate).
   */
  readonly playerAttackedWithCrouchingTigerThisTurn: Readonly<Record<string, boolean>>;
  /** Per-player: whether the most recently closed chain link's attack hit.
   * Survives combat-chain-close for "didn't hit" trigger conditions. */
  readonly playerLastAttackDidHit: Readonly<Record<string, boolean>>;
  /** Exact per-source hit result retained after the combat chain closes. */
  readonly lastClosedAttackDidHitByInstanceId: Readonly<Record<string, boolean>>;
  /** Resolved attack powers retained for each defender after the combat chain closes. */
  readonly lastClosedDefendedAttackPowersByInstanceId: Readonly<Record<string, readonly number[]>>;
  /**
   * Per-player: successful hits this player has scored on the open combat
   * chain (derived from the turn's named hit outcomes). Used by Mask of Three Tails /
   * "hit N or more times this combat chain" activation gates. Reset when
   * the chain closes or a new chain opens.
   */
  readonly playerCombatChainHits: Readonly<Record<string, number>>;
  readonly playerDamageDealt: Readonly<
    Record<
      string,
      {
        readonly turn: Readonly<Record<"arcane" | "physical" | "generic", number>>;
        readonly chainLink: Readonly<Record<"arcane" | "physical" | "generic", number>>;
        readonly opposingHeroes?: {
          readonly turn: Readonly<Record<"arcane" | "physical" | "generic", number>>;
          readonly chainLink: Readonly<Record<"arcane" | "physical" | "generic", number>>;
        };
      }
    >
  >;
  /** Per-player damage taken this turn keyed by dealing source instanceId;
   * non-ally sources also attribute their dealer hero (CR 8.2.8e). */
  readonly playerDamageTakenBySource: Readonly<Record<string, Readonly<Record<string, number>>>>;
  /** Per-player: whether they were the target of any damage this turn. */
  readonly playerBeenDealtDamage: Readonly<Record<string, boolean>>;
  /** Per-player damage taken this turn, by type (physical / arcane / generic). */
  readonly playerDamageTaken: Readonly<
    Record<string, Readonly<Record<"arcane" | "physical" | "generic", number>>>
  >;
  /** Per-source-instance damage dealt this turn ("If this deals N damage" —
   * Surge CR 8.4.8). Realized damage only, keyed by dealing object instanceId. */
  readonly sourceDamageDealtThisTurn?: Readonly<Record<string, number>>;
  /** Per-source-instance damage dealt on the open chain link (Surge CR 8.4.8). */
  readonly sourceDamageDealtThisChainLink?: Readonly<Record<string, number>>;
  /** Per-source damage dealt TO A HERO this turn (Surge "...to a hero" 8.4.8). */
  readonly sourceDamageDealtToHeroThisTurn?: Readonly<Record<string, number>>;
  /** Per-source hero-targeted damage on the open chain link (Surge 8.4.8). */
  readonly sourceDamageDealtToHeroThisChainLink?: Readonly<Record<string, number>>;
  /**
   * Seated player ids. Independent of whether a hero object currently occupies
   * the hero zone — opponent/each scans must still see every seat.
   */
  readonly playerIds: readonly string[];
  readonly heroRefs: Readonly<Record<string, FabObjectRef>>;
  readonly combat: {
    readonly attack: FabObjectRef;
    /** Physical source behind the attack proxy (weapon/ally), or the attack card itself. */
    readonly attackSourceInstanceId?: string;
    readonly previousAttack: FabObjectRef | null;
    readonly attackingPlayerId: string;
    /**
     * The attack target's CONTROLLER seat — drives defense legality and
     * reaction gating. NOT "the attacked hero": when the declared target is
     * an ally/spectra/permanent this is that object's controller. Use
     * heroTargetPlayerId for hero-target semantics.
     */
    readonly defendingPlayerId: string;
    /**
     * The hero seat actually targeted by the declared attack target, or null
     * when the attack targets an object (ally / spectra / permanent).
     */
    readonly heroTargetPlayerId: string | null;
    readonly attackTarget: FabObjectRef | null;
    readonly chainLinkNumber: number;
    /** Hit/miss of each already-closed link on this open chain, oldest first. */
    readonly closedLinkHits?: readonly boolean[];
    /** Resolution-time LKI for attacks on completed links of this open chain. */
    readonly resolvedAttacks: readonly {
      readonly controllerId: string;
      readonly basePower: number;
      readonly power: number;
    }[];
    readonly didHit: boolean;
    readonly defending: readonly FabObjectRef[];
    /** True when at least one defending card originated from hand (CR 7.3). */
    readonly defendedFromHand: boolean;
    /** True when this player played a card or activated an ability in this reaction step. */
    readonly playedCardOrActivatedAbilityThisReactionStep: boolean;
    /**
     * True when an attack reaction was played or activated after this chain
     * link's attack event (Red Alert equipment family).
     */
    readonly attackReactionPlayedOrActivated: boolean;
    /** Attack reactions played or activated on the open chain link. */
    readonly attackReactionCount?: number;
    /** Wagers on the open chain link (controller of each wager). */
    readonly wagers?: readonly { readonly controllerId: string }[];
  } | null;
  /**
   * Colors each source instance has banished this turn (Bonds of Attraction
   * Errata Bulletin #9).
   */
  readonly sourceBanishedColorsThisTurn?: Readonly<Record<string, readonly string[]>>;
  /**
   * Defenders from every link on the most recently closed combat chain. Used
   * when `combat` is null so chain-link-resolve effects can still identify
   * "cards defending this" after the chain has been cleared.
   */
  readonly lastClosedDefendingInstanceIds: readonly string[];
  /** Live combat-chain instance ids across every seat (physical zone). */
  readonly combatChainInstanceIds?: readonly string[];
  /**
   * Objects that left the arena this turn (from leave-arena events). Token
   * LKI is retained even after cease-to-exist so Glory Plate / "left the
   * arena this turn" counts remain accurate.
   */
  readonly leftArenaThisTurn: readonly {
    readonly controllerId: string;
    readonly names: readonly string[];
    readonly metatypes: readonly string[];
    readonly types: readonly string[];
  }[];
}

export interface FabResolvedAmount {
  readonly value: number;
  readonly dependencies: readonly FabObjectRef[];
}

export interface FabRulesExplanation {
  readonly ref: FabObjectRef;
  readonly contributions: readonly FabPropertyProvenance[];
  readonly appliedEffectIds: readonly string[];
}

export interface FabEvaluatedCombat {
  readonly attack: FabEvaluatedObject;
  readonly attackPower: number;
  /** CR 8.3.13: attack is defended by a non-Illusionist 6+ power attack action card. */
  readonly phantasmDestroyed: boolean;
  readonly defenders: readonly FabEvaluatedObject[];
  readonly defense: number;
  readonly attackingPlayerId: string;
  readonly defendingPlayerId: string;
  readonly attackTarget: FabEvaluatedObject | null;
  readonly didHit: boolean;
}

export interface FabRulesLegality {
  quotePlay(
    request: import("./legality-quotes.ts").FabPlayRequest,
  ): import("./legality-quotes.ts").FabPlayQuote;
  quoteActivation(
    request: import("../procedures/activate-ability/index.ts").FabActivationRequest,
  ): import("../procedures/activate-ability/index.ts").FabActivationQuote;
  quoteDefense(
    request: import("./legality-quotes.ts").FabDefenseRequest,
  ): import("./legality-quotes.ts").FabDefenseQuote;
  quoteAttackTargets(
    request: import("./legality-quotes.ts").FabAttackTargetRequest,
  ): import("./legality-quotes.ts").FabAttackTargetQuote;
}

export type FabEvaluatedRuleScope =
  | { readonly kind: "game" }
  | {
      readonly kind: "objects";
      /** Dynamic targets are re-evaluated; latched targets preserve an appliesTo.next/this identity. */
      readonly selection: "dynamic" | "latched";
      readonly subjects: readonly [FabObjectRef, ...FabObjectRef[]];
    };

export interface FabEvaluatedRule {
  readonly action: FabRuleAction;
  readonly mode: "restrict" | "require" | "allow" | "amplify";
  readonly parameters: FabRuleParameters;
  /**
   * Compiled atom filter (e.g. defender filter for defend restrictions —
   * Benji `playedFromZones: hand`, equipment-type bans).
   */
  readonly filter: import("@tcg/flesh-and-blood-types").FabCardFilter | null;
  /** Optional numeric cap carried from the source rule atom. */
  readonly limit?: { readonly count: number };
  readonly effectId: string;
  readonly atomId: string;
  /** Explicit rule scope. Object-scoped rules always carry at least one subject. */
  readonly scope: FabEvaluatedRuleScope;
  /**
   * Controller of the continuous effect that produced this rule (e.g. Bolfar
   * for "You can't equip weapons" — the player the restriction binds).
   */
  readonly controllerId: string;
}

export interface FabRulesView {
  object(ref: FabObjectRef): FabEvaluatedObject | null;
  objects(query?: FabObjectQuery): readonly FabEvaluatedObject[];
  functionalAbilities(ref: FabObjectRef): readonly FleshAndBloodAbility[];
  matchesFilter(object: FabEvaluatedObject, filter: FabCardFilter, ctx: FabEvalContext): boolean;
  evaluateCondition(condition: FabCondition, ctx: FabEvalContext): boolean;
  evaluateAmount(
    amount: import("@tcg/flesh-and-blood-types").FabAmount,
    ctx: FabEvalContext,
  ): FabResolvedAmount;
  targetCandidates(target: FabTarget, ctx: FabEvalContext): readonly FabEvaluatedObject[];
  rules(action?: FabRuleAction): readonly FabEvaluatedRule[];
  applications(): readonly FabContinuousApplication[];
  quotePlay: FabRulesLegality["quotePlay"];
  quoteActivation: FabRulesLegality["quoteActivation"];
  quoteDefense: FabRulesLegality["quoteDefense"];
  quoteAttackTargets: FabRulesLegality["quoteAttackTargets"];
  combat(): FabEvaluatedCombat | null;
  explain(ref: FabObjectRef): FabRulesExplanation | null;
}

import type {
  FabBaseObjectProperties,
  FabDamageType,
  FabEffect,
  FabTrigger,
  FabTriggerEventName,
  FabZone,
} from "@tcg/flesh-and-blood-types";
import { FAB_OBSERVABLE_EVENT_NAMES } from "@tcg/flesh-and-blood-types";
import type {
  FabAttackTarget,
  FabCounterRecord,
  FabObjectHistory,
  FabObjectMarker,
  FabZoneRef,
} from "../state.ts";
import type { FabEvaluatedObjectProperties } from "./rules-view.ts";
import type { FabExactAttackRef, FabObjectRef } from "./continuous/ir.ts";
import type { FabTriggeredLayer } from "./layers.ts";
import type { FabClashId, FabWagerId, FabWagerPrize } from "../game/combat.ts";
import type { FabObjectInstanceId } from "../game/identity.ts";

export type FabRulesProcedureEventName =
  | "announce-card"
  /** CR 5.2.2a: an ability layer is created before its activation costs are paid. */
  | "announce-activation"
  /**
   * Rules-procedure companion emitted by arena zone transitions. Cards observe
   * the concrete `enter-arena` / `leave-arena` events instead (or an explicit
   * `any-of` expression containing both).
   */
  | "enter-or-leave-arena"
  | "spend-assets"
  | "resolve-combat-damage"
  | "advance-combat-step"
  | "defense-declaration-complete"
  | "declare-triggered-layer"
  | "remove-rules-layer"
  | "consume-random-index"
  | "expire-replacement-effects"
  | "consume-replacement-effects"
  | "consume-delayed-triggers"
  | "register-delayed-trigger"
  | "register-replacement"
  | "continuous-effect-generated"
  | "continuous-effect-ceased"
  | "continuous-effect-applied"
  | "continuous-effect-changed"
  | "continuous-effect-stopped-applying"
  | "continuous-effect-future-object-observed"
  | "gain-keyword"
  | "gain-assets"
  | "pay-resources"
  | "counter-added"
  | "numeric-counter-added"
  /** Remove N matching ±property counters (e.g. remove a +1{p} from a sword). */
  | "numeric-counter-removed"
  /**
   * CR 8.5.58 Sharpen: put `count` +1{p} counters on the sword and mark it
   * sharpened this turn. Replaceable intermediate so "sharpen an additional
   * time" / Reverent Rerebrace can intercept before counters land.
   */
  | "sharpen"
  | "turn-face-down"
  | "shuffle-zone"
  | "random-token-request"
  | "roll-request"
  | "lose-game"
  | "reset-turn-assets"
  | "advance-turn"
  | "set-status"
  | "set-tapped"
  /**
   * Replaceable CR 8.5.46 outcome. The event is committed only after outcome
   * replacements finish; its reducer then publishes the winner and prize.
   */
  | "wager-loss"
  /** Replaceable provisional CR 8.5.45 result, before winner/prize publication. */
  | "clash-outcome"
  /** Selects the prize branch using the final result of the identified clash. */
  | "clash-prize"
  /** Deterministic continuation which computes a fresh clash from current deck tops. */
  | "reclash-request"
  /** CR 8.5.43 Awaken — turn a figment to its permanent (back) face. */
  | "awaken"
  /** Structural CR 9.1 face selection; preserves the physical object and incarnation. */
  | "change-active-face"
  | "activation-limit-modifier-generated"
  /**
   * Observation: “choose an opponent” resolved. In this 1v1 product the
   * sole opposing seat is bound automatically (see AGENTS.md Product Scope).
   */
  | "choose-opponent"
  | "intimidate"
  /** CR 1.8.5f: replace the live attack's declared target with another legal original target. */
  | "retarget-attack";

/**
 * Runtime mirror of {@link FabRulesProcedureEventName}. The compile-time
 * assertion below fails when a procedure name is added without updating this
 * list, so coverage tooling (log facts, adapters) can enumerate names.
 */
export const FAB_RULES_PROCEDURE_EVENT_NAMES = [
  "announce-card",
  "announce-activation",
  "enter-or-leave-arena",
  "spend-assets",
  "resolve-combat-damage",
  "advance-combat-step",
  "defense-declaration-complete",
  "declare-triggered-layer",
  "remove-rules-layer",
  "consume-random-index",
  "expire-replacement-effects",
  "consume-replacement-effects",
  "consume-delayed-triggers",
  "register-delayed-trigger",
  "register-replacement",
  "continuous-effect-generated",
  "continuous-effect-ceased",
  "continuous-effect-applied",
  "continuous-effect-changed",
  "continuous-effect-stopped-applying",
  "continuous-effect-future-object-observed",
  "gain-keyword",
  "gain-assets",
  "pay-resources",
  "counter-added",
  "numeric-counter-added",
  "numeric-counter-removed",
  "sharpen",
  "turn-face-down",
  "shuffle-zone",
  "random-token-request",
  "roll-request",
  "lose-game",
  "reset-turn-assets",
  "advance-turn",
  "set-status",
  "set-tapped",
  "wager-loss",
  "clash-outcome",
  "clash-prize",
  "reclash-request",
  "awaken",
  "change-active-face",
  "activation-limit-modifier-generated",
  "choose-opponent",
  "intimidate",
  "retarget-attack",
] as const satisfies readonly FabRulesProcedureEventName[];

type FabRulesProcedureEventNameFromRuntime = (typeof FAB_RULES_PROCEDURE_EVENT_NAMES)[number];
const _fabRulesProcedureEventNamesAreExhaustive: Exclude<
  FabRulesProcedureEventName,
  FabRulesProcedureEventNameFromRuntime
> extends never
  ? true
  : never = true;

/** Every committable event name (trigger-observable plus rules-procedure). */
export const FAB_GAME_EVENT_NAMES: readonly FabGameEventName[] = [
  ...new Set([...FAB_OBSERVABLE_EVENT_NAMES, ...FAB_RULES_PROCEDURE_EVENT_NAMES]),
];

export type FabGameEventName = FabTriggerEventName | FabRulesProcedureEventName;

/** Stable identifiers are allocated from counters stored in the match snapshot. */
export type FabProcessId = `process-${number}`;
export type FabEventId = `event-${number}`;
export type FabEventBatchId = `batch-${number}`;
export type FabEventOccurrenceId = `occurrence-${string}`;
export type FabLayerId = `layer-${number}`;
export type FabDecisionId = `decision-${number}`;
export type FabRulesCheckpointId = `checkpoint-${number}`;

export interface FabObjectSnapshot {
  readonly ref: FabObjectRef;
  readonly instanceId: string;
  readonly canonicalId: string | null;
  readonly objectKind: import("../game/objects.ts").FabObjectRecord["objectKind"];
  readonly baseSource: import("../game/objects.ts").FabObjectRecord["baseSource"];
  readonly ownerId: string;
  readonly controllerId: string | null;
  readonly visibility: "public" | "private";
  readonly base: FabBaseObjectProperties;
  readonly copyable: FabBaseObjectProperties;
  readonly baseNumeric: Readonly<
    Partial<Record<import("@tcg/flesh-and-blood-types").FabNumericProperty, number>>
  >;
  readonly current: FabEvaluatedObjectProperties;
  readonly zoneRef: FabZoneRef;
  readonly counterRecords: readonly FabCounterRecord[];
  readonly markers: readonly FabObjectMarker[];
  readonly history: FabObjectHistory;
  /** Play-time declaration facts (fusion, boost, rune-gate) captured on LKI. */
  readonly declarationFacts?: readonly import("../game/objects.ts").FabObjectDeclarationFact[];
  readonly appliedEffectIds: readonly string[];
  readonly capturedAt: FabEventId | FabRulesCheckpointId;
  readonly zone: FabZone | "arena" | "combat-chain" | "unknown";
  readonly faceDown: boolean;
  readonly counters: Readonly<Record<string, number>>;
  /** Explicit face selected while creating a physical paired token. */
  readonly activeFace?: import("../game/objects.ts").FabActiveFaceState;
}

/**
 * A binding that preserves the observation captured when the object was bound,
 * while allowing one causal continuation to follow exact committed moves.
 *
 * `ref` and every other snapshot field remain immutable LKI. Consumers that
 * act on the object may use `continuationRef`; condition evaluation continues
 * to observe the original snapshot.
 */
export interface FabObjectContinuationBinding extends FabObjectSnapshot {
  readonly continuationRef: FabObjectRef;
}

export type FabEventCause =
  | { readonly kind: "player-command"; readonly actorId: string; readonly command: string }
  | {
      readonly kind: "layer";
      readonly layerId: FabLayerId;
      readonly source: FabObjectSnapshot | null;
      readonly controllerId: string;
    }
  | {
      readonly kind: "effect";
      readonly abilityId: string;
      readonly source: FabObjectSnapshot | null;
      readonly controllerId: string;
    }
  | { readonly kind: "rule"; readonly rule: string; readonly controllerId: string | null }
  | { readonly kind: "event"; readonly eventId: FabEventId; readonly controllerId: string | null };

interface CardEventData {
  readonly object: FabObjectSnapshot;
}

interface ActorCardEventData extends CardEventData {
  readonly actorId: string;
}

interface ActivationEventData extends ActorCardEventData {
  readonly abilityId: string;
  readonly ability: import("@tcg/flesh-and-blood-types").FabActivatedAbility;
  readonly targets: import("./targets.ts").FabTargetMap;
  readonly equipDestination: "head" | "chest" | "arms" | "legs" | null;
  readonly attackTarget: FabAttackTarget | null;
  /**
   * Instance ids pitched to pay this activation's asset cost ("pitched this
   * way" — Oldhim Earth/Ice branches, Winter's Wail, etc.).
   */
  readonly pitchedInstanceIds?: readonly string[];
}

interface ZoneEventData extends CardEventData {
  /** Ref of the destination object when CR 3.0.9 resets it; otherwise null. */
  readonly destinationRef: FabObjectRef | null;
  readonly from: FabZone | "arena" | "unknown";
  readonly to: FabZone | "arena" | "unknown";
  readonly reason:
    | "move"
    | "destroy"
    | "banish"
    | "die"
    | "leave-arena"
    | "put-into-graveyard"
    | "discard"
    | "play"
    | "resolve"
    | "create"
    | "equip"
    | "search"
    | "give"
    | "steal"
    | "rule";
  readonly position?: "top" | "bottom" | { readonly index: number };
  readonly faceDown?: boolean;
  /**
   * Identity-replacement result for "enters the arena tapped" (CR 1.3.3b).
   * This is part of the enter event, not a later CR 8.5.55 tap effect.
   */
  readonly entersTapped?: boolean;
  readonly random?: boolean;
  readonly returnAtEndPhase?: boolean;
  /**
   * Uzuri-style: after moving onto the combat chain, become the active
   * attacking card (replace the chain link's active-attack reference).
   */
  readonly asAttacking?: boolean;
  /** Disambiguates the two equipped weapon zones when `to` is `weapon`. */
  readonly equipmentSlot?: "weapon1" | "weapon2";
  /**
   * When set, the destination zone is this player's (cross-player equip /
   * gain-control style moves). Source zone still uses the object's current
   * zoneRef player. Omit for same-player moves.
   */
  readonly destinationPlayerId?: string;
  /**
   * CR 3.0.14 host for `to: "under"` moves ("put a card under this"): the
   * top-card whose subcardsByHostId list seats the hosted destination.
   */
  readonly destinationHostId?: FabObjectInstanceId | null;
  /** Authoritative committed transition observation. Follow-up enter/leave
   * events carry both immutable LKI and the exact post-transition incarnation. */
  readonly transition?: {
    readonly before: FabObjectSnapshot;
    readonly after: FabObjectSnapshot | null;
    readonly identity: "preserved" | "reset" | "ceased";
  };
}

interface DamageEventData {
  readonly source: FabObjectSnapshot | null;
  readonly target: FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string };
  readonly amount: number;
  readonly damageType: FabDamageType;
}

interface PlayerAmountEventData {
  readonly playerId: string;
  readonly amount: number;
  /** When set, the living object (not the seated hero) gains or loses life. */
  readonly objectInstanceId?: string;
}

interface PlayerCardEventData extends CardEventData {
  readonly playerId: string;
}

interface PlayerCardMoveEventData extends PlayerCardEventData {
  readonly destinationRef: FabObjectRef;
}

interface PhaseEventData {
  readonly turnPlayerId: string;
  readonly turnNumber: number;
}

/**
 * Canonical payload for every trigger-event name in the card DSL. Indexing
 * this map with FabTriggerEventName makes additions fail compilation here.
 */
export interface FabGameEventDataByName {
  readonly attack: ActorCardEventData & {
    readonly target: FabAttackTarget;
    readonly defendingPlayerId: string;
    /** Extra heroes this attack also targets (additional-hero grant). */
    readonly additionalTargets?: readonly FabAttackTarget[];
  };
  readonly "attack-target-declared": ActorCardEventData & {
    readonly target: FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string };
    /** Companion declaration for additional-hero multi-target. */
    readonly additionalTargets?: readonly (
      | FabObjectSnapshot
      | { readonly kind: "hero"; readonly playerId: string }
    )[];
  };
  readonly hit: ActorCardEventData & {
    readonly target: FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string };
    readonly damage: number;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    /**
     * CR 9.3.3 removes Marked as part of this hit. Keep the pre-hit fact on
     * the immutable event so "hits a marked hero" triggers can still match
     * after the reducer clears the persisted condition.
     */
    readonly targetWasMarked?: boolean;
  };
  readonly "deal-damage": DamageEventData;
  readonly "dealt-damage": DamageEventData;
  readonly prevent: DamageEventData & { readonly preventedAmount: number };
  readonly defend: ActorCardEventData & {
    readonly destinationRef: null;
    readonly attack: FabObjectSnapshot;
    readonly from:
      | "hand"
      | "arsenal"
      | "stack"
      | "deck"
      | "banished"
      | "head"
      | "chest"
      | "arms"
      | "legs"
      | "weapon1"
      | "weapon2";
    /** Zone the card entered the defense declaration or reaction procedure from. */
    readonly origin: FabZone | "head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2" | "deck";
  };
  readonly play: ActorCardEventData & {
    readonly destinationRef: null;
    readonly from: FabZone;
    readonly role: "action" | "instant" | "attack" | "attack-reaction" | "defense-reaction";
    readonly playTiming: import("./legality-quotes.ts").FabPlayTiming;
    readonly modes: readonly string[];
    readonly targets: import("./targets.ts").FabTargetMap;
    readonly attackTarget: FabAttackTarget | null;
    readonly additionalAttackTargets?: readonly FabAttackTarget[];
    /** Captured split declaration used to construct the stack-layer LKI. */
    readonly splitPlayMethod: import("../cards.ts").FabSplitPlayMethod | null;
  };
  readonly pitch: PlayerCardMoveEventData & {
    readonly resourcesGenerated: number;
    readonly chiGenerated?: number;
  };
  readonly discard: PlayerCardMoveEventData & {
    readonly random: boolean;
    readonly reason?: "additional-cost" | "cost" | "effect";
  };
  readonly draw: PlayerCardMoveEventData;
  readonly banish: ZoneEventData;
  readonly destroy: ZoneEventData;
  readonly search: { readonly playerId: string; readonly found: readonly FabObjectSnapshot[] };
  readonly boost: ActorCardEventData & { readonly banished: FabObjectSnapshot | null };
  readonly fuse: ActorCardEventData & { readonly revealed: readonly FabObjectSnapshot[] };
  /** MON Charge: hand card moved into soul; stamps charged-this-turn. */
  readonly charge: ActorCardEventData & { readonly charged: FabObjectSnapshot };
  readonly "clash-win": { readonly playerId: string; readonly opponentId: string };
  readonly "clash-lose": { readonly playerId: string; readonly opponentId: string };
  readonly wager: ActorCardEventData & {
    readonly wagerId: FabWagerId;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    readonly prize: FabWagerPrize | null;
  };
  readonly "wager-win": ActorCardEventData & {
    readonly wagerId: FabWagerId;
    readonly loserId: string;
    readonly prize: FabWagerPrize | null;
  };
  readonly "enter-arena": ZoneEventData;
  readonly "leave-arena": ZoneEventData;
  readonly "enter-or-leave-arena": ZoneEventData;
  readonly "put-into-graveyard": ZoneEventData;
  readonly "chain-link-resolve": {
    readonly attack: FabObjectSnapshot;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    readonly didHit: boolean;
  };
  readonly "combat-chain-close": { readonly turnPlayerId: string; readonly attackCount: number };
  readonly "start-phase": PhaseEventData;
  readonly "end-phase": PhaseEventData;
  readonly "action-phase-start": PhaseEventData;
  readonly "reaction-step": {
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    readonly attack: FabObjectSnapshot;
  };
  readonly "counter-removed": CardEventData & { readonly counter: string; readonly amount: number };
  /** Usurp records both the Runechant paid as the cost and the played card gaining +2{p}. */
  readonly usurp: ActorCardEventData & { readonly attack: FabObjectSnapshot };
  readonly crank: ActorCardEventData & {
    /** True when the event records the play-time crank choice (CR 8.3.29). */
    readonly intent: boolean;
  };
  readonly transcend: ActorCardEventData;
  readonly create: PlayerCardEventData;
  readonly "complete-contract": ActorCardEventData;
  readonly trigger: CardEventData & { readonly abilityId: string; readonly controllerId: string };
  readonly fragment: ActorCardEventData;
  readonly equip: ZoneEventData & { readonly playerId: string };
  readonly "turn-face-up": CardEventData & { readonly playerId: string };
  /** CR 8.5.43: figment flipped to permanent face (back) and marked awakened. */
  readonly awaken: CardEventData & { readonly playerId: string };
  readonly "change-active-face": CardEventData & {
    readonly faceId: import("@tcg/flesh-and-blood-types").FabFaceId;
  };
  readonly "activation-limit-modifier-generated": CardEventData & {
    readonly modifierId: string;
    /** PRODUCER-DEPENDENT contract: modify-activation-limit emits attack
     * abilities only (abilityType "attack" / attack-with), while the
     * resolution-window companion emitter (reconciler.ts, Snap Shot) emits
     * EVERY activated ability of the weapon — weapon "action" activations
     * (ARC040-a1 Death Dealer) must be grantable too. Consumers today are
     * pure membership checks (activate-ability/helpers.ts); a consumer
     * assuming attack-only ids will silently diverge. */
    readonly attackAbilityIds: readonly string[];
    readonly operation: "set-total" | "additional";
    readonly count: number;
    readonly turnNumber: number;
  };
  /** CR 5.2.2a: creates the proposed activated layer; not trigger-observable. */
  readonly "announce-activation": ActivationEventData;
  /** CR 5.2.2b / 5.1.10: costs are paid and the ability is now activated. */
  readonly activate: ActivationEventData;
  readonly "beat-chest": ActorCardEventData & { readonly discarded: readonly FabObjectSnapshot[] };
  readonly clash: { readonly firstPlayerId: string; readonly secondPlayerId: string };
  readonly "clash-outcome": {
    readonly clashId: FabClashId;
    readonly firstPlayerId: string;
    readonly secondPlayerId: string;
    readonly winnerId: string | null;
    /** Effective values compared by Clash after reveal modifiers. Null means no card was revealed. */
    readonly firstPower: number | null;
    readonly secondPower: number | null;
    /** Distinguishes a printed/effective 0{p} from a card with no power property. */
    readonly firstHasPower: boolean;
    readonly secondHasPower: boolean;
    readonly revealed: readonly FabObjectSnapshot[];
    /** Winner prize carried so a Victor reclash can restage clash-prize. */
    readonly deferredEffect?: FabEffect;
  };
  readonly "clash-prize": {
    readonly clashId: FabClashId;
    /**
     * A winner-owned prize that needs a choice is declared only after the
     * clash outcome identifies that winner. Keeping it here lets the
     * transaction turn it into a normal triggered layer at that boundary.
     */
    readonly deferredEffect?: FabEffect;
    readonly branches: readonly {
      readonly winnerId: string;
      readonly events: readonly ProposedEvent[];
    }[];
  };
  readonly "reclash-request": {
    readonly clashId: FabClashId;
    readonly firstPlayerId: string;
    readonly secondPlayerId: string;
    readonly deferredEffect?: FabEffect;
  };
  readonly "move-zone": ZoneEventData;
  readonly "crowd-cheers": { readonly playerId: string };
  /** CR 8.5.10: the discrete intimidate effect occurred, whether or not a card moved. */
  readonly intimidate: { readonly actorId: string; readonly playerId: string };
  readonly protect: { readonly playerId: string; readonly protectedPlayerId: string };
  readonly "crowd-boos": { readonly playerId: string };
  readonly "go-again": CardEventData & { readonly controllerId: string };
  /** Observation: an object gained a keyword via a continuous grant. */
  readonly "gain-keyword": CardEventData & {
    readonly controllerId: string;
    readonly keyword: string;
  };
  readonly dies: ZoneEventData;
  readonly become: PlayerCardEventData & { readonly previous: FabObjectSnapshot | null };
  readonly transform: CardEventData & {
    readonly previous: FabObjectSnapshot;
    /** Transform target identity (e.g. "traverse" for IAR hero flip). */
    readonly into?: string;
    /** Physical card placed over the target by a printed "transform it into this" effect. */
    readonly intoObject?: FabObjectSnapshot;
    /** Typed Invocation/Construct destination; never resolved by slug. */
    readonly destination?: {
      readonly kind: "resolving-card";
      readonly object: FabObjectSnapshot;
    };
  };
  readonly "gain-life": PlayerAmountEventData;
  readonly "lose-life": PlayerAmountEventData & { readonly source: string | null };
  readonly opt: {
    readonly playerId: string;
    readonly count: number;
    readonly top: readonly string[];
    readonly bottom: readonly string[];
  };
  readonly reveal: PlayerCardEventData;
  /** Private look (CR look-at); same payload as reveal for binding / LKI. */
  readonly look: PlayerCardEventData;
  readonly "modify-power": CardEventData & { readonly from: number; readonly to: number };
  readonly roll: {
    readonly playerId: string;
    readonly sides: number;
    readonly result: number;
    /** All faces generated for this roll, including ignored extra dice. */
    readonly faces?: readonly number[];
  };
  /** CR 5.1.2 tentative announcement; journaled until the play procedure commits. */
  readonly "announce-card": ActorCardEventData & {
    readonly from: FabZone;
    readonly destinationRef: null;
    readonly splitPlayMethod: import("../cards.ts").FabSplitPlayMethod | null;
  };
  /** CR 1.14.2 asset payment after all required assets are available. */
  readonly "spend-assets": {
    readonly playerId: string;
    readonly chi: number;
    readonly resources: number;
    readonly life: number;
    readonly actionPoints: number;
  };
  readonly "resolve-combat-damage": {
    readonly attack: FabObjectSnapshot;
    /** Exact declared target identity, retained even if an attacked object ceased to exist. */
    readonly target: import("../game/combat.ts").FabAttackTargetRef;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    /** Final CR 7.5.2 attack power after continuous effects and reactions. */
    readonly attackPower: number;
    /** Final combined defense of every declared defender for this attack target. */
    readonly totalDefense: number;
    readonly damage: number;
    /** One authoritative outcome for every declared target that reached damage resolution. */
    readonly outcomes: readonly {
      readonly target: import("../game/combat.ts").FabAttackTargetRef;
      readonly damage: number;
      readonly totalDefense: number;
    }[];
    /** Instance ids of every card defending this chain link at resolution. */
    readonly defendedBy: readonly FabObjectInstanceId[];
    /**
     * Resolution-time LKI for each defender and its final defense value. This
     * is deliberately captured here rather than reconstructed after the chain
     * closes, when continuous effects and the defending objects may be gone.
     */
    readonly defenders: readonly {
      readonly object: FabObjectSnapshot;
      readonly defense: number;
    }[];
  };
  readonly "advance-combat-step": {
    readonly attack: FabObjectSnapshot;
    readonly from: "attack" | "defend" | "damage";
    readonly to: "defend" | "reaction" | "resolution";
  };
  readonly "defense-declaration-complete": {
    readonly attack: FabObjectSnapshot;
    readonly defendingPlayerId: string;
  };
  readonly "declare-triggered-layer": { readonly layer: FabTriggeredLayer };
  readonly "remove-rules-layer": {
    readonly layerId: FabLayerId;
    readonly reason: "resolved" | "ceased";
  };
  readonly "consume-random-index": {
    readonly maxExclusive: number;
    readonly result: number;
  };
  readonly "expire-replacement-effects": { readonly replacementIds: readonly string[] };
  readonly "consume-replacement-effects": {
    readonly consumptions: readonly import("./process.ts").FabReplacementConsumption[];
  };
  readonly "consume-delayed-triggers": { readonly delayedTriggerIds: readonly string[] };
  readonly "register-delayed-trigger": {
    readonly delayedTriggerId: string;
    readonly controllerId: string;
    readonly source: FabObjectSnapshot;
    readonly trigger: FabTrigger;
    readonly resolution: import("./layers.ts").FabTriggeredResolution;
    readonly policy: import("./process.ts").FabDelayedTriggerPolicy;
    /** Bindings captured while arming the delayed clause (for later effects). */
    readonly bindings?: FabEventBindings;
  };
  readonly "register-replacement": {
    readonly replacementId: string;
    readonly controllerId: string;
    readonly source: FabObjectSnapshot;
    readonly effect: Extract<FabEffect, { readonly type: "replacement" | "prevention" }>;
    readonly applicationPolicy: import("./process.ts").FabPersistedReplacementApplicationPolicy;
    /** Protected hero seat (Yoji "another target hero"). */
    readonly shieldedPlayerId?: string;
    /** Class-shield filter evaluated at application (Sawbones). */
    readonly shieldedFilter?: import("@tcg/flesh-and-blood-types").FabCardFilter;
    /** Chosen damage source for a prevention that names one source. */
    readonly preventedSourceInstanceId?: string;
    /** Redirect damage here before prevention (Yoji self). */
    readonly redirectPlayerId?: string;
    readonly consumptionPolicy: import("./process.ts").FabReplacementConsumptionPolicy;
  };
  /**
   * 1v1: “choose an opponent” always binds the sole opposing seat
   * (`opponentOf`). No multiplayer candidate set.
   */
  readonly "choose-opponent": {
    readonly actorId: string;
    readonly opponentId: string;
  };
  /** CR 1.8.5f: the live attack's declared target is replaced. */
  readonly "retarget-attack": {
    readonly attackInstanceId: string;
    readonly target: import("../state.ts").FabAttackTarget;
    readonly defendingPlayerId: string;
  };
  readonly "continuous-effect-generated": {
    readonly effectId: string;
    readonly controllerId: string;
    readonly source: FabObjectSnapshot;
    readonly origin:
      | { readonly kind: "layer" }
      | {
          readonly kind: "static";
          readonly abilityId: string;
          readonly introducedAtStage: import("./continuous/ir.ts").FabRulesStage | null;
        }
      /** CR 7 defend/activation-window projection: a resolution-kind
       * rule-modification printed on an attacking card ("The defending hero
       * can't defend this with…", Snap Shot's fused bow grant) materializes
       * while the attack sits on the stack/combat chain and expires per its
       * printed scope — see reconciler.ts proposeStaticSourceEvents. */
      | {
          readonly kind: "resolution-window";
          readonly abilityId: string;
        };
    readonly effectPath: readonly (string | number)[];
    readonly simultaneousGroupId: string | null;
    readonly atoms: readonly import("./continuous/ir.ts").FabContinuousAtom[];
    readonly duration: import("./continuous/ir.ts").FabContinuousEffectInstance["duration"];
    readonly expiresAt: import("./continuous/ir.ts").FabContinuousExpiry;
    readonly initialSubjects: readonly import("./continuous/ir.ts").FabContinuousInitialSubject[];
    readonly futureApplicability: {
      readonly filter: import("@tcg/flesh-and-blood-types").FabCardFilter;
      readonly events:
        | readonly import("@tcg/flesh-and-blood-types").FabFutureApplicabilityEvent[]
        | null;
      readonly observesOpponent: boolean;
      readonly count: number;
      readonly ordinal: number;
      // Additive per-turn marker (fab-hero-acceptance); null = never resets.
      readonly resets: "turn" | null;
      readonly sourceInstanceIds: readonly string[] | null;
    } | null;
    readonly observeAsBecome?: boolean;
  };
  readonly "continuous-effect-ceased": {
    readonly effectId: string;
  };
  readonly "continuous-effect-applied": {
    readonly application: import("./continuous/ir.ts").FabContinuousApplication;
  };
  readonly "continuous-effect-changed": {
    readonly previous: import("./continuous/ir.ts").FabContinuousApplication;
    readonly application: import("./continuous/ir.ts").FabContinuousApplication;
  };
  readonly "continuous-effect-stopped-applying": {
    readonly effectId: string;
    readonly atomId: string;
    readonly subject: import("./continuous/ir.ts").FabRulesSubjectRef;
  };
  readonly "continuous-effect-future-object-observed": {
    readonly effectId: string;
    readonly subject: import("./continuous/ir.ts").FabContinuousInitialSubject;
    readonly latched: boolean;
  };
  readonly "gain-assets": {
    readonly playerId: string;
    readonly resources: number;
    readonly chi: number;
    readonly actionPoints: number;
    readonly amp: number;
    /**
     * Provenance discriminant for the log table. Card-effect proposals are the
     * only player-facing record of the granted amount ("effect"), so they
     * narrate; procedural companions such as the crank action point echo a
     * line that is already narrated ("procedure") and stay unlogged.
     */
    readonly origin: "effect" | "procedure";
  };
  readonly "pay-resources": {
    readonly playerId: string;
    readonly amount: number;
  };
  readonly "counter-added": CardEventData & {
    readonly counter: string;
    readonly amount: number;
  };
  /** Numeric ±N property counters (CR 1.15), e.g. battleworn/guardwell −1 defense. */
  readonly "numeric-counter-added": CardEventData & {
    readonly property: "power" | "defense" | "life";
    readonly value: number;
    readonly count: number;
  };
  /** Remove N matching numeric property counters (must already exist on the object). */
  readonly "numeric-counter-removed": CardEventData & {
    readonly property: "power" | "defense" | "life";
    readonly value: number;
    readonly count: number;
  };
  /** CR 8.5.58: sharpen target sword (`count` = total +1{p} counters to place). */
  readonly sharpen: CardEventData & {
    readonly playerId: string;
    readonly count: number;
  };
  readonly "turn-face-down": CardEventData & { readonly playerId: string };
  readonly "shuffle-zone": { readonly playerId: string; readonly zone: FabZone };
  readonly "random-token-request": {
    readonly playerId: string;
    readonly options: readonly string[];
    readonly instanceId: string;
  };
  readonly "roll-request": {
    readonly playerId: string;
    readonly sides: number;
    readonly outputBinding: string | null;
    /** Gambler's Gloves family: reroll the complete modified dice pool. */
    readonly rerollCount?: number;
    /** Ready to Roll: roll this many extra dice of the same sides. */
    readonly extraDice?: number;
    /** Ready to Roll: after extra dice, drop the lowest face. */
    readonly ignore?: "lowest";
  };
  readonly "lose-game": { readonly playerId: string; readonly reason: string };
  readonly "reset-turn-assets": {
    readonly playerIds: readonly string[];
    readonly allyInstanceIds: readonly string[];
  };
  readonly "advance-turn": {
    readonly previousPlayerId: string;
    readonly nextPlayerId: string;
    readonly nextTurnNumber: number;
  };
  readonly "set-status": CardEventData & { readonly status: string };
  readonly "set-tapped": CardEventData & {
    readonly tapped: boolean;
  };
  readonly "wager-loss": {
    readonly wagerId: FabWagerId;
    readonly attack: FabObjectSnapshot;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    readonly winnerId: string;
    readonly loserId: string;
    readonly prize: FabWagerPrize | null;
  };
}

type MissingEventPayload = Exclude<FabTriggerEventName, keyof FabGameEventDataByName>;
type MissingProcedureEventPayload = Exclude<
  FabRulesProcedureEventName,
  keyof FabGameEventDataByName
>;
type UnexpectedEventPayload = Exclude<keyof FabGameEventDataByName, FabGameEventName>;
const eventPayloadMapIsComplete: MissingEventPayload extends never ? true : never = true;
const procedureEventPayloadMapIsComplete: MissingProcedureEventPayload extends never
  ? true
  : never = true;
const eventPayloadMapHasNoExtras: UnexpectedEventPayload extends never ? true : never = true;
void eventPayloadMapIsComplete;
void procedureEventPayloadMapIsComplete;
void eventPayloadMapHasNoExtras;

/** Layer/event bindings. Multi-card chooses bind `readonly FabObjectSnapshot[]`
 * (e.g. Spoiled Skull "them" = 3 banished Actions) for random/opponent picks. */
export interface FabExactAttackBinding {
  readonly kind: "exact-attack";
  readonly attack: FabExactAttackRef;
  readonly object: FabObjectSnapshot;
}

export type FabEventBindings = Readonly<
  Record<
    string,
    | FabObjectSnapshot
    | FabObjectContinuationBinding
    | readonly FabObjectSnapshot[]
    | FabExactAttackBinding
    | string
    | number
    | boolean
  >
>;

export interface FabProposedEventBase<Name extends FabGameEventName> {
  readonly name: Name;
  /** Explicit event performer. `null` means the rules procedure has no actor. */
  readonly actorId?: string | null;
  readonly processId: FabProcessId;
  readonly cause: FabEventCause;
  readonly controllerId: string | null;
  readonly source: FabObjectSnapshot | null;
  readonly affected: readonly FabObjectSnapshot[];
  readonly bindings: FabEventBindings;
  readonly data: FabGameEventDataByName[Name];
  /** Explicit CR 1.9 multi-event identity; omitted events are independent singles. */
  readonly multiEvent?: {
    readonly occurrenceId: FabEventOccurrenceId;
    readonly namedEvent: string | null;
  };
}

export type ProposedEvent<Name extends FabGameEventName = FabGameEventName> = {
  readonly [EventName in Name]: FabProposedEventBase<EventName>;
}[Name];

export type FabGameEvent<Name extends FabGameEventName = FabGameEventName> = {
  readonly [EventName in Name]: FabProposedEventBase<EventName> & {
    readonly eventId: FabEventId;
    readonly batchId: FabEventBatchId;
    readonly batchIndex: number;
    readonly batchSize: number;
    readonly replacementIds: readonly string[];
    readonly turnNumber: number;
    readonly actorId: string | null;
    readonly occurrence: FabEventOccurrence;
    readonly context: FabCommittedEventContext;
  };
}[Name];

export interface FabEventOccurrence {
  readonly occurrenceId: FabEventOccurrenceId;
  readonly kind: "single" | "multi";
  readonly index: number;
  readonly size: number;
  readonly namedEvent: string | null;
}

export interface FabCommittedEventContext {
  /** Turn player when this event committed. Optional only for legacy synthetic tests. */
  readonly turnPlayerId?: string;
  readonly phase: "start" | "action" | "end";
  readonly combatStep:
    | "layer"
    | "attack"
    | "defend"
    | "reaction"
    | "damage"
    | "resolution"
    | "close"
    | null;
  readonly turnNumber: number;
  readonly combatNumber: number | null;
  readonly chainLinkNumber: number | null;
}

export type CommittedEvent<Name extends FabGameEventName = FabGameEventName> = FabGameEvent<Name>;

/** One atomic rules change. Triggers may match the batch or a child, never both. */
export interface FabCommittedEventBatch {
  readonly batchId: FabEventBatchId;
  readonly processId: FabProcessId;
  readonly events: readonly CommittedEvent[];
}

/** One atomic boundary within a larger reversible game procedure. */
export interface FabProposedEventGroup {
  readonly eventGroupId: string;
  readonly required: boolean;
  readonly events: readonly ProposedEvent[];
}

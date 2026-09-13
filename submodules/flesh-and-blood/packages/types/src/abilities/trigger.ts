/**
 * Triggered-effect conditions (CR 6.6).
 *
 * An event pattern describes three independent rules concepts:
 * - who performed the event (`actor`),
 * - which event object is observed (`observes`), and
 * - the event-specific constraints.
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabAbilityType } from "./ability.ts";
import type { FabCondition } from "./condition.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabComparison, FabCounter, FabDamageType, FabZone } from "./primitives.ts";

export type FabBindingName = string;

/** Runtime and compile-time source of truth for card-observable events. */
export const FAB_OBSERVABLE_EVENT_NAMES = [
  "attack",
  "attack-target-declared",
  "hit",
  "deal-damage",
  "dealt-damage",
  "prevent",
  "defend",
  "play",
  "pitch",
  "discard",
  "draw",
  "banish",
  "destroy",
  "search",
  "boost",
  "fuse",
  "charge",
  "clash-win",
  "clash-lose",
  "wager",
  "wager-win",
  "enter-arena",
  "leave-arena",
  "put-into-graveyard",
  "chain-link-resolve",
  "combat-chain-close",
  "start-phase",
  "end-phase",
  "action-phase-start",
  "reaction-step",
  "counter-removed",
  "usurp",
  "crank",
  "transcend",
  "create",
  "complete-contract",
  "trigger",
  "fragment",
  "equip",
  "turn-face-up",
  "activate",
  "beat-chest",
  "clash",
  "move-zone",
  "crowd-cheers",
  "protect",
  "crowd-boos",
  "go-again",
  "gain-keyword",
  "dies",
  "become",
  "transform",
  "gain-life",
  "lose-life",
  "opt",
  "reveal",
  "look",
  "modify-power",
  "roll",
] as const;

/** Only committed rules events may be observed by a triggered effect. */
export type FabObservableEventName = (typeof FAB_OBSERVABLE_EVENT_NAMES)[number];

/** Shared event-name contract used by the event kernel and card DSL. */
export type FabTriggerEventName = FabObservableEventName;

export type FabRelativePlayer =
  | "ability-controller"
  | "opponent"
  | "turn-player"
  | "non-turn-player"
  | "attacking-hero"
  | "defending-hero"
  | "other-hero";

export type FabTriggerActor =
  | { readonly kind: "any" }
  | { readonly kind: "none" }
  | { readonly kind: "player"; readonly player: FabRelativePlayer };

export type FabObjectRelationship =
  | { readonly kind: "any" }
  | {
      readonly kind: "controller";
      readonly player: "ability-controller" | "opponent";
    }
  | {
      readonly kind: "owner";
      readonly player: "ability-controller" | "opponent";
    }
  | {
      readonly kind: "zone-owner";
      readonly player: "ability-controller" | "opponent";
    };

export type FabTriggerObservation<
  SourceSelector extends string,
  SingularSelector extends string = SourceSelector,
  PluralSelector extends string = never,
> =
  | { readonly kind: "none" }
  | { readonly kind: "source"; readonly selector: SourceSelector }
  | {
      readonly kind: "bound-object";
      readonly selector: SingularSelector;
      readonly binding: FabBindingName;
    }
  | {
      readonly kind: "event-object";
      readonly selector: SingularSelector;
      readonly relationship: FabObjectRelationship;
      readonly filter?: FabCardFilter;
      readonly bindAs?: FabBindingName;
    }
  | ([PluralSelector] extends [never]
      ? never
      : {
          readonly kind: "event-objects";
          readonly selector: PluralSelector;
          readonly relationship: FabObjectRelationship;
          readonly filter?: FabCardFilter;
          readonly quantifier: "any" | "all";
          readonly bindAllAs?: FabBindingName;
        });

export interface FabTriggerObservationByEvent {
  readonly attack: FabTriggerObservation<"attack">;
  readonly "attack-target-declared": FabTriggerObservation<"attack">;
  readonly hit: FabTriggerObservation<"attack">;
  readonly "deal-damage": FabTriggerObservation<
    "damage-source" | "damage-target",
    "damage-source" | "damage-target"
  >;
  readonly "dealt-damage": FabTriggerObservation<
    "damage-source" | "damage-target",
    "damage-source" | "damage-target"
  >;
  readonly prevent: FabTriggerObservation<
    "prevention-source",
    "prevention-source" | "damage-source" | "damage-target"
  >;
  readonly defend: FabTriggerObservation<
    "defender" | "defended-attack",
    "defender" | "defended-attack"
  >;
  readonly play: FabTriggerObservation<"played-card">;
  readonly pitch: FabTriggerObservation<"pitched-card">;
  readonly discard: FabTriggerObservation<"discarded-card">;
  readonly draw: FabTriggerObservation<"drawn-card">;
  readonly banish: FabTriggerObservation<"moved-object">;
  readonly destroy: FabTriggerObservation<"moved-object">;
  readonly search: FabTriggerObservation<never, never, "found-cards">;
  readonly boost: FabTriggerObservation<"boosted-card", "boosted-card" | "banished-card">;
  readonly fuse: FabTriggerObservation<"fused-card", "fused-card", "revealed-cards">;
  readonly charge: FabTriggerObservation<"charging-card", "charging-card" | "charged-card">;
  readonly "clash-win": FabTriggerObservation<"revealed-card">;
  readonly "clash-lose": FabTriggerObservation<"revealed-card">;
  readonly wager: FabTriggerObservation<"attack">;
  readonly "wager-win": FabTriggerObservation<"attack">;
  readonly "enter-arena": FabTriggerObservation<"moved-object">;
  readonly "leave-arena": FabTriggerObservation<"moved-object">;
  readonly "put-into-graveyard": FabTriggerObservation<"moved-object">;
  readonly "chain-link-resolve": FabTriggerObservation<"attack">;
  readonly "combat-chain-close": FabTriggerObservation<never>;
  readonly "start-phase": FabTriggerObservation<never>;
  readonly "end-phase": FabTriggerObservation<never>;
  readonly "action-phase-start": FabTriggerObservation<never>;
  readonly "reaction-step": FabTriggerObservation<"attack">;
  readonly "counter-removed": FabTriggerObservation<"object">;
  readonly usurp: FabTriggerObservation<"object">;
  readonly crank: FabTriggerObservation<"object">;
  readonly transcend: FabTriggerObservation<"object">;
  readonly create: FabTriggerObservation<"created-object">;
  readonly "complete-contract": FabTriggerObservation<"object">;
  readonly trigger: FabTriggerObservation<"trigger-source">;
  readonly fragment: FabTriggerObservation<"object">;
  readonly equip: FabTriggerObservation<"moved-object">;
  readonly "turn-face-up": FabTriggerObservation<"object">;
  readonly activate: FabTriggerObservation<"activated-card">;
  readonly "beat-chest": FabTriggerObservation<"object", "object", "discarded-cards">;
  readonly clash: FabTriggerObservation<never>;
  readonly "move-zone": FabTriggerObservation<"moved-object">;
  readonly "crowd-cheers": FabTriggerObservation<never>;
  readonly protect: FabTriggerObservation<never>;
  readonly "crowd-boos": FabTriggerObservation<never>;
  readonly "go-again": FabTriggerObservation<"object">;
  readonly "gain-keyword": FabTriggerObservation<"object">;
  readonly dies: FabTriggerObservation<"moved-object">;
  readonly become: FabTriggerObservation<"object", "object" | "previous-object">;
  readonly transform: FabTriggerObservation<
    "object" | "incoming-object",
    "object" | "previous-object" | "incoming-object"
  >;
  readonly "gain-life": FabTriggerObservation<never>;
  readonly "lose-life": FabTriggerObservation<never>;
  readonly opt: FabTriggerObservation<never>;
  readonly reveal: FabTriggerObservation<"revealed-card">;
  readonly look: FabTriggerObservation<"looked-at-card">;
  readonly "modify-power": FabTriggerObservation<"modified-object">;
  readonly roll: FabTriggerObservation<never>;
}

type MissingObservation = Exclude<FabObservableEventName, keyof FabTriggerObservationByEvent>;
type UnexpectedObservation = Exclude<keyof FabTriggerObservationByEvent, FabObservableEventName>;
const observationsAreComplete: MissingObservation extends never ? true : never = true;
const observationsHaveNoExtras: UnexpectedObservation extends never ? true : never = true;
void observationsAreComplete;
void observationsHaveNoExtras;

export interface FabCommittedEventContext {
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

export type FabEventWindow =
  | { readonly kind: "phase"; readonly phase: FabCommittedEventContext["phase"] }
  | {
      readonly kind: "combat-step";
      readonly step: Exclude<FabCommittedEventContext["combatStep"], null>;
    };

export type FabEventTargetPattern =
  | { readonly kind: "any" }
  | {
      readonly kind: "hero";
      readonly player?: FabRelativePlayer;
      readonly filter?: FabCardFilter;
    }
  | { readonly kind: "object"; readonly filter?: FabCardFilter };

export type FabZoneTransitionReason =
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

export interface FabAttackTriggerConstraints {
  readonly target?: FabEventTargetPattern;
  readonly fused?: true;
  readonly amount?: FabComparison;
}

export interface FabDamageTriggerConstraints {
  readonly damageType?: FabDamageType;
  readonly amount?: FabComparison;
  readonly target?: FabEventTargetPattern;
}

export interface FabZoneTransitionTriggerConstraints {
  readonly from?: readonly FabZone[];
  readonly excludeFrom?: readonly FabZone[];
  readonly to?: FabZone;
  readonly position?: "top" | "bottom";
  readonly faceDown?: boolean;
  readonly random?: boolean;
  readonly reason?: FabZoneTransitionReason;
}

export type FabDefendCohortConstraint =
  | { readonly kind: "alone" }
  | {
      readonly kind: "together-with";
      readonly filter: FabCardFilter;
      readonly count?: FabComparison;
    }
  | {
      readonly kind: "together-with-each";
      readonly filters: readonly [FabCardFilter, FabCardFilter, ...FabCardFilter[]];
    };

export interface FabDefendTriggerConstraints {
  readonly origin?: readonly (
    | FabZone
    | "head"
    | "chest"
    | "arms"
    | "legs"
    | "weapon1"
    | "weapon2"
  )[];
  readonly cohort?: FabDefendCohortConstraint;
  readonly defendedAttack?: FabCardFilter;
  readonly bindDefendedAttackAs?: FabBindingName;
  readonly amount?: FabComparison;
  readonly target?: FabEventTargetPattern;
}

export interface FabTriggerConstraintsByEvent {
  readonly attack: FabAttackTriggerConstraints;
  readonly "attack-target-declared": Pick<FabAttackTriggerConstraints, "target">;
  readonly hit: FabAttackTriggerConstraints;
  readonly "deal-damage": FabDamageTriggerConstraints;
  readonly "dealt-damage": FabDamageTriggerConstraints;
  readonly prevent: FabDamageTriggerConstraints;
  readonly defend: FabDefendTriggerConstraints;
  readonly play: { readonly from?: readonly FabZone[] };
  readonly pitch: { readonly amount?: FabComparison };
  readonly discard: { readonly random?: boolean; readonly amount?: FabComparison };
  readonly draw: { readonly amount?: FabComparison };
  readonly banish: FabZoneTransitionTriggerConstraints;
  readonly destroy: FabZoneTransitionTriggerConstraints;
  readonly search: { readonly amount?: FabComparison };
  readonly boost: { readonly amount?: FabComparison };
  readonly fuse: { readonly amount?: FabComparison };
  readonly charge: Record<never, never>;
  readonly "clash-win": Record<never, never>;
  readonly "clash-lose": Record<never, never>;
  readonly wager: Record<never, never>;
  readonly "wager-win": Record<never, never>;
  readonly "enter-arena": FabZoneTransitionTriggerConstraints;
  readonly "leave-arena": FabZoneTransitionTriggerConstraints;
  readonly "put-into-graveyard": FabZoneTransitionTriggerConstraints;
  readonly "chain-link-resolve": { readonly didHit?: boolean };
  readonly "combat-chain-close": { readonly attackCount?: FabComparison };
  readonly "start-phase": Record<never, never>;
  readonly "end-phase": Record<never, never>;
  readonly "action-phase-start": Record<never, never>;
  readonly "reaction-step": Record<never, never>;
  readonly "counter-removed": {
    readonly counter?: FabCounter;
    readonly amount?: FabComparison;
    readonly remaining?: number;
  };
  readonly usurp: Record<never, never>;
  readonly crank: Record<never, never>;
  readonly transcend: Record<never, never>;
  readonly create: { readonly amount?: FabComparison };
  readonly "complete-contract": Record<never, never>;
  readonly trigger: { readonly abilityType?: FabAbilityType };
  readonly fragment: Record<never, never>;
  readonly equip: FabZoneTransitionTriggerConstraints;
  readonly "turn-face-up": Record<never, never>;
  readonly activate: { readonly abilityType?: FabAbilityType };
  readonly "beat-chest": { readonly amount?: FabComparison };
  readonly clash: Record<never, never>;
  readonly "move-zone": FabZoneTransitionTriggerConstraints;
  readonly "crowd-cheers": Record<never, never>;
  readonly protect: Record<never, never>;
  readonly "crowd-boos": Record<never, never>;
  readonly "go-again": Record<never, never>;
  readonly "gain-keyword": { readonly keyword?: string };
  readonly dies: FabZoneTransitionTriggerConstraints;
  readonly become: Record<never, never>;
  /**
   * CR 8.5.36a: the observed identity transforms from/into a partner
   * identity. `transformPartner` filters that OPPOSITE side of the transform
   * (the incoming identity when the source observes the transformed object;
   * the transformed object when the source observes the incoming identity).
   * `hasStatus: "different-name"` inside the filter compares the partner's
   * names against the observed source's names.
   */
  readonly transform: { readonly transformPartner?: FabCardFilter };
  readonly "gain-life": { readonly amount?: FabComparison };
  readonly "lose-life": { readonly amount?: FabComparison; readonly source?: string };
  readonly opt: { readonly amount?: FabComparison };
  readonly reveal: { readonly amount?: FabComparison };
  readonly look: { readonly amount?: FabComparison };
  readonly "modify-power": { readonly delta?: FabComparison };
  readonly roll: { readonly sides?: number; readonly result?: FabComparison };
}

type MissingConstraints = Exclude<FabObservableEventName, keyof FabTriggerConstraintsByEvent>;
type UnexpectedConstraints = Exclude<keyof FabTriggerConstraintsByEvent, FabObservableEventName>;
const constraintsAreComplete: MissingConstraints extends never ? true : never = true;
const constraintsHaveNoExtras: UnexpectedConstraints extends never ? true : never = true;
void constraintsAreComplete;
void constraintsHaveNoExtras;

export type FabSingleTriggerEventPattern<
  Name extends FabObservableEventName = FabObservableEventName,
> = {
  readonly [EventName in Name]: Readonly<
    {
      readonly name: EventName;
      readonly actor: FabTriggerActor;
      readonly observes: FabTriggerObservationByEvent[EventName];
      readonly during?: FabEventWindow;
    } & FabTriggerConstraintsByEvent[EventName]
  >;
}[Name];

export type FabTriggerEventExpression =
  | FabSingleTriggerEventPattern
  | {
      readonly kind: "any-of";
      readonly patterns: readonly [
        FabSingleTriggerEventPattern,
        FabSingleTriggerEventPattern,
        ...FabSingleTriggerEventPattern[],
      ];
    };

export type FabTriggerCondition =
  | { readonly kind: "event"; readonly event: FabTriggerEventExpression }
  | { readonly kind: "state"; readonly state: FabCondition }
  | {
      readonly kind: "event-and-state";
      readonly event: FabTriggerEventExpression;
      readonly state: FabCondition;
    };

/** Canonical trigger condition used by static, delayed, and inline owners. */
export type FabTrigger = FabTriggerCondition;

/** A single-event pattern retained for event-pattern consumers. */
export type FabTriggerEvent = FabSingleTriggerEventPattern;

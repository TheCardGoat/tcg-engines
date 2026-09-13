import type {
  FabAmount,
  FabBaseObjectProperties,
  FabCardFilter,
  FabCondition,
  FabDamageType,
  FabDuration,
  FabEffect,
  FabFutureApplicabilityEvent,
  FabGrantableProperty,
  FabNumericProperty,
  FabPlayOrigin,
  FabPlayer,
  FabTarget,
} from "@tcg/flesh-and-blood-types";
import type { FabEventId, FabObjectSnapshot, FabProcessId } from "../events.ts";
import type { FabAttackProxyId } from "../../game/identity.ts";

export type FabRulesStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type FabNumericSubstage = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type FabObjectSubstage = "independent" | "dependent" | FabNumericSubstage;
export type FabRuleAction = Extract<FabEffect, { readonly type: "rule-modification" }>["action"];
export type FabRuleAttackTargetMode = NonNullable<
  Extract<FabEffect, { readonly type: "rule-modification" }>["target"]
>;

export type FabRuleParameters =
  | {
      readonly kind: "play-card";
      readonly costModification: NonNullable<
        Extract<FabEffect, { readonly type: "play-card" }>["costModification"]
      > | null;
      readonly asType: string | null;
      /** Origins from which this permission may be exercised. Null means the
       * permission does not impose an origin restriction. */
      readonly fromZones: readonly FabPlayOrigin[] | null;
    }
  | { readonly kind: "can-be-attacked" }
  | { readonly kind: "freeze" }
  | {
      readonly kind: "rule-modification";
      readonly targetPlayer?: import("@tcg/flesh-and-blood-types").FabPlayer;
      /**
       * Attack-target widening from printed rule-modification.target
       * (Bolfar "may attack an additional hero", arrows "any opposing hero", …).
       */
      readonly attackTargetMode: FabRuleAttackTargetMode | null;
      /**
       * Attack/object filter for restrictions that apply only while the
       * attack matches (Benji: "your attack action cards with 2 or less {p}").
       * Distinct from atom.filter, which filters the defending / acted-upon cards.
       */
      readonly subjectFilter: FabCardFilter | null;
      /**
       * Source gate for be-destroyed / gain-power:
       * "opponents-effects" — destroy events whose layer controller is not
       * the protected object's controller (PEN252 Dynastic Diadem).
       * "self-or-attack-reaction-effects" — power-add whose generating source
       * is the restricted AAC itself or an Attack Reaction (CRU182 Snag).
       */
      readonly sourceRestriction: "opponents-effects" | "self-or-attack-reaction-effects" | null;
      /**
       * Data-driven defender-count cap (Confidence CR 8.6.35 "can't be defended
       * by more than N non-block cards"). `count` is the max number of defenders
       * matching `filter` (null filter = all defenders) that may defend the
       * attack. Generalizes the hardcoded Dominate/Overpower counting.
       */
      readonly maxDefenders: {
        readonly count: number;
        readonly filter: FabCardFilter | null;
      } | null;
      /** Qualifying 2H swords consume one weapon seat for this controller. */
      readonly handedness: "2h-sword-as-1h" | null;
      /** When set, restrict-gain-keyword only blocks that keyword. */
      readonly keyword: string | null;
      /** When set, restrict-modify-damage only blocks that damage type. */
      readonly damageType: FabDamageType | null;
      /** Amplify mode only: printed "+1" added on top of an incoming
       * power gain ("would gain X, instead gains X plus 1"). */
      readonly gainDelta: number | null;
    };

export interface FabObjectRef {
  readonly instanceId: string;
  readonly incarnation: number;
}

/** Exact identity of one attack declaration.
 *
 * Attack-action cards use their object incarnation. Activated weapon/ally
 * attacks use the combat proxy, because the physical source can attack again
 * later without being the same attack. */
export type FabExactAttackRef =
  | (FabObjectRef & { readonly attack: { readonly kind: "card" } })
  | (FabObjectRef & {
      readonly attack: { readonly kind: "proxy"; readonly proxyId: FabAttackProxyId };
    });

export type FabContinuousInitialSubject = FabObjectRef | FabExactAttackRef;

export interface FabRulesTimestamp {
  readonly sequence: number;
  readonly simultaneousGroupId: string | null;
}

export type FabRulesSubjectRef =
  | { readonly kind: "object"; readonly ref: FabObjectRef }
  | { readonly kind: "player"; readonly playerId: string }
  | { readonly kind: "game" };

interface FabContinuousAtomBase {
  readonly atomId: string;
  readonly target: FabTarget | null;
  readonly condition: FabCondition | null;
  /** Per-application-subject gate compiled from in-effect conditionals. */
  readonly subjectCondition?: FabCondition | null;
  readonly dependencyStages: readonly FabRulesStage[];
  readonly applicationStage: FabRulesStage | "rule";
  readonly substage: FabObjectSubstage | null;
}

export interface FabRuleAtom extends FabContinuousAtomBase {
  readonly kind: "rule";
  readonly stage: "rule";
  readonly mode: "restrict" | "require" | "allow" | "amplify";
  readonly action: FabRuleAction;
  readonly filter: FabCardFilter | null;
  readonly parameters: FabRuleParameters;
  /** CR 8.4.11 dynamic rule limits ("X is the number of Evos you have
   * equipped") keep the authored FabAmount; the rules view resolves it in
   * the effect controller's seat at evaluation time. */
  readonly limit?: { readonly count: number | FabAmount };
}

export interface FabStage1CopyAtom extends FabContinuousAtomBase {
  readonly kind: "copy";
  readonly stage: 1;
  readonly source: FabTarget;
  /** Frozen CR 8.5.25a copyable properties captured when generated. */
  readonly frozenSource: FabBaseObjectProperties | null;
  /** Audit provenance only; never dereferenced to recalculate the copy. */
  readonly sourceProvenance: FabObjectRef | null;
  readonly except: "base-life" | null;
}

export interface FabStage1BecomeAtom extends FabContinuousAtomBase {
  readonly kind: "become";
  readonly stage: 1;
  readonly source: "named-hero" | "ally";
  readonly except: "base-life" | null;
  readonly filter: FabCardFilter | null;
  readonly basePower: FabAmount | null;
  readonly baseLife: FabAmount | null;
  /** Frozen named-hero copyable properties captured when generated. */
  readonly frozenSource: FabBaseObjectProperties | null;
}

export interface FabStage2ControllerAtom extends FabContinuousAtomBase {
  readonly kind: "controller";
  readonly stage: 2;
  readonly controller: FabPlayer;
}

export interface FabStage3IdentityAtom extends FabContinuousAtomBase {
  readonly kind: "identity";
  readonly stage: 3;
  readonly property: Extract<FabGrantableProperty, { readonly kind: "name" | "color" }>;
  readonly operation: "grant" | "remove";
}

export interface FabStage4TypeAtom extends FabContinuousAtomBase {
  readonly kind: "type";
  readonly stage: 4;
  readonly property: Extract<FabGrantableProperty, { readonly kind: "type" | "subtype" }>;
  readonly operation: "grant" | "remove";
}

export interface FabStage5SupertypeAtom extends FabContinuousAtomBase {
  readonly kind: "supertype";
  readonly stage: 5;
  readonly property: Extract<FabGrantableProperty, { readonly kind: "supertype" }>;
  readonly operation: "grant" | "remove";
}

export interface FabStage6AbilityAtom extends FabContinuousAtomBase {
  readonly kind: "ability";
  readonly stage: 6;
  readonly property: Extract<
    FabGrantableProperty,
    { readonly kind: "ability" | "abilities" | "keyword" }
  >;
  readonly operation: "grant" | "remove";
}

export interface FabStage6CopyAbilitiesAtom extends FabContinuousAtomBase {
  readonly kind: "copy-abilities";
  readonly stage: 6;
  readonly source: FabTarget;
}

interface FabNumericAtomBase extends FabContinuousAtomBase {
  readonly property: FabNumericProperty;
  readonly amount: FabAmount;
  readonly substage: FabNumericSubstage;
}

export interface FabStage7BaseNumericAtom extends FabNumericAtomBase {
  readonly kind: "base-numeric";
  readonly stage: 7;
  readonly operation: "add-property" | "remove-property" | "set";
}

export interface FabStage8NumericAtom extends FabNumericAtomBase {
  readonly kind: "numeric";
  readonly stage: 8;
  readonly operation:
    | "add-property"
    | "remove-property"
    | "set"
    | "multiply"
    | "divide"
    | "add"
    | "subtract";
  /**
   * Divide rounding mode from `modify-numeric.rounding` (Lyath "halved,
   * rounded up"). Defaults to floor when omitted (Kayo-style "rounded down").
   */
  readonly rounding?: "up" | "down";
}

/** Quote-only modifier for an activated ability's resource cost. */
export interface FabActivationCostAtom extends FabContinuousAtomBase {
  readonly kind: "activation-cost";
  readonly stage: 8;
  readonly target: FabTarget;
  readonly operation: "add" | "subtract";
  readonly amount: FabAmount;
}

export type FabContinuousAtom =
  | FabRuleAtom
  | FabStage1CopyAtom
  | FabStage1BecomeAtom
  | FabStage2ControllerAtom
  | FabStage3IdentityAtom
  | FabStage4TypeAtom
  | FabStage5SupertypeAtom
  | FabStage6AbilityAtom
  | FabStage6CopyAbilitiesAtom
  | FabStage7BaseNumericAtom
  | FabStage8NumericAtom
  | FabActivationCostAtom;

export type FabContinuousAtomKind = FabContinuousAtom["kind"];

export const FAB_CONTINUOUS_ATOM_STAGE = {
  rule: "rule",
  copy: 1,
  become: 1,
  controller: 2,
  identity: 3,
  type: 4,
  supertype: 5,
  ability: 6,
  "copy-abilities": 6,
  "base-numeric": 7,
  numeric: 8,
  "activation-cost": 8,
} as const satisfies Record<FabContinuousAtomKind, FabRulesStage | "rule">;

export interface FabResolvedBindings {
  readonly objects: Readonly<Record<string, readonly FabObjectRef[]>>;
  readonly numbers: Readonly<Record<string, number>>;
  readonly strings: Readonly<Record<string, string>>;
}

export type FabEvaluatedContribution =
  | {
      readonly kind: "rule";
      readonly action: FabRuleAction;
      readonly mode: "restrict" | "require" | "allow" | "amplify";
    }
  | { readonly kind: "base-properties"; readonly value: FabBaseObjectProperties }
  | { readonly kind: "controller"; readonly controllerId: string | null }
  | {
      readonly kind: "property";
      readonly property: FabGrantableProperty;
      readonly operation: "grant" | "remove";
    }
  | {
      readonly kind: "numeric";
      readonly property: FabNumericProperty;
      readonly operation: FabStage7BaseNumericAtom["operation"] | FabStage8NumericAtom["operation"];
      readonly value: number | null;
      readonly previousValue: number | null;
      readonly delta: number | null;
      readonly propertyPresent: boolean;
    };

export interface FabContinuousApplication {
  readonly effectId: string;
  readonly atomId: string;
  readonly subject: FabRulesSubjectRef;
  readonly contribution: FabEvaluatedContribution;
  readonly lockedBindings: FabResolvedBindings;
  readonly firstAppliedAt: FabRulesTimestamp;
  readonly lastChangedAt: FabRulesTimestamp;
  readonly fingerprint: string;
}

export interface FabContinuousOrderingRecord {
  readonly orderingId: string;
  readonly timestamp: FabRulesTimestamp;
  readonly subject: Extract<FabRulesSubjectRef, { readonly kind: "object" }>;
  readonly stage: FabRulesStage;
  readonly substage: FabObjectSubstage | null;
  readonly orderedAtomIds: readonly string[];
  readonly decidedByPlayerId: string;
}

export type FabContinuousExpiry =
  | { readonly kind: "turn"; readonly turnNumber: number }
  /** Expires as the named player's next start phase begins. The creation turn
   * prevents a permission generated during that player's current start phase
   * from expiring immediately. */
  | {
      readonly kind: "player-turn-start";
      readonly playerId: string;
      readonly afterTurnNumber: number;
    }
  /** CR 6.2.2a "until the end of [your/their] next turn": expires as the
   * named player's next turn ends. The turn number is the anchor player's next
   * turn, fixed at generation (a controller change never moves it), so the
   * lifetime evaluates exactly like a {@link turn} expiry — active through the
   * anchored turn, gone once the turn advances past it. */
  | {
      readonly kind: "player-turn-end";
      readonly playerId: string;
      readonly turnNumber: number;
    }
  /** Lifetime through the named player's next action phase. Atoms apply only
   * while that player is in the action phase on `windowTurnNumber`. */
  | {
      readonly kind: "player-action-phase-window";
      readonly playerId: string;
      readonly windowTurnNumber: number;
    }
  /** Lifetime through the named player's next end phase. Atoms apply only
   * while that player is in the end phase on `windowTurnNumber`. */
  | {
      readonly kind: "player-end-phase-window";
      readonly playerId: string;
      readonly windowTurnNumber: number;
    }
  | { readonly kind: "combat-chain"; readonly combatNumber: number }
  | { readonly kind: "source"; readonly ref: FabObjectRef }
  | { readonly kind: "permanent" };

export interface FabFutureObjectApplicability {
  readonly filter: FabCardFilter;
  /** Public action kinds allowed to consume this applicator; null means any. */
  readonly events: readonly FabFutureApplicabilityEvent[] | null;
  /** Whether the original target selected an opponent's objects. The filter
   * itself is card-shaped and therefore cannot retain that seat constraint. */
  readonly observesOpponent: boolean;
  /** Original quota from `appliesTo.count` (default 1). Persisted so a
   * per-turn applicator (`resets === "turn"`) can re-arm `remaining` to this
   * value at the start of each of the controller's turns. */
  readonly count: number;
  readonly remaining: number;
  readonly ordinal: number;
  /** Per-turn re-arm marker. "turn" — quota refreshes at the start of each
   * of the controller's turns (CR: "first X each turn"); null — fires once
   * for the lifetime of the continuous effect. */
  readonly resets: "turn" | null;
  /**
   * Physical source instance ids for `appliesTo.attacksOf` — only attacks
   * whose proxy source (or card instance) is one of these may latch.
   */
  readonly sourceInstanceIds: readonly string[] | null;
  readonly observedSubjects: readonly FabContinuousInitialSubject[];
  readonly latchedSubjects: readonly FabContinuousInitialSubject[];
}

interface FabContinuousEffectInstanceBase {
  readonly effectId: string;
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly effectPath: readonly (string | number)[];
  readonly atoms: readonly FabContinuousAtom[];
  readonly timestamp: FabRulesTimestamp;
  readonly duration: FabDuration | "while-functional";
  readonly expiresAt: FabContinuousExpiry;
  readonly createdByEventId: FabEventId | null;
  readonly initialSubjects: readonly FabContinuousInitialSubject[];
  readonly futureApplicability: FabFutureObjectApplicability | null;
  readonly applications: readonly FabContinuousApplication[];
  readonly observeAsBecome?: boolean;
}

export interface FabLayerContinuousEffectInstance extends FabContinuousEffectInstanceBase {
  readonly origin: "layer";
  readonly lockedBindings: FabResolvedBindings;
}

export interface FabStaticContinuousEffectInstance extends FabContinuousEffectInstanceBase {
  readonly origin: "static";
  readonly abilityId: string;
  /** Process in which a granted static ability first became functional. */
  readonly introducedDuringProcessId: FabProcessId | null;
  /** Do not revisit object stages before this stage during that same process. */
  readonly introducedAtStage: FabRulesStage | null;
}

/** CR 7 defend/activation-window projection of a resolution-kind
 * rule-modification (action "defend"/"activate") printed on an attacking
 * card. Reconciler-generated while the Action+Attack sits on the
 * stack/combat chain; lifecycle is governed solely by `expiresAt` per the
 * printed scope (combat-chain expiry = this link's window, turn expiry for
 * "this turn" grants) — the static reconciliation cease pass never touches
 * this origin. */
export interface FabResolutionWindowContinuousEffectInstance extends FabContinuousEffectInstanceBase {
  readonly origin: "resolution-window";
  readonly abilityId: string;
}

export type FabContinuousEffectInstance =
  | FabLayerContinuousEffectInstance
  | FabStaticContinuousEffectInstance
  | FabResolutionWindowContinuousEffectInstance;

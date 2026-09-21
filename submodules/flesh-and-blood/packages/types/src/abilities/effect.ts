/**
 * Effects (CR 1.8, 6, 8.5).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabTriggeredResolution, FleshAndBloodAbility } from "./ability.ts";
import type { FabAmount, FabSelectionCount } from "./amount.ts";
import type { FabCondition } from "./condition.ts";
import type { FabCost } from "./cost.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabKeyword } from "./keyword.ts";
import type {
  FabComparison,
  FabCounter,
  FabDamageType,
  FabDestination,
  FabDuration,
  FabFutureApplicabilityEvent,
  FabPlayOrigin,
  FabPlayer,
  FabZone,
} from "./primitives.ts";
import type { FabTarget } from "./target.ts";
import type { FabTriggerCondition, FabTriggerEventName } from "./trigger.ts";

// ---------------------------------------------------------------------------
// Effects (1.8, 6, 8.5)
// ---------------------------------------------------------------------------

/**
 * CR 6.6.3a: every delayed trigger has a fixed lifetime. Even triggers that
 * wait for a phase or combat boundary carry that boundary as a duration so an
 * unmet additional condition cannot leave a match-long armed trigger behind.
 */
export type FabDelayedTriggerPolicy = {
  readonly kind: "windowed";
  readonly duration: Exclude<FabDuration, "until-triggered" | "permanent">;
  readonly matching: "first" | "every";
};

/** Properties grantable/removable by continuous effects (stages 3–6, 6.3.2). */
export type FabGrantableProperty =
  | { kind: "keyword"; keyword: FabKeyword }
  | { kind: "type"; value: string }
  | { kind: "subtype"; value: string }
  | { kind: "supertype"; value: string }
  | { kind: "ability"; ability: FleshAndBloodAbility }
  /** Wildcard for "loses and can't gain abilities" (remove-property only). */
  | { kind: "abilities" }
  | { kind: "color"; value: "red" | "yellow" | "blue" | "chosen" | "all" }
  | { kind: "name"; value: string }
  /** Free-form status grant ("You are marked until an opponent hits you"). */
  | { kind: "status"; value: string };

type FabEventPatternName =
  | FabTriggerEventName
  | "move-zone"
  | "create"
  | "gain"
  | "damage"
  | "sharpen"
  | "wager-loss"
  | "clash-outcome"
  | "clash"
  | "continuous-effect-applied"
  | "continuous-effect-changed"
  | "prevent";

type FabDamageEventPatternName = "deal-damage" | "dealt-damage" | "hit" | "prevent" | "damage";

type FabMoveEventPatternName =
  | "move-zone"
  | "banish"
  | "destroy"
  | "discard"
  | "draw"
  | "put-into-graveyard"
  | "enter-arena"
  | "leave-arena"
  | "enter-or-leave-arena";

interface FabEventPatternShared {
  subject?: "self" | "any" | FabCardFilter;
  filter?: FabCardFilter;
  /** Whose event is replaced ("an opponent would gain {h}"). */
  player?: FabPlayer;
  /** Event target filter ("dealt damage to a hero"). */
  target?: "hero" | "any" | "self" | FabCardFilter;
  /** Numeric bound on the event amount ("you would deal less than 4 damage"). */
  comparison?: FabComparison;
  /** Event source qualifier ("tokens created from a wager" — HVY Double
   * Down; "lose {h} from blood debt" — DTD Blasmophet). */
  source?: "wager" | "blood-debt";
}

/** Event pattern matched by replacement effects (6.4.1). Per-event payloads. */
export type FabEventPattern =
  | (FabEventPatternShared & {
      name: "create";
      /** Creator identity is independent of the receiving player (player). */
      creator: "controller" | "any";
      /** First matching opportunity versus every matching creation in the duration. */
      occurrences: "first" | "every";
    })
  | (FabEventPatternShared & {
      name: FabDamageEventPatternName | readonly FabDamageEventPatternName[];
      damageType?: FabDamageType;
    })
  | (FabEventPatternShared & {
      name: FabMoveEventPatternName | readonly FabMoveEventPatternName[];
      from?: FabZone;
      excludeFrom?: readonly FabZone[];
      to?: FabZone;
      position?: "top" | "bottom";
    })
  | (FabEventPatternShared & {
      name:
        | Exclude<
            FabEventPatternName,
            FabDamageEventPatternName | FabMoveEventPatternName | "create"
          >
        | readonly Exclude<FabEventPatternName, "create">[];
    });

export interface FabEffectBase {
  /** Floating applicator (6.2.4, 1.8.10): latches onto the next matching
   * future object/event, e.g. "your next dagger attack this turn". */
  appliesTo?: {
    next: FabCardFilter;
    /**
     * Restrict future attack subjects to attacks whose source is a target
     * resolved when this effect was generated ("that 1H weapon's attacks").
     * `true` uses the effect's object targets. `{ binding }` uses a named
     * object binding. Distinct from `next` alone, which matches any object
     * of that type box (and would buff a second saber).
     */
    attacksOf?: true | { readonly binding: string };
    /** Restrict which public action may consume the floating applicator. */
    events?: readonly FabFutureApplicabilityEvent[];
    /** Ordinal applicator: "your first/second sword attack this turn". */
    ordinal?: number;
    /** Multi-count applicator: "your next 3 attacks this turn". `{ type: "all" }` is unbounded. */
    count?: FabSelectionCount;
    /** Per-turn applicator — the ordinal/count quota resets at the start of
     * each of the controller's turns ("your first attack with stealth each
     * turn"). Without this the applicator fires once for the lifetime of the
     * continuous effect. */
    perTurn?: boolean;
  };
  outputBinding?: string;
}

/**
 * Convenience sources for a name-card prompt. These never change which names
 * are legal; they only surface names the acting player is already entitled to
 * identify. In particular, no source may inspect either player's deck.
 */
export type FabNameCardSuggestionSource =
  | "your-hand"
  | "revealed-this-resolution"
  | "opponent-graveyard"
  | "face-up-banished"
  | "combat-chain"
  | "visible-cards";

/** Printed restrictions that narrow the otherwise global CR 8.5.21 catalog. */
export type FabNameCardRestriction = "another-card" | "living-legend-hero";

export type FabEffect = FabEffectBase &
  // -- structural -------------------------------------------------------
  (
    | { type: "sequence"; steps: readonly FabEffect[] }
    /** "Do X. If you do, Y" — Y only after X produced events. */
    | { type: "if-you-do"; effect: FabEffect; then: FabEffect }
    /** CR 6.4.7 self-replacement: a sequence step that REPLACES the events of
     * the immediately preceding step in the same ability ("[EFFECT].
     * [CONDITION], instead [MODIFICATION]"). The condition is evaluated when
     * the preceding effect is generated (6.4.7b); when it holds, the preceding
     * step's events never commit — the instead-effect's events occur in their
     * place (6.4.6). Only meaningful as the step directly after the effect it
     * replaces. */
    | {
        type: "self-replacement";
        condition?: FabCondition;
        modification: FabEffect;
      }
    /** Controller chooses one of the listed effects ("This gets +1{p} or go
     * again" — Backspin Thrust). */
    | { type: "choice"; options: readonly FabEffect[] }
    | {
        type: "conditional";
        condition: FabCondition;
        then: FabEffect;
        else?: FabEffect;
      }
    | {
        type: "optional";
        effect: FabEffect;
        chooser?: FabPlayer;
        /** "You may X. If you do, Y" — Y only happens when X was chosen. */
        then?: FabEffect;
      }
    | { type: "for-each"; target: FabTarget; effect: FabEffect }
    /** Remove counters as an effect ("you may remove a +1{p} counter from it"). */
    | { type: "remove-counters"; counter: FabCounter; count: FabSelectionCount; target: FabTarget }
    | { type: "repeat"; effect: FabEffect; times?: FabAmount; until?: "declined" | FabCondition }
    /** CR 6.6.3: a layer-continuous effect that generates a delayed trigger. */
    | {
        type: "delayed-trigger";
        trigger: FabTriggerCondition;
        policy: FabDelayedTriggerPolicy;
        resolution: FabTriggeredResolution;
      }
    /** CR 6.6.4: a discrete effect that may trigger only when generated. */
    | {
        type: "inline-trigger";
        trigger: FabTriggerCondition;
        resolution: FabTriggeredResolution;
      }
    // -- leaf effects (8.5) ------------------------------------------------
    | {
        type: "deal-damage";
        damageType: FabDamageType;
        amount: FabAmount;
        target: FabTarget;
        source?: FabTarget;
      }
    | { type: "gain-life" | "lose-life"; amount: FabAmount; target: FabTarget }
    | {
        type: "gain-action-points" | "gain-resources" | "gain-chi";
        amount: FabAmount;
        target?: FabPlayer;
      }
    | { type: "draw"; count: FabAmount; player: FabPlayer }
    /** "Take an extra turn after this one" (Standing Ovation). */
    | { type: "take-extra-turn"; player: FabPlayer }
    /** "They lose the game" (DYN Regicide). */
    | { type: "lose-game"; player: FabPlayer }
    | {
        type: "discard" | "banish";
        target: FabTarget;
        faceDown?: boolean;
        until?: FabDuration;
        /** Random selection ("banish a random defending card" — OUT Cyclone
         * Roundhouse). */
        random?: boolean;
      }
    | ({
        target: FabTarget;
        delay?: "end-phase";
        outputBinding?: string;
        /**
         * Negate stacked triggered layers from the targeted source whose
         * ability id is `keyword:${triggeredKeyword}` (Semblance: phantasm).
         */
        triggeredKeyword?: string;
      } & (
        | { type: "destroy"; ifTargetMatches?: never }
        | {
            type: "negate";
            /** Resolution-only condition; does not restrict declared targets. */
            ifTargetMatches?: FabCardFilter;
          }
      ))
    | { type: "turn-face-down" | "turn-face-up"; target: FabTarget; outputBinding?: string }
    /** "Do X unless you do Y": the controller may perform `escape`; if they
     * decline, `effect` happens. */
    | { type: "unless"; effect: FabEffect; escape: FabEffect }
    | { type: "move-card"; target: FabTarget; to: FabDestination; faceDown?: boolean }
    /** Move the resolving Aura under a targeted Ally permanent. Bind is a
     * topology operation, not a card-local status: the Aura remains the
     * source of its static effects while it is the Ally's sub-card. */
    | { type: "bind-aura"; target: FabTarget }
    | {
        type: "search";
        zones: readonly FabZone[];
        filter: FabCardFilter;
        mayFail?: boolean;
        to: FabDestination;
        /** Whose zones are searched ("search their deck"). */
        player?: FabPlayer;
        /** How many cards may be selected ("any number of Inner Chi"). */
        count?: FabSelectionCount;
        /** When set, the choice is restricted to the cards bound by an
         * earlier look/reveal step rather than `zones` (HVY Reel In: "Look
         * at the top X+1 cards … Choose up to 4 traps …"). */
        fromBinding?: string;
        /** Bind the tutored card for follow-ups ("you may play it this turn"). */
        outputBinding?: string;
        /** Destination visibility for search-and-banish style effects. */
        faceDown?: boolean;
      }
    | { type: "shuffle"; zone?: FabZone; player?: FabPlayer }
    | {
        type: "reveal" | "look";
        target: FabTarget;
        duration?: FabDuration;
        /** Filter restricting the card chosen from the looked-at zone ("look at their hand and choose a card without base {d}"). */ choiceFilter?: FabCardFilter;
      }
    /** Determine a nonempty subset whose cards all have the same full name,
     * while authoritatively ordering every unselected object. Both cohorts
     * come from one bounded at-resolution object pool. */
    | {
        type: "choose-same-name-group";
        target: Extract<FabTarget, { selector: "object" }> & { declared: "at-resolution" };
        selectedBinding: string;
        orderedRemainderBinding: string;
      }
    | { type: "opt"; count: FabAmount }
    /** Put a known cohort back on the top or bottom of its deck in controller-selected order. */
    | {
        type: "reorder-deck";
        target: Extract<FabTarget, { selector: "binding" }>;
        position: "top" | "bottom";
      }
    /** Amp keyword action: the next arcane damage this turn gets +N. */
    | {
        type: "amp";
        amount: FabAmount;
        /** Printed source restriction for non-keyword Amp-like text (Chorus).
         * Plain CR 8.5.47 Amp intentionally leaves this absent. */
        sourceFilter?: FabCardFilter;
      }
    /** Sharpen keyword action (custom sets): sharpen a sword. */
    | {
        type: "sharpen";
        target: FabTarget;
        /** Extra sharpen iterations beyond the base one ("sharpen it an
         * additional time"). Total repetition ("sharpen … twice") uses the
         * `repeat` wrapper instead. */
        times?: FabAmount;
      }
    /** The Crowd Boos label keyword action (custom sets). */
    | { type: "crowd-boos"; target: FabPlayer; filter?: FabCardFilter }
    /** The Crowd Cheers keyword action (Super Slam). */
    | { type: "crowd-cheers"; target: FabPlayer; filter?: FabCardFilter }
    /** The Awaken keyword action (Super Slam): "Awaken target figment you
     * control." */
    | { type: "awaken"; target: FabTarget }
    /** "instead you win the clash" (Overturn the Results replacement). */
    | { type: "win-clash" }
    /** "the attacking hero guesses if that card is the chosen color" (Truth
     * or Trickery). This is a yes/no relationship guess, not a second color
     * choice; the named binding identifies the hidden card being compared. */
    | {
        type: "guess";
        predicate: "binding-matches-chosen-color";
        binding: string;
        guesser: FabPlayer;
      }
    /** "Choose a color" — the choice is referenced by later conditions. */
    | { type: "choose-color" }
    /** "each hero chooses war or peace" (DTD Warmonger's Diplomacy) — a free
     * choice among named options; the chosen option is readable as the
     * `chose-<option>` status for "If they choose war, …" branches. */
    | { type: "choose-option"; options: readonly string[]; chooser?: FabPlayer }
    /** "Target opposing hero chooses and creates a Might, Quicken, or Vigor
     * token" (TCC Jinglewood) — the chooser picks one of the listed tokens
     * and creates it under their control. */
    | {
        type: "choose-and-create-token";
        creator?: "effect-controller" | "token-controller";
        options: readonly string[];
        chooser: FabPlayer;
        /** Selection is random, not chosen ("choose Inertia, Frailty, or
         * Bloodrot Pox at random" — OUT Plague Hive). */
        random?: boolean;
        /** Token controller when it differs from the chooser ("create that
         * token under their control" — OUT Plague Hive). */
        controller?: FabPlayer;
      }
    /** "Choose a number" (HVY Talk a Big Game) — binds the chosen number for
     * "that much"/"that many" follow-ups. "Each hero secretly chooses a number
     * between 1 and 6" (HNT Spur Locked) uses min/max + chooser. */
    | {
        type: "choose-number";
        min?: number;
        max?: number;
        chooser?: FabPlayer;
        secret?: true;
      }
    /** "Choose a card on the combat chain" — binds the chosen card for later
     * references ("the chosen card's name"). */
    | {
        type: "choose-card";
        target: FabTarget;
        outputBinding?: string;
        /** Who chooses when it isn't the controller ("An opponent chooses 1
         * of them" — Call for Backup). */
        chooser?: FabPlayer;
        /** The choice is made at random ("chose one at random" [sic] — DTD
         * Spoiled Skull). */
        random?: true;
      }
    /**
     * CR 1.8.5f: modify the targets of a targeted source (typically the
     * attack whose targeting armed this layer). Only original legal targets
     * may be selected; if none remain, the target is unmodified.
     */
    | { type: "choose-new-targets" }
    /**
     * Contract label keyword (CR 8.4.7 / 8.5.39): the contracted player must
     * perform `completeOn` to an opponent object that matches `filter`.
     * `task` is the printed condition phrase for CR-visible identity only;
     * progress never parses it.
     */
    | {
        type: "contract-task";
        task: string;
        completeOn: "banish" | "hit";
        filter: FabCardFilter;
      }
    /** Pre-game placement permission ("You may start the game with a Phoenix
     * Flame in your graveyard."). */
    | {
        type: "start-game";
        setup: "place";
        filter: FabCardFilter;
        to: FabDestination;
        optional?: true;
      }
    /** "You start the game with 1 weapon zone." (Kayo) — zone-count setup. */
    | {
        type: "start-game";
        setup: "zone-counts";
        zoneCounts: readonly { zone: FabZone; count: number }[];
      }
    /**
     * "At the start of the game, all heroes shuffle their starting decks
     * together. All heroes share the same deck and graveyard this game."
     * (Yorick, Weaver of Tales — LSS004). Engine merges seated decks into one
     * host library and redirects deck/graveyard access for every seat.
     */
    | {
        type: "start-game";
        setup: "shared-library";
        sharedLibrary: readonly ("deck" | "graveyard")[];
      }
    /** "Remove all [energy] counters from target …". */
    | {
        type: "remove-all-counters";
        counter?: FabCounter;
        target: FabTarget;
        outputBinding?: string;
      }
    /** "Choose an opponent" — the choice is referenced by later abilities
     * ("their end phase", "an attack they control"). */
    | { type: "choose-opponent" }
    | ({
        type: "create-token";
        /** Printed “under target hero's control” — on-stack hero that binds
         * `controller: "target-controller"`. */
        target?: FabTarget;
        count?: FabAmount;
        to?: FabDestination;
        /**
         * "create a Frostbite token in an [opponent's] exposed head, chest,
         * arms, or legs zone" (Jarl Vetreiði / Summit / Frozen to Death).
         * At resolution the token is placed into the first empty (CR 3.0.1a
         * exposed) zone among this list, owned by the resolved controller.
         * When none of the listed zones is empty the create is a no-op.
         * Mutually exclusive with a fixed equipment `to.zone` for this case.
         */
        /** Create and equip each token into a free weapon seat; skip creation when full. */
        equipTo?: "empty-weapon-zone";
        amongExposed?: readonly (
          | "equipment-head"
          | "equipment-chest"
          | "equipment-arms"
          | "equipment-legs"
        )[];
        /** Counters the token enters with ("create a Hyper Driver token with
         * 2 steam counters"). */
        withCounters?: { counter: FabCounter; count: FabAmount };
        /** "create a X or Y token" — alternative token names the chooser
         * may pick instead of `token`. */
        alternatives?: readonly string[];
        /** Whether to create all alternatives instead of choosing one
         * (used by "create both" upgrades). */
        all?: boolean;
      } & (
        | { controller: "controller"; creator?: "effect-controller" | "token-controller" }
        | {
            controller: FabPlayer;
            /** CR 1.3.1a: distinguish "you create under their control" from "they create". */
            creator: "effect-controller" | "token-controller";
          }
      ) &
        ({ token: string; copySource?: never } | { token?: never; copySource: FabTarget }))
    | {
        type: "create-card";
        name: string;
        pitch?: number;
        to: FabDestination;
        /** Printed “under target hero's control” / “on top of target hero's deck”. */
        target?: FabTarget;
        controller?: FabPlayer;
      }
    /** Replacement-only leaf: the matched event does not occur. */
    | { type: "cancel-event" }
    /** Replacement-only leaf (CR 8.5.33): the matched event (or a specified
     * part) is considered to never have happened. Whole-event in this revision;
     * `part` is reserved for future part-of-event ignore (8.5.33b). */
    | { type: "ignore"; part?: string }
    /** Replacement modification: the replaced creation makes this many extra
     * copies ("instead create that many plus 1"). */
    | { type: "create-extra"; amount: FabAmount }
    | {
        type: "add-counter";
        counter: FabCounter;
        count: FabAmount;
        target: FabTarget;
      }
    | {
        type: "move-counter";
        counter: FabCounter;
        from: FabTarget;
        to: FabTarget;
        /** Printed "any number" opens a 0..N choice over individual matching
         * counters, including counters spread across multiple objects. */
        count?: FabSelectionCount;
      }
    | {
        type: "distribute-counters";
        counter: FabCounter;
        count: FabAmount;
        among: FabTarget;
      }
    | {
        type: "roll";
        sides: number;
        /** Extra dice rolled with the original (Ready to Roll: plus 1). */
        extraDice?: number;
        /** After extra dice, drop this order statistic (Ready to Roll: lowest). */
        ignore?: "lowest";
      }
    | { type: "clash"; with: FabTarget; prize?: FabEffect }
    /**
     * Replacement-only clash continuation. The exact original revealed card
     * and exact destroy-cost object are declared and persisted by the outcome
     * kernel before a fresh clash is generated.
     */
    | {
        type: "reclash";
        from: "replaced-clash";
        cost: { type: "destroy"; target: FabTarget };
      }
    /**
     * Replacement-only clash rewrite: you reveal their deck top and they
     * reveal yours. Optional prize fires for the replacement controller if
     * they win that clash ("If you win the clash, they discard a card").
     */
    | {
        type: "swap-clash-reveals";
        prize?: FabEffect;
      }
    | {
        type: "name-card";
        /** A rules restriction from the printed effect, not a UI filter. */
        restriction?: FabNameCardRestriction;
        /** Actor-private shortcuts; the full legal catalog remains searchable. */
        suggestions?: readonly FabNameCardSuggestionSource[];
      }
    | { type: "intimidate"; target: FabPlayer }
    | { type: "charge"; target: FabTarget }
    | { type: "pitch-card"; target: FabTarget }
    | { type: "equip"; target: FabTarget; zone?: FabZone }
    /** CR 8.5.51 Retrieve: pay a cost to equip a card; fails if the card
     * cannot be equipped (8.5.51a). Composes pay + equip. */
    | { type: "retrieve"; target: FabTarget; cost: FabCost; zone?: FabZone }
    | { type: "transform"; target: FabTarget; into: string }
    /** CR 8.5.48 Transcend: put the source into its owner's hand with its
     * back-face active; the controller is considered to have transcended. */
    | { type: "transcend"; target: FabTarget }
    /** CR 8.2.13 / 8.2.14: the resolving flip-card is the permanent created
     * by the transform; declared subjects become its hosted sub-cards. */
    | {
        type: "transform-into-resolving-card";
        /** First independently-declared source group. */
        target: FabTarget;
        /** Additional independently-declared groups committed in the same
         * atomic transform event (Construct equipment slots + Hyper Drivers). */
        additionalTargets?: readonly FabTarget[];
        /** Printed Construct fallback: if any exact declared source is stale,
         * negate the resolving card instead of partially transforming. */
        onIncomplete?: "negate-resolving-card";
      }
    | {
        type: "copy";
        target: FabTarget;
        source: FabTarget;
        duration: FabDuration;
        abilitiesOnly?: boolean;
        except?: "base-life";
        /** CR 8.5.25 Become is a copy-properties continuous effect that also
         * emits the subscriber-facing become event after it is generated. */
        observation?: "become";
      }
    /** CR 8.5.52: cease become/copy effects applying to the controller's hero. */
    | { type: "return-to-brood" }
    | { type: "exchange"; first: FabTarget; second: FabTarget }
    | {
        type: "gain-control" | "give" | "steal";
        target: FabTarget;
        controller: FabPlayer;
        duration?: FabDuration;
      }
    | { type: "mark"; target: FabTarget }
    | { type: "set-status"; status: string; target: FabTarget }
    | { type: "freeze"; target: FabTarget; duration?: FabDuration }
    | { type: "unfreeze"; target: FabTarget; duration?: FabDuration }
    | { type: "tap" | "untap"; target: FabTarget }
    | { type: "add-defending"; target: FabTarget }
    | {
        type: "attack-with";
        target: FabTarget;
        attackTarget?: FabTarget;
        /** How many additional times the attack may be activated this turn
         * (CR 5.2.3). */
        times?: FabAmount;
      }
    | {
        /** CR 5.2.3 persisted permission changing how often one exact attack
         * ability may be activated during the current turn. */
        type: "modify-activation-limit";
        target: FabTarget;
        operation: "set-total" | "additional";
        count: FabAmount;
        duration: "this-turn";
        outputBinding?: string;
      }
    | {
        type: "play-card";
        source: FabTarget;
        /**
         * Origins this permission authorizes. Omit for a timing/cost modifier
         * ("as though it were an instant") that does not grant a new origin —
         * CR 5.1.1a still requires a separate origin-authorizing permission
         * or the base hand/arsenal rule.
         */
        fromZones?: readonly [FabPlayOrigin, ...FabPlayOrigin[]];
        costModification?: "free" | { reduce: FabAmount } | { increase: number };
        /** How long the permission lasts when granted ahead of play. */
        duration?: FabDuration;
        /** Play with a different card type ("as though it were an instant"). */
        asType?: string;
      }
    | { type: "pay"; cost: FabCost; payer: FabPlayer }
    | {
        type: "wager";
        /** Effect for the wager's winner ("The winner discards a card.").
         * Absent when no winner effect is printed ("wager a Gold token"). */
        prize?: FabEffect;
        /** What is anted instead of cards from the deck ("a Gold token"). */
        stake?: string;
        /** Wager opponent when not the defending hero ("wager with them"). */
        with?: FabTarget;
        /** The attack that wagers when not the resolving card itself
         * ("Target weapon attack you control wagers a Gold token with the
         * defending hero" — OLA Prized Galea). */
        attacker?: FabTarget;
      }
    /** "You win the wager" (replacement for a lost wager, Cheating Scoundrel). */
    | { type: "win-wager" }
    /** "Become that hero until the start of your next turn, except your base
     * {h} doesn't change" (Embody Greatness). */
    | {
        type: "become";
        source: "named-hero" | "ally";
        duration: FabDuration;
        except?: "base-life";
        /** Ally-form details ("this becomes an Illusionist ally with
         * phantasm, base {p} and {h} equal to the number of haunt counters
         * on it" — UPR Ghostly Touch). */
        filter?: FabCardFilter;
        keywords?: readonly string[];
        basePower?: FabAmount;
        baseLife?: FabAmount;
      }
    | { type: "contract-watch"; condition: FabCondition; effect: FabEffect }
    // -- continuous modifiers (6.2, 6.3) ------------------------------------
    | {
        type: "modify-numeric";
        /** Object numeric properties, plus "count" for event-amount
         * modifications ("it creates that many minus 1 of each of those
         * tokens" — modifies the replaced event's count). */
        property: "power" | "defense" | "life" | "intellect" | "pitch" | "cost" | "count";
        op: "add" | "subtract" | "set" | "set-base" | "multiply" | "divide";
        amount: FabAmount;
        /** Rounding for divide ("halved, rounded up" — Walk in My Shoes). */
        rounding?: "up" | "down";
        /**
         * Dummy `this-attack` is stripped at registration when `appliesTo.next`
         * is present. Authored modules may omit it via factories.
         */
        target?: FabTarget;
        duration: FabDuration;
      }
    | {
        /**
         * Modify the resource cost of activating an ability on the targeted
         * object. This is deliberately distinct from the object's numeric
         * Cost property, which is the cost to play the card.
         */
        type: "modify-activation-cost";
        op: "add" | "subtract";
        amount: FabAmount;
        target: FabTarget;
        duration: FabDuration;
      }
    | {
        type: "grant-property";
        property: FabGrantableProperty;
        /** Omitted when `appliesTo.next` latches a future object. */
        target?: FabTarget;
        duration: FabDuration;
      }
    | {
        type: "remove-property";
        property: FabGrantableProperty;
        target: FabTarget;
        duration: FabDuration;
      }
    | { type: "can-be-attacked"; target: FabTarget; duration: FabDuration }
    // -- replacement effects (6.4) ------------------------------------------
    | {
        type: "replacement";
        replacementKind: "self" | "identity" | "standard" | "outcome";
        replaces: FabEventPattern;
        modification: FabEffect;
        duration?: FabDuration;
        /** Rate limit ("The first time an opponent would gain {h} each turn"). */
        limit?: { count: FabAmount; per: "turn" };
      }
    | {
        type: "prevention";
        preventionKind: "fixed" | "shielding";
        /** Source-wide prevention, regardless of which hero or ally receives damage. */
        recipientScope?: "any";
        amount?: FabAmount;
        damageType?: FabDamageType;
        shielded?: FabTarget;
        source?: FabTarget;
        /** Filter on the damage source ("damage by a blue source" — MST
         * Essence of Ancestry). */
        sourceFilter?: FabCardFilter;
        /** Predicate on the incoming damage event's amount ("…would be dealt
         * exactly 1 damage, prevent it" — EVR Dissolution Sphere). When
         * omitted, the prevention applies to every matching damage event. */
        incomingDamage?: FabComparison;
        additionalModification?: FabEffect;
        optionalCost?: FabCost;
        /** Multi-count prevention ("The next 3 times you would be dealt
         * damage this turn, prevent 1 of that damage"). */
        times?: FabAmount;
        /** Damage redirection onto another object before prevention applies
         * ("instead that damage is dealt to Yoji and prevent 1 of that
         * damage" — DYN Yoji, Royal Protector). */
        redirectTo?: FabTarget;
        duration: FabDuration;
      }
    // -- rule modifications (1.0.2, 6.3.1) -----------------------------------
    | {
        type: "rule-modification";
        mode: "restrict" | "require" | "allow" | "amplify";
        action:
          | "play"
          | "pitch"
          | "defend"
          | "activate"
          | "draw"
          | "gain-keyword"
          | "trigger"
          | "be-attacked"
          | "be-destroyed"
          /** "Your arrow attacks may target any opposing hero or ally" —
           * widens what the filtered attacks may target. */
          | "attack-target"
          /** Change whose zone an activated play-card effect may target. */
          | "play-card-target"
          | "gain-action-points"
          /** "{p} damage can't be prevented". */
          | "be-prevented"
          /** "… can't gain names". */
          | "gain-name"
          /** "… can't gain abilities". */
          | "gain-abilities"
          /** "this doesn't untap during the end phase" (Havoc Wrap). */
          | "untap"
          /** "it also counts as you having more {h} than them" — tie-break
           * rule modification (Line Crossers). */
          | "life-comparison"
          /** "attacks they control can't gain {p} this turn". */
          | "gain-power"
          /** "Cards defending this can't gain {d}" (Smash with Big Rock). */
          | "gain-defense"
          /** "Heroes can't gain {h}" (Parched Terrain). */
          | "gain-life"
          /** "you don't lose {h} from blood debt" (Levia) — checked by
           * blood-debt end-phase before emitting lose-life. */
          | "lose-life"
          /** "Heroes can't reveal cards … from effects" (UPR Channel the
           * Bleak Expanse). */
          | "reveal"
          /** "Heroes can't … search decks … from effects" (UPR Channel the
           * Bleak Expanse). */
          | "search"
          /** "they lose all hero card abilities during their next action
           * phase" — objects lose abilities they already have. */
          | "lose-abilities"
          /** "You can't equip weapons" (Bolfar). */
          | "equip"
          /** "They can't create aura tokens during their next turn"
           * (Renounce Grandeur). */
          | "create"
          /** "Effects can't increase arcane damage … would deal" (SEA) —
           * damage-amount modification locked out. */
          | "modify-damage"
          /** "opponents can't attack with weapons" (HNT Kabuto of Imperial
           * Authority). */
          | "attack"
          /** "This counts as having N Evos equipped" (EVO Teklovossen) —
           * `limit.count` is the N the subject counts as having equipped. */
          | "count-as-equipped"
          /** "its {r} cost to play, {p}, and {d} can't be modified" (DTD
           * Numbskull) — numeric-modification lockout. */
          | "be-modified"
          /** "You may have any number of Chivalry in your deck" (TCC
           * Brevant) — deckbuilding-composition allowance. */
          | "have-in-deck"
          /** "attacks you control don't trigger on-hit effects" (Stamp
           * Authority). */
          | "trigger-on-hit"
          /** "you have an additional arsenal zone" (ELE New Horizon) —
           * raises arsenal capacity by 1 while the continuous rule holds. */
          | "additional-arsenal-zone";
        filter?: FabCardFilter;
        /** Player scope for targets of an activated play-card effect. */
        targetPlayer?: FabPlayer;
        /** Equip allowance: qualifying 2H swords occupy one weapon zone. */
        handedness?: "2h-sword-as-1h";
        /** The object the rule applies to.
         * A filter describes an open class ("Your attack action cards with 2
         * or less {p} can't be defended by cards from hand"); a target binds
         * an exact object. Printed self-references, including the card's own
         * name ("Damage dealt by Rok ..."), must use `selector: "self"` so a
         * second copy with the same name is not accidentally included. */
        subject?: FabCardFilter | FabTarget;
        /** Defender count cap ("can't be defended by more than 2 non-block
         * cards" — Confidence); `filter` narrows which defenders count. */
        maxDefenders?: { count: FabAmount; filter?: FabCardFilter };
        /** Amplify mode only: the constant added on top of an incoming
         * power gain ("would gain X, instead gains X plus 1" → amount 1). */
        amount?: number;
        /** Attack-target widening/narrowing ("may attack an additional
         * hero", "may attack any opposing hero", "this attacks each hero"). */
        target?: "additional-hero" | "any-opposing-hero" | "each-hero";
        /** Source restriction ("can't be destroyed by opponents' effects";
         * Snag "can't gain {p} from their own effects, or the effects of
         * attack reaction cards"). */
        source?: "opponents-effects" | "self-or-attack-reaction-effects";
        /** Per-turn cap on the restricted action ("they can't play or
         * activate more than 1 action during their next turn" — AAZ Red in
         * the Ledger): beyond the cap the action is restricted. */
        limit?: { count: FabAmount };
        keyword?: string;
        /** Damage type narrowed by the rule ("effects can't increase arcane
         * damage"). */
        damageType?: FabDamageType;
        duration: FabDuration;
      }
  );

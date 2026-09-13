/**
 * Decomposed play-option types for the FAB test harness.
 *
 * The historical `FabPlayOptions` was a ~30-field grab-bag mixing generic play
 * options with mechanic-specific knobs. This module owns the clean break:
 * one generic base shape plus one narrow type per mechanic/decision, composed
 * into the closed {@link FabPlayOptions} union.
 *
 * Exclusivity is enforced at the type level: every narrow shape forbids the
 * knobs owned by the other shapes (`?: never`), so object literals mixing two
 * mechanics (e.g. `{ scrap: true, fuse: true }`) match no member and fail
 * `tsc`. The same forbidden fields reject stray mechanic properties carried in
 * variables — there is no `any`, no bag, and no stringly fallback.
 *
 * Harness-layer only: the production `begin-play` payload (see `moves.ts`) is
 * assembled from these shapes unchanged — no move-surface semantics move here.
 */

import type { FabCardRef } from "./test-fixtures.ts";
import type { FabFluentCardRef } from "./card-ref.ts";
import type { FabPlayerHandle } from "./test-engine.ts";
import type { FabSplitPlayMethod } from "../cards.ts";

/**
 * Generic options used by every card play: who is attacked, explicit instance
 * targets, resource pitch, and the source zone. All mechanic-specific option
 * shapes extend this base.
 */
interface FabBasePlayFields {
  /**
   * Attack target (player id, opponent hero handle, or ally instance id).
   * When omitted, the engine selects the sole legal opposing hero.
   */
  readonly target?: string | FabPlayerHandle;
  /**
   * Optional additional opposing hero (player id or handle) when an
   * additional-hero attack-target grant is active. Product scope is 1v1
   * (no second opposing seat); keep the knob for card-text completeness only.
   */
  readonly additionalTarget?: string | FabPlayerHandle;
  /** Cards to pitch as part of paying the resource cost. */
  readonly pitch?: FabCardRef | readonly FabCardRef[];
  /** Play from arsenal, banished, deck, or graveyard when a printed permission allows it. */
  readonly from?: "hand" | "arsenal" | "banished" | "deck" | "graveyard";
  /** CR 5.1.3d method declaration when both ordinary play and a printed
   * continuous-effect permission are available. */
  readonly playPermission?: "base" | "effect";
  /**
   * CR 5.1.3a: the declared value of X for a card with a variable (X)
   * resource cost. Read at announce so cost-gated effects (e.g. Goliath
   * Gauntlet's "cost 2 or greater") evaluate against the declared value.
   */
  readonly x?: number;
}

/** Card-target selection is exclusive: typed intent or the low-level id escape hatch. */
export type FabBasePlayOptions = FabBasePlayFields &
  (
    | {
        /** Public card intent; attack sources resolve to their live attack-proxy when required. */
        readonly targetCard?: FabFluentCardRef;
        readonly targetInstanceId?: never;
      }
    | {
        readonly targetCard?: never;
        /** Low-level escape hatch for targets that have no public card reference. */
        readonly targetInstanceId?: string;
      }
  );

/**
 * Every mechanic-specific play knob, documented once. Narrow option shapes
 * {@link Pick} their own knobs from this map and forbid the rest
 * ({@link FabForbidden}), so the union stays exclusive.
 */
export interface FabMechanicPlayKnobs {
  /**
   * Attack-reaction mode (e.g. Pummel `"hit-hero"` for +power and
   * "when this hits a hero, discard").
   */
  readonly mode?: string;
  /** CR 1.7.5 modal mode ability ids (preferred). */
  readonly modeIds?: readonly string[];
  /** CR 1.7.5 modal mode 0-based indexes into the ability's `modes` list. */
  readonly modeIndexes?: readonly number[];
  /** Explicit power boost for attack reactions when not inferred from color. */
  readonly powerBoost?: number;
  /** HNT residual: discard an Assassin card for AR cost. */
  readonly discardAssassin?: boolean;
  /** ARC Boost: pay additional cost to banish top of deck for go again chance. */
  readonly boost?: boolean;
  /** ARC Reload: card instance id to put into empty arsenal on resolve. */
  readonly arsenalInstanceId?: string;
  /** ARC Opt: number of looked cards to put on bottom of deck. */
  readonly optBottom?: number;
  /** PEN Sharpen: weapon instance to put a +1 power counter on. */
  readonly sharpenTargetId?: string;
  /** CR 8.3.32 scrap: pay optional additional cost (banish item/eq from GY). */
  readonly scrap?: boolean;
  /** Graveyard item/equipment chosen to banish for the scrap additional cost. */
  readonly scrapCard?: FabCardRef;
  /** CR 8.3.33 beat chest: pay optional discard of 6+ power card. */
  readonly beatChest?: boolean;
  /** Instance id of the specific hand card to discard for beat chest. */
  readonly beatChestInstanceId?: string;
  /** ROS/PEN residual: Decompose optional GY banish cost. */
  readonly decompose?: boolean;
  /** Residual: Action/Instant — Destroy this activation on a permanent. */
  readonly activateDestroyThis?: boolean;
  /** SEA residual: pay by destroying a Cog you control. */
  readonly payWithCog?: boolean;
  /** CR 8.3.17 fusion: pay optional reveal cost. */
  readonly fuse?: boolean;
  /** Hand cards revealed to pay the fuse cost. */
  readonly fuseCards?: FabCardRef | readonly FabCardRef[];
  /** CR 5.1.2c / 8.3.38: exact split-card play method. */
  readonly playMethod?: FabSplitPlayMethod;
  /**
   * CR 5.1.3c: 0-based index into the played card's alternative play-cost
   * abilities. Declaring it replaces the printed base resource cost with the
   * selected alternative (CR 5.1.6c). Mirrors the production `begin-play`
   * payload field of the same name (see `moves.ts`).
   */
  readonly alternativeCostIndex?: number;
  /** CR 8.3.29 crank: whether to crank on enter (default true). */
  readonly crank?: boolean;
  /** MON Charge: put a hand card into soul as additional cost. */
  readonly charge?: boolean;
  /** Hand card placed into soul to pay the charge cost. */
  readonly chargeCard?: FabCardRef;
  /** Optional effect additional-cost: banish this graveyard card (Nimble Strike / Hurl family). */
  readonly banishCostCard?: FabCardRef;
  /** Required "banish any number from hand" play cost, including an explicit empty choice. */
  readonly anyNumberBanishCostCards?: readonly FabCardRef[];
  /** “Your next attack this turn gets +N” amount when text is absent on trainer. */
  readonly nextAttackPower?: number;
  /** OMN: destroy Lightning Flow instead of paying resource cost. */
  readonly payWithLightningFlow?: boolean;
  /** CRU/HVY residual: destroy a Gold you control rather than pay. */
  readonly payWithGold?: boolean;
  /** Modular: move equipped card to another equipment zone. */
  readonly equipToZone?: "head" | "chest" | "arms" | "legs";
  /** DYN residual: name a card that cannot be played. */
  readonly namedCard?: string;
  /** Printed cost X: the resource amount chosen for X. */
  readonly xValue?: number;
}

/** Marks every knob of `T` outside `K` as forbidden (`?: never`). */
type FabForbidden<T, K extends keyof T> = {
  readonly [P in Exclude<keyof T, K>]?: never;
};

/** Compose one exclusive option shape: base + own knobs + all others forbidden. */
type FabMechanicShape<K extends keyof FabMechanicPlayKnobs> = FabBasePlayOptions &
  Pick<FabMechanicPlayKnobs, K> &
  FabForbidden<FabMechanicPlayKnobs, K>;

/** CR 1.7.5 modal choice fields shared by the mode-bearing option shapes. */
export interface FabModeSelection {
  readonly mode?: string;
  readonly modeIds?: readonly string[];
  readonly modeIndexes?: readonly number[];
}

/** Modal plays: select mode(s) by name, id, or index. */
export type FabModalPlayOptions = FabMechanicShape<"mode" | "modeIds" | "modeIndexes">;

/** Modal plays that also pay the HNT Assassin discard AR cost (+ power boost). */
export type FabModalAssassinPlayOptions = FabMechanicShape<
  "mode" | "modeIds" | "modeIndexes" | "powerBoost" | "discardAssassin"
>;

/** ARC-flavored plays: Boost, Reload, Opt placement, arcane barrier, Sharpen. */
export type FabArcPlayOptions = FabMechanicShape<
  "boost" | "arsenalInstanceId" | "optBottom" | "sharpenTargetId"
>;

/** CR 8.3.32 scrap: pay the optional additional cost (banish item/eq from GY). */
export type FabScrapPlayOptions = FabMechanicShape<"scrap" | "scrapCard">;

/** CR 8.3.33 beat chest: pay the optional discard of a 6+ power card. */
export type FabBeatChestPlayOptions = FabMechanicShape<"beatChest" | "beatChestInstanceId">;

/** ROS/PEN residual: Decompose optional GY banish cost. */
export type FabDecomposePlayOptions = FabMechanicShape<"decompose">;

/** Residual destroy-this: activate a permanent's "Destroy this" ability. */
export type FabDestroyThisPlayOptions = FabMechanicShape<"activateDestroyThis">;

/** SEA residual: pay by destroying a Cog you control. */
export type FabPayWithCogPlayOptions = FabMechanicShape<"payWithCog">;

/** CR 8.3.17 fusion: pay the optional reveal cost. */
export type FabFusePlayOptions = FabMechanicShape<"fuse" | "fuseCards">;

/** Printed X-cost cards that may also pay Fusion (for example Ice Eternal). */
export type FabXCostFusePlayOptions = FabMechanicShape<"xValue" | "fuse" | "fuseCards">;

/** CR 5.1.2c / 8.3.38: select one face or meld both faces. */
export type FabSplitCardPlayOptions = FabMechanicShape<"playMethod">;

/** CR 5.1.3c: declare one of the card's alternative play-costs by index. */
export type FabAlternativeCostPlayOptions = FabMechanicShape<"alternativeCostIndex">;

/** CR 8.3.29 crank: whether to crank on enter (default true). */
export type FabCrankPlayOptions = FabMechanicShape<"crank">;

/** MON Charge: put a hand card into soul as an additional cost. */
export type FabChargePlayOptions = FabMechanicShape<"charge" | "chargeCard">;

/** Required "banish any number from hand" additional play cost (for example No Fear). */
export type FabAnyNumberBanishCostPlayOptions = FabMechanicShape<"anyNumberBanishCostCards">;

/** Trainer plays where the "+N next attack" amount is not printed on the card. */
export type FabNextAttackPowerPlayOptions = FabMechanicShape<"nextAttackPower">;

/** OMN: destroy Lightning Flow instead of paying the resource cost (+ Gold). */
export type FabLightningFlowPlayOptions = FabMechanicShape<"payWithLightningFlow" | "payWithGold">;

/** CRU/HVY residual: destroy a Gold you control rather than pay. */
export type FabPayWithGoldPlayOptions = FabMechanicShape<"payWithGold">;

/** Modular: move an equipped card to another equipment zone (activate path). */
export type FabEquipToZonePlayOptions = FabMechanicShape<"equipToZone">;

/** DYN residual: name a card that cannot be played. */
export type FabNamedCardPlayOptions = FabMechanicShape<"namedCard">;

/** Printed cost X: choose the resource amount paid for X. */
export type FabXCostPlayOptions = FabMechanicShape<"xValue">;

/**
 * Every legal play-option shape: the generic base plus one narrow type per
 * mechanic/decision. Cross-mechanic literals match no member — each shape
 * forbids the other shapes' knobs (`?: never`) — so mixed bags are
 * unrepresentable without an assertion.
 */
export type FabPlayOptions =
  | FabBasePlayOptions
  | FabModalPlayOptions
  | FabModalAssassinPlayOptions
  | FabArcPlayOptions
  | FabScrapPlayOptions
  | FabBeatChestPlayOptions
  | FabDecomposePlayOptions
  | FabDestroyThisPlayOptions
  | FabPayWithCogPlayOptions
  | FabFusePlayOptions
  | FabXCostFusePlayOptions
  | FabSplitCardPlayOptions
  | FabAlternativeCostPlayOptions
  | FabCrankPlayOptions
  | FabChargePlayOptions
  | FabAnyNumberBanishCostPlayOptions
  | FabBanishCostPlayOptions
  | FabNextAttackPowerPlayOptions
  | FabLightningFlowPlayOptions
  | FabPayWithGoldPlayOptions
  | FabEquipToZonePlayOptions
  | FabNamedCardPlayOptions
  | FabXCostPlayOptions;

/** Optional effect additional-cost (Nimble Strike / Hurl): banish a graveyard card. */
export type FabBanishCostPlayOptions = FabMechanicShape<"banishCostCard">;

/**
 * Option shapes legal for attack-card plays (used by the attack→defend verbs:
 * `attackWith`, `helpers.attackToDefend`, `playAttackToDefend`). Reactions-only
 * Reaction-only shapes (power boost, discard-assassin) and non-attack
 * activates are excluded by construction. Modal attack action cards remain
 * first-class attack plays and therefore accept mode ids/indexes here.
 */
export type FabAttackFlowPlayOptions =
  | FabBasePlayOptions
  | FabModalPlayOptions
  | FabArcPlayOptions
  | FabScrapPlayOptions
  | FabBeatChestPlayOptions
  | FabDecomposePlayOptions
  | FabPayWithCogPlayOptions
  | FabFusePlayOptions
  | FabXCostPlayOptions
  | FabXCostFusePlayOptions
  | FabSplitCardPlayOptions
  | FabAlternativeCostPlayOptions
  | FabCrankPlayOptions
  | FabChargePlayOptions;

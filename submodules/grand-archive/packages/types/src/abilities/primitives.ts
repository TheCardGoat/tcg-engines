import type { GrandArchiveRulesType } from "../card.ts";
import type { GrandArchiveClass, GrandArchiveElement } from "../index.ts";

/** Authored identifiers are stable within one printed card face. */
export type GrandArchiveAbilityId = `${string}-a${number}`;
export type GrandArchiveBinding = string;

export type GrandArchiveZone =
  | "main-deck"
  | "material-deck"
  | "hand"
  | "memory"
  | "graveyard"
  | "banishment"
  | "field"
  | "effects-stack"
  | "intent"
  | "pantheon"
  | "inner-lineage"
  | "loaded";

export type GrandArchivePhase =
  | "recollection"
  | "draw"
  | "materialize"
  | "main"
  | "combat"
  | "end"
  | "wake-up";

export type GrandArchiveRelativePlayer =
  | "controller"
  | "opponent"
  | "any-opponent-in-turn-order"
  | "another-player"
  | "turn-player"
  | "non-turn-player"
  | "attacking-player"
  | "defending-player"
  | "event-actor"
  | "event-subject-controller"
  | "event-recipient-controller"
  | { readonly binding: GrandArchiveBinding }
  | { readonly ownerOf: GrandArchiveBinding }
  | { readonly controllerOf: GrandArchiveBinding };

export type GrandArchivePlayerSet =
  | GrandArchiveRelativePlayer
  | "each-player"
  | "each-opponent"
  | { readonly eachExcept: GrandArchiveRelativePlayer };

export type GrandArchiveDuration =
  | { readonly kind: "this-turn" }
  | { readonly kind: "this-attack" }
  | { readonly kind: "until-end-of-turn"; readonly whose: GrandArchiveRelativePlayer }
  | { readonly kind: "until-end-of-next-turn"; readonly whose: GrandArchiveRelativePlayer }
  | { readonly kind: "until-start-of-turn"; readonly whose: GrandArchiveRelativePlayer }
  | { readonly kind: "until-end-of-phase"; readonly phase: GrandArchivePhase }
  | {
      readonly kind: "until-end-of-next-phase";
      readonly phase: GrandArchivePhase;
      readonly whose?: GrandArchiveRelativePlayer;
    }
  | { readonly kind: "during-next-turn"; readonly whose: GrandArchiveRelativePlayer }
  | {
      readonly kind: "for-next-event";
      readonly event: GrandArchiveObservableEventName;
      readonly starts?: { readonly kind: "next-turn"; readonly whose: GrandArchiveRelativePlayer };
      readonly expires?: GrandArchiveDuration;
    }
  | { readonly kind: "while-source-on-field" }
  | { readonly kind: "while-source-in-functional-zone" }
  | {
      readonly kind: "while-subjects-in-zone";
      readonly subjects: import("./selection.ts").GrandArchiveSubject;
      readonly zone: GrandArchiveZone;
      readonly scope: "per-object" | "all";
    }
  | { readonly kind: "while-condition" }
  | { readonly kind: "permanent" };

export type GrandArchiveNumericProperty =
  | "level"
  | "power"
  | "life"
  | "durability"
  | "reserve-cost"
  | "memory-cost";

export type GrandArchiveCounterKind =
  | "buff"
  | "bulwark"
  | "damage"
  | "debuff"
  | "durability"
  | "enlighten"
  | "level"
  | "omen"
  | "preparation"
  | "static"
  | "wither"
  | { readonly named: string };

export type GrandArchiveObjectState =
  | "awake"
  | "rested"
  | "attacking"
  | "defending"
  | "retaliating"
  | "damaged"
  | "intercepting"
  | "distant"
  | "fostered"
  | "loaded"
  | "brewed"
  | "imbued"
  | "prepared"
  | "preserved"
  | "ephemeral"
  | "wielded";

export type GrandArchiveActivationState =
  | "prepared"
  | "imbued"
  | "brewed"
  | "empowered"
  | "ephemeral"
  | "copy"
  | "negated"
  | "starcalled"
  | "entered-from-banishment";

export type GrandArchivePlayerState =
  | "agility"
  | { readonly kind: "event-state" }
  | { readonly named: string; readonly value?: string };

/** CR continuous-effect layers. E numeric sublayers preserve modifier order. */
export type GrandArchiveContinuousLayer =
  | { readonly layer: "control"; readonly modifies: "control" }
  | { readonly layer: "A"; readonly modifies: "base-stats" | "cost" | "play-permission" }
  | { readonly layer: "B"; readonly modifies: "type" }
  | { readonly layer: "C"; readonly modifies: "element" }
  | { readonly layer: "D"; readonly modifies: "ability" }
  | {
      readonly layer: "E";
      readonly modifies: "stat" | "cost" | "play-permission";
      readonly sublayer?: "modifier" | "counter" | "swap";
    };

export type GrandArchiveCardCharacteristic =
  | { readonly kind: "type"; readonly value: GrandArchiveRulesType }
  | { readonly kind: "supertype"; readonly value: import("../card.ts").GrandArchiveSupertype }
  | { readonly kind: "class"; readonly value: GrandArchiveClass }
  | { readonly kind: "element"; readonly value: GrandArchiveElement }
  | { readonly kind: "subtype"; readonly value: string }
  | { readonly kind: "name"; readonly value: string };

/** Events form the contract between the mutation kernel and trigger matcher. */
export const GRAND_ARCHIVE_OBSERVABLE_EVENT_NAMES = [
  "phase-begins",
  "turn-begins",
  "turn-ends",
  "card-activated",
  "card-materialized",
  "ability-activated",
  "ability-triggered",
  "attack-declared",
  "card-played",
  "object-entered-field",
  "object-left-field",
  "object-died",
  "object-would-die",
  "object-destroyed",
  "object-killed",
  "attack-hit",
  "damage-dealt",
  "damage-prevented",
  "card-banished",
  "card-discarded",
  "card-drawn",
  "card-reserved",
  "card-recovered",
  "cards-recollected",
  "card-revealed",
  "champion-leveled-up",
  "card-loaded",
  "card-moved",
  "object-fostered",
  "object-linked",
  "object-state-changed",
  "object-transformed",
  "object-sacrificed",
  "tokens-summoned",
  "counter-added",
  "counter-removed",
  "effect-resolved",
  "stack-item-negated",
  "stack-item-targets-declared",
  "boon-gained",
  "player-recovered",
  "player-state-changed",
  "keyword-action-performed",
] as const;

export type GrandArchiveObservableEventName = (typeof GRAND_ARCHIVE_OBSERVABLE_EVENT_NAMES)[number];

export type GrandArchiveComparisonOperator = "eq" | "neq" | "lt" | "lte" | "gt" | "gte";

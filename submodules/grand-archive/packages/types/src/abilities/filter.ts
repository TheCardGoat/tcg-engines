import type { GrandArchiveRulesType, GrandArchiveSupertype } from "../card.ts";
import type { GrandArchiveClass, GrandArchiveElement } from "../index.ts";
import type { GrandArchiveComparison } from "./amount.ts";
import type { GrandArchiveKeywordName } from "./keyword.ts";
import type {
  GrandArchiveActivationState,
  GrandArchiveCounterKind,
  GrandArchiveObjectState,
  GrandArchiveZone,
} from "./primitives.ts";

export type GrandArchiveCardFilter =
  | { readonly kind: "all"; readonly filters: readonly GrandArchiveCardFilter[] }
  | { readonly kind: "any"; readonly filters: readonly GrandArchiveCardFilter[] }
  | { readonly kind: "not"; readonly filter: GrandArchiveCardFilter }
  | { readonly kind: "name"; readonly value: string; readonly match?: "exact" | "contains" }
  | { readonly kind: "champion-name"; readonly value: string }
  | { readonly kind: "canonical-id"; readonly value: string }
  | {
      readonly kind: "matches-tracked-characteristic";
      readonly key: string;
      readonly characteristic: "card-name" | "class" | "element" | "subtype" | "type";
    }
  | { readonly kind: "not-source" }
  | { readonly kind: "not-subject"; readonly subject: import("./selection.ts").GrandArchiveSubject }
  | { readonly kind: "type"; readonly oneOf: readonly GrandArchiveRulesType[] }
  | { readonly kind: "class"; readonly oneOf: readonly GrandArchiveClass[] }
  | { readonly kind: "element"; readonly oneOf: readonly GrandArchiveElement[] }
  | { readonly kind: "element-category"; readonly value: "basic" | "non-advanced" | "advanced" }
  | { readonly kind: "subtype"; readonly oneOf: readonly string[] }
  | { readonly kind: "supertype"; readonly oneOf: readonly GrandArchiveSupertype[] }
  | { readonly kind: "speed"; readonly oneOf: readonly ("fast" | "slow")[] }
  | { readonly kind: "zone"; readonly oneOf: readonly GrandArchiveZone[] }
  | { readonly kind: "facing"; readonly value: "face-up" | "face-down" }
  | { readonly kind: "numeric"; readonly comparison: GrandArchiveComparison }
  | {
      readonly kind: "parity";
      readonly property: "reserve-cost" | "memory-cost" | "life" | "power" | "level";
      readonly value: "even" | "odd";
    }
  | { readonly kind: "has-counter"; readonly counter: GrandArchiveCounterKind }
  | { readonly kind: "has-keyword"; readonly keyword: GrandArchiveKeywordName }
  | {
      readonly kind: "has-link-keyword";
      readonly target:
        | "ally"
        | "unit"
        | "champion"
        | "non-champion-object"
        | "item-or-weapon"
        | "regalia"
        | "polearm-weapon"
        | "sword-weapon"
        | "warrior-weapon";
    }
  | {
      readonly kind: "attacking-subject";
      readonly defender: import("./selection.ts").GrandArchiveSubject;
    }
  | { readonly kind: "object-state"; readonly state: GrandArchiveObjectState }
  | { readonly kind: "activation-state"; readonly state: GrandArchiveActivationState }
  | { readonly kind: "token"; readonly value: boolean }
  | { readonly kind: "entered-field-this-turn" }
  | { readonly kind: "linked"; readonly value: boolean }
  | {
      readonly kind: "same-characteristic";
      readonly binding: string;
      readonly characteristic: "name" | "type" | "class" | "element" | "subtype" | "reserve-cost";
    };

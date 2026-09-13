import type { GrandArchiveAmount } from "./amount.ts";
import type { GrandArchiveAbilityCost } from "./cost.ts";
import type { GrandArchiveCondition } from "./condition.ts";

export type GrandArchiveKeywordName =
  | "aenean-progression"
  | "aethercalling"
  | "aetherwing"
  | "attack-procedure"
  | "agility"
  | "ambush"
  | "brew"
  | "bulwark"
  | "cascade"
  | "cleave"
  | "command"
  | "commanded-will"
  | "critical"
  | "distant"
  | "divine-relic"
  | "bow"
  | "gun"
  | "efficiency"
  | "elysian-aura"
  | "exalted"
  | "empower"
  | "ephemeral"
  | "ephemerate"
  | "fast-activation"
  | "first-boon"
  | "floating-memory"
  | "foster"
  | "gather"
  | "glimpse"
  | "hindered"
  | "imbue"
  | "immortality"
  | "intercept"
  | "interdiction"
  | "kindle"
  | "lineage"
  | "lineage-release"
  | "link"
  | "link-shield"
  | "multistrike"
  | "omnishroud"
  | "omen"
  | "prepare"
  | "preserve"
  | "pride"
  | "ranged"
  | "renewable"
  | "reservable"
  | "retaliate"
  | "retort"
  | "scavenge"
  | "spellshroud"
  | "starcalling"
  | "siegeable"
  | "steadfast"
  | "stealth"
  | "suppress"
  | "taunt"
  | "true-sight"
  | "unblockable"
  | "unique"
  | "vigor"
  | "weapon-procedure"
  | "wither";

export type GrandArchiveKeyword =
  | {
      readonly name: Exclude<
        GrandArchiveKeywordName,
        | "agility"
        | "critical"
        | "command"
        | "commanded-will"
        | "brew"
        | "empower"
        | "kindle"
        | "imbue"
        | "lineage"
        | "lineage-release"
        | "link"
        | "ephemerate"
        | "multistrike"
        | "prepare"
        | "pride"
        | "ranged"
        | "retort"
        | "scavenge"
        | "starcalling"
      >;
    }
  | {
      readonly name:
        | "agility"
        | "critical"
        | "commanded-will"
        | "empower"
        | "kindle"
        | "multistrike"
        | "prepare"
        | "pride"
        | "ranged"
        | "retort"
        | "scavenge";
      readonly value: GrandArchiveAmount;
    }
  | {
      readonly name: "imbue";
      readonly value: GrandArchiveAmount;
      readonly elementRequirement:
        | "source-elements"
        | "advanced"
        | { readonly element: import("../index.ts").GrandArchiveElement }
        | {
            readonly oneOf: readonly [
              import("../index.ts").GrandArchiveElement,
              import("../index.ts").GrandArchiveElement,
              ...import("../index.ts").GrandArchiveElement[],
            ];
          };
    }
  | { readonly name: "lineage-release"; readonly cost: GrandArchiveAbilityCost }
  | { readonly name: "lineage"; readonly lineageName: string }
  | {
      readonly name: "link";
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
  | { readonly name: "command"; readonly subtype: string }
  | {
      readonly name: "ephemerate" | "starcalling";
      readonly cost: GrandArchiveAbilityCost;
      readonly activationCondition?: GrandArchiveCondition;
      readonly costModifiers?: readonly {
        readonly operation: "add" | "subtract" | "set";
        readonly amount: GrandArchiveAmount;
        readonly condition?: GrandArchiveCondition;
      }[];
      /** State assigned only when this keyword supplied the activation permission. */
      readonly activationResult?: {
        readonly entryState: {
          readonly state: import("./primitives.ts").GrandArchiveObjectState;
          readonly value: boolean;
        };
      };
    }
  | {
      readonly name: "brew";
      readonly requirements: readonly [
        {
          readonly kind: "name" | "subtype";
          readonly value: string;
          readonly count: GrandArchiveAmount;
        },
        ...{
          readonly kind: "name" | "subtype";
          readonly value: string;
          readonly count: GrandArchiveAmount;
        }[],
      ];
      /** Optional relationship required between the names of all sacrificed ingredients. */
      readonly nameConstraint?: "same" | "different";
    };

export interface GrandArchiveAbilityLabel {
  readonly name: string;
  readonly parameters?: Readonly<Record<string, string | number | readonly string[]>>;
}

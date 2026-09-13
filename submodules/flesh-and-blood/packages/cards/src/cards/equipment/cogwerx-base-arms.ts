import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cogwerx-base-arms.generated.ts";

/**
 * EVO016 Cogwerx Base Arms — Mechanologist Base Arms.
 *
 * Printed:
 *   When this is equipped, put a steam counter on it.
 *   Once per Turn Instant - {r}, remove a steam counter from this: Your next
 *   Mechanologist attack this turn gets +1{p}. Activate this ability only if
 *   you've boosted this turn.
 *
 * Model notes (hand-authored; EVO014/015 siblings):
 * - Equip trigger subject:self (bare equip fires on any equip).
 * - OPT Instant mixed 1{r}+remove steam; condition boosted-this-turn.
 * - Floating +1{p}: appliesTo.next types Action+Attack+Mechanologist (type-line
 *   loose filter; prior model only supertypes Mechanologist — would match
 *   non-attack Mech cards if any).
 */
export const cogwerxBaseArms = defineCard(fabCardIdentitiesByCanonicalId["PpnFdNFq8GrzCqrmDTbcW"], {
  abilities: {
    whenIsEquippedPutSteamCounter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    oncePerTurnInstantRemoveSteamCounterFromNext: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
          },
        ],
      },
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  },
});

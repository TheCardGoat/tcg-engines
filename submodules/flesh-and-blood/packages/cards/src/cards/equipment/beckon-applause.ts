import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/beckon-applause.generated.ts";

/**
 * HVY100 Beckon Applause — Warrior Arms d0 Temper.
 *
 * Printed:
 *   If you control an Agility token, this gets +1{d}.
 *   If you control a Vigor token, this gets +1{d}.
 *   Temper
 *
 * Model notes (hand-authored; arms twin of HVY011 raw-meat):
 * - Continuous while-conditions (control Agility / Vigor tokens) re-evaluate
 *   while equipped — duration permanent (not this-turn latch that drops at EOT
 *   while the token still sits in arena). Same family as raw-meat / lignum /
 *   red-alert continuous gates.
 * - control-object defaults to controller; name + metatype Token matches
 *   fabToken("agility"|"vigor") seating.
 * - Temper on base d0: with +1{d} from a token, first defend contributes 1 then
 *   −1{d} counter → 0 and destroy.
 */
export const beckonApplause = defineCard(fabCardIdentitiesByCanonicalId["k7CQWQNw7LjqTcGB8gDTq"], {
  keywords: [temper],
  abilities: {
    ifControlAgilityTokenGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Agility",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        // Continuous while-condition: re-eval while token controlled.
        duration: "permanent",
      },
    },
    ifControlVigorTokenGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Vigor",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});

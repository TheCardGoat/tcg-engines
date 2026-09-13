import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/raw-meat.generated.ts";

/**
 * HVY011 Raw Meat — Brute Chest d0 Temper.
 *
 * Printed:
 *   If you control an Agility token, this gets +1{d}.
 *   If you control a Might token, this gets +1{d}.
 *   Temper
 *
 * Model notes (hand-authored):
 * - Continuous while-conditions (control Agility / Might tokens) re-evaluate
 *   while equipped — duration permanent (not this-turn latch that drops at EOT
 *   while the token still sits in arena). Same family as FLR003 lignum /
 *   HNT192 red-alert continuous gates.
 * - control-object defaults to controller; name + metatype Token matches
 *   fabToken("agility"|"might") seating.
 * - Temper on base d0: with +1{d} from a token, first defend contributes 1 then
 *   −1{d} counter → 0 and destroy.
 */
export const rawMeat = defineCard(fabCardIdentitiesByCanonicalId["mgcdBrjHkNTmKKjwnJKF9"], {
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
    ifControlMightTokenGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Might",
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

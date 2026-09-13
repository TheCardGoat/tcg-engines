import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crater-fist.generated.ts";

/**
 * CRU025 Crater Fist — Guardian Arms d2 Temper.
 *
 * Printed: Action - {r}{r}{r}, destroy Crater Fist: Your attacks with crush
 * gain +2{p} this turn. Go again. Temper
 *
 * Model notes (hand-authored; gallantry-gold / stubby-hammerers family):
 * - Prior model targeted combat-chain Attack+hasKeyword crush at resolution
 *   with count:star — does not float to later attacks this turn.
 * - Remodel: appliesTo.next Action/Attack + hasKeyword crush + count star.
 *   Crush is an ability label (matches-filter hasKeyword via label.name).
 */
export const craterFist = defineCard(fabCardIdentitiesByCanonicalId["DbpdPtLqk9zqfp6bdQTP6"], {
  keywords: [temper],
  abilities: {
    actionDestroyCraterFistAttacksCrushGain2Turn: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          ...nextAttackActionLatch({ hasKeyword: "crush" }),
          count: { type: "all" },
        },
      },
    },
  },
});

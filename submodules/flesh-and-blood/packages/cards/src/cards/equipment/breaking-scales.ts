import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/breaking-scales.generated.ts";

/**
 * KSU007 Breaking Scales — Ninja Arms d1 Battleworn.
 *
 * Printed:
 *   Attack Reaction - Destroy Breaking Scales: Target attack action card with
 *   combo gains +1{p}.
 *   Battleworn
 *
 * Model notes (hand-authored; case-by-case; AR twin of BEN005 Fisticuffs):
 * - abilityType attack-reaction; destroy-self cost only (no resource).
 * - Target on-stack combat-chain AAC with hasKeyword combo (not any AAC).
 * - +1{p} until-end-of-turn on the chosen attack.
 * - Battleworn −1{d} after defend when effective d > 0.
 */
export const breakingScales = defineCard(fabCardIdentitiesByCanonicalId["6dMC789mNcrmnMPWGMdhb"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyBreakingScalesTargetAttackActionCombo: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: attackActionFilter({ hasKeyword: "combo" }),
          count: 1,
        },
        duration: "this-turn",
      },
    },
  },
});

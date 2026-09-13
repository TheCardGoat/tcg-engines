import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/burn-bare.generated.ts";
export const burnBare = defineCard(fabCardIdentitiesByCanonicalId["FRftJtrB9LzbkMfcJKCmb"], {
  abilities: {
    deal6ArcaneDamageAnyTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 6,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    instantDiscardDestroyTargetPhantasmIsAttacking: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            hasKeyword: "phantasm",
          },
          count: 1,
        },
      },
    },
  },
});

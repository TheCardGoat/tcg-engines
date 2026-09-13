import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/ira-crimson-haze.generated.ts";

export const iraCrimsonHaze = defineCard(fabCardIdentitiesByCanonicalId["GCRQMpBtqBHWrk68GqnGP"], {
  abilities: {
    secondAttackTurnGets1Power: {
      kind: "static",
      staticKind: "continuous",
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
              subtypes: ["Attack"],
            },
          },
          ordinal: 2,
        },
      },
    },
  },
});

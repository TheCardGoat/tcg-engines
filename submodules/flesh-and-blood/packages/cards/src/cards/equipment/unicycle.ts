import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/unicycle.generated.ts";

export const unicycle = defineCard(fabCardIdentitiesByCanonicalId["Hp8cr9fLGCnpNCfrgKFJN"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyCogControl: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "untap",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Cog"],
            },
          },
          count: 1,
        },
      },
    },
  },
});

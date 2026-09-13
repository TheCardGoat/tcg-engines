import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/starfield-touch.generated.ts";

export const starfieldTouch = defineCard(fabCardIdentitiesByCanonicalId["kRwtJCMHKNcKNrdk8LFnC"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyAphrodiasControl: {
      kind: "activated",
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
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "untap",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          // permanent covers weapon seats (Aphrodias is 2H Orb weapon).
          zones: ["permanent"],
          filter: {
            // Printed name "Aphrodias" — not a subtype (Weapon/Orb/2H only).
            // Prior subtypes:["Aphrodias"] never matched (dead filter).
            name: "Aphrodias",
          },
          count: 1,
        },
      },
    },
  },
});

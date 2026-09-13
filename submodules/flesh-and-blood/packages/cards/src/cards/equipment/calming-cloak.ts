import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/calming-cloak.generated.ts";

export const calmingCloak = defineCard(fabCardIdentitiesByCanonicalId["T68MkCWcwQhqChRPKNR6C"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroyNextAuraPlayTurnCostsLessPlay: {
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
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          // Aura is FAB_TYPES — subtypes:["Aura"] never matches type-boxes.
          next: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
        },
      },
    },
  },
});

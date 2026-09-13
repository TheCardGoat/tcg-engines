import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/driftwood-quiver.generated.ts";

export const driftwoodQuiver = defineCard(fabCardIdentitiesByCanonicalId["6GbtFTnH86TCFdKLMdrPk"], {
  keywords: [
    {
      name: "specialization",
      hero: "Riptide",
    },
  ],
  abilities: {
    instantDestroyDriftwoodQuiverPutFromArsenalBottomDeck: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["arsenal"],
          count: 1,
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    },
  },
});

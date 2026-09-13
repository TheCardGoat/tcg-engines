import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bunker-beard.generated.ts";

export const bunkerBeard = defineCard(fabCardIdentitiesByCanonicalId["qdzb6znQFtcJHcPNnkFF7"], {
  abilities: {
    defenseReactionDestroyMayAddActionFromArsenalActive: {
      kind: "activated",
      abilityType: "defense-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "optional",
        effect: {
          type: "add-defending",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            filter: {
              typeBox: {
                types: ["Action"],
              },
            },
            count: 1,
          },
        },
      },
    },
  },
});

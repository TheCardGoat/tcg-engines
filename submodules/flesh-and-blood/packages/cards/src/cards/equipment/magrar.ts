import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/magrar.generated.ts";

export const magrar = defineCard(fabCardIdentitiesByCanonicalId["W8qgQqqTzWMFFcCCzTLGg"], {
  keywords: [
    {
      name: "specialization",
      hero: "Genis",
    },
  ],
  abilities: {
    actionDestroyCreateZenStateInertiaToken: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "zen-state",
            controller: "controller",
          },
          {
            type: "create-token",
            token: "inertia",
            controller: "controller",
          },
        ],
      },
    },
  },
});

import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/path-of-repentance.generated.ts";

export const pathOfRepentance = defineCard(
  fabCardIdentitiesByCanonicalId["D8mWttQzTTrJH6twkGRw6"],
  {
    abilities: {
      instantDestroyTurnBloodDebtBanishedZoneFaceDown: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "turn-face-down",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["banished"],
            filter: {
              hasKeyword: "blood-debt",
            },
            count: 1,
          },
        },
      },
    },
  },
);

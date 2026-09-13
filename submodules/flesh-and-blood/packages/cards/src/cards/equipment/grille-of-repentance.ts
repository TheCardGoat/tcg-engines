import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grille-of-repentance.generated.ts";

export const grilleOfRepentance = defineCard(
  fabCardIdentitiesByCanonicalId["pKjKMPTQr6TQMMkrnwDBp"],
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

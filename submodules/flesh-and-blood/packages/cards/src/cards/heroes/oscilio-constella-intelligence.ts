import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/oscilio-constella-intelligence.generated.ts";

export const oscilioConstellaIntelligence = defineCard(
  fabCardIdentitiesByCanonicalId["Bd8JQMtjbmwQ7W6GLt7KL"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Lightning"],
      },
    ],
    abilities: {
      oncePerTurnInstantDiscardInstantDraw: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
        },
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
);

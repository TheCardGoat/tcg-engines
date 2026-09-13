import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/honing-hood.generated.ts";

export const honingHood = defineCard(fabCardIdentitiesByCanonicalId["zc8n8JQRfBTPHGfnBmw8L"], {
  abilities: {
    instantDestroyHoningHoodReturnAllArsenalHandThen: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              count: {
                type: "all",
              },
            },
            to: {
              zone: "hand",
            },
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-down",
            },
          },
        ],
      },
    },
  },
});

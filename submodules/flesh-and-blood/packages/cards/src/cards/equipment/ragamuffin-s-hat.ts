import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ragamuffin-s-hat.generated.ts";

export const ragamuffinSHat = defineCard(fabCardIdentitiesByCanonicalId["bfbfWCWnHw6zP7bfrPGdC"], {
  abilities: {
    instantDestroyRagamuffinSHatDrawThenPutFrom: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "controller",
        comparison: {
          op: "eq",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
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
              zone: "deck",
              position: "top-or-bottom",
            },
          },
        ],
      },
    },
  },
});

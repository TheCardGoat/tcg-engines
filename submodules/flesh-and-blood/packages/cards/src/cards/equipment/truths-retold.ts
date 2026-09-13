import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/truths-retold.generated.ts";
import { cloaked, ward } from "../shared/keywords.ts";

export const truthsRetold = defineCard(fabCardIdentitiesByCanonicalId.WnPNGc8HLQHhbFKFrLkPM, {
  keywords: [cloaked, ward(1)],
  abilities: {
    returnAura: {
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
            type: "turn-face-up",
            target: {
              selector: "self",
            },
          },
        ],
      },
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          // Aura is a FAB type-line type (not subtype). subtypes:["Aura"] never matched.
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
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

import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blitz-kicks.generated.ts";

export const blitzKicks = defineCard(fabCardIdentitiesByCanonicalId["QFLGnzGbKKr9tHdGQChRP"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroyCreateEmbodimentLightningTokenActivateOnlyIf: {
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
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: {
            types: ["Instant"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "create-token",
        token: "embodiment-of-lightning",
        controller: "controller",
      },
    },
  },
});

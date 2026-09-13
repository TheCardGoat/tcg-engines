import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/skullhorn.generated.ts";

export const skullhorn = defineCard(fabCardIdentitiesByCanonicalId["dQB8pPfdFTDkKJwz9LQbD"], {
  keywords: [arcaneBarrier(2)],
  abilities: {
    actionDestroySkullhornDrawThenDiscardRandomGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              random: true,
            },
            outputBinding: "it",
          },
        ],
      },
    },
  },
});

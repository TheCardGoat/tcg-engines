import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/monstrous-veil.generated.ts";

export const monstrousVeil = defineCard(fabCardIdentitiesByCanonicalId["t68gtGcPf8H9wTGBCfj8L"], {
  keywords: [
    {
      name: "specialization",
      hero: "Rhinar",
    },
    battleworn,
  ],
  abilities: {
    actionDestroyDrawThenDiscardRandomGoAgain: {
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

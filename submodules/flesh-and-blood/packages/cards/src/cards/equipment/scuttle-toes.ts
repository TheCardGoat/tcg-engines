import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/scuttle-toes.generated.ts";

export const scuttleToes = defineCard(fabCardIdentitiesByCanonicalId["gMWRNPMTzMTfCqzFGkbTG"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroyTargetAllyControlDestroyAtBeginningEnd: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "untap",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "destroy",
            target: {
              selector: "binding",
              binding: "it",
            },
            delay: "end-phase",
          },
        ],
      },
    },
  },
});

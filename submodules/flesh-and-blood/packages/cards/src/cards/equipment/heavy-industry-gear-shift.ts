import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heavy-industry-gear-shift.generated.ts";

export const heavyIndustryGearShift = defineCard(
  fabCardIdentitiesByCanonicalId["PtcNWqrmfGgdQmLzBQWtp"],
  {
    keywords: [battleworn],
    abilities: {
      actionDestroyBanishTop2DeckGain1Action: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 2,
              },
              outputBinding: "it",
            },
            {
              type: "gain-action-points",
              amount: {
                type: "count",
                what: "banished-this-way",
                filter: {
                  typeBox: {
                    supertypes: ["Mechanologist"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
);

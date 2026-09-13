import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-goldmane-estate.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const visitGoldmaneEstate = definePitchFamily(fabPitchFamilies["visit-goldmane-estate"], {
  keywords: [
    {
      name: "specialization",
      hero: "Victor",
    },
    goAgain,
  ],
  abilities: () => ({
    createGoldTokenControlNumber3MoreGoldCreateManyMightTokens: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "gold",
            controller: "controller",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "controller",
                filter: { name: "Gold" },
              },
              comparison: { op: "gte", value: 3 },
            },
            then: {
              type: "create-token",
              token: "might",
              controller: "controller",
              count: {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "controller",
                filter: { name: "Gold" },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: visitGoldmaneEstateBlue } = visitGoldmaneEstate.cards;

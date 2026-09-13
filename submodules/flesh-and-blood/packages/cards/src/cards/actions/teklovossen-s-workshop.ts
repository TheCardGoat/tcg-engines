import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/teklovossen-s-workshop.generated.ts";

export const teklovossenSWorkshop = definePitchFamily(fabPitchFamilies["teklovossen-s-workshop"], {
  parameters: pitchMap({
    red: { value1: 1, value2: 2 },
    yellow: { value1: 1, value2: 1 },
    blue: { value1: 1, value2: 0 },
  }),
  keywords: [
    {
      name: "opt",
      value: {
        type: "x",
      },
    },
  ],
  abilities: ({ value1, value2 }) => ({
    resolutionOpt: {
      kind: "resolution",
      effect: {
        type: "opt",
        count: {
          type: "count",
          what: "boosts-this-combat-chain",
        },
      },
    },
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: value1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Mechanologist"],
                      subtypes: ["Item"],
                    },
                  },
                  {
                    numeric: [
                      {
                        property: "cost",
                        basis: "base",
                        comparison: {
                          op: "lte",
                          value: value2,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            then: {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "it",
              },
              to: {
                zone: "permanent",
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: teklovossenSWorkshopRed,
  yellow: teklovossenSWorkshopYellow,
  blue: teklovossenSWorkshopBlue,
} = teklovossenSWorkshop.cards;

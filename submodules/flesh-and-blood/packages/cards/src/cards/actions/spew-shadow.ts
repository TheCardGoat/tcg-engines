import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spew-shadow.generated.ts";

export const spewShadow = definePitchFamily(fabPitchFamilies["spew-shadow"], {
  parameters: pitchMap({ red: { value1: 2 }, yellow: { value1: 1 }, blue: { value1: 0 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["banished"],
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                  {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                  {
                    numeric: [
                      {
                        property: "cost",
                        basis: "base",
                        comparison: {
                          op: "lte",
                          value: value1,
                        },
                      },
                    ],
                  },
                ],
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              ...nextAttackActionLatch({ hasStatus: "attacks-a-light-hero" }),
              attacksOf: {
                binding: "it",
              },
            },
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: spewShadowRed,
  yellow: spewShadowYellow,
  blue: spewShadowBlue,
} = spewShadow.cards;

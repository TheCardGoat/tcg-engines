import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pour-the-mold.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const pourTheMold = definePitchFamily(fabPitchFamilies["pour-the-mold"], {
  parameters: {
    red: { value1: 2, value2: 1, value3: 1 },
    yellow: { value1: 1, value2: 1, value3: 1 },
    blue: { value1: 0, value2: 1, value3: 1 },
  },
  keywords: [goAgain],
  abilities: ({ value1, value2, value3 }) => ({
    moveCard: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          filter: {
            and: [
              {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Mechanologist"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                ],
              },
              {
                cost: {
                  op: "lte",
                  value: value1,
                },
              },
            ],
          },
          count: value2,
        },
        to: {
          zone: "permanent",
        },
        outputBinding: "it",
      },
    },
    performedThisTurnBoostAddCounterSteam: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      effect: {
        type: "add-counter",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: value3,
        target: {
          selector: "self",
        },
      },
    },
  }),
});

export const {
  red: pourTheMoldRed,
  yellow: pourTheMoldYellow,
  blue: pourTheMoldBlue,
} = pourTheMold.cards;

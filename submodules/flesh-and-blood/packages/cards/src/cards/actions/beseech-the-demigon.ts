import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/beseech-the-demigon.generated.ts";

export const beseechTheDemigon = definePitchFamily(fabPitchFamilies["beseech-the-demigon"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
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
              filter: attackActionFilter(),
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: value1,
            target: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const {
  red: beseechTheDemigonRed,
  yellow: beseechTheDemigonYellow,
  blue: beseechTheDemigonBlue,
} = beseechTheDemigon.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/beat-the-same-drum.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const beatTheSameDrum = definePitchFamily(fabPitchFamilies["beat-the-same-drum"], {
  keywords: [goAgain],
  abilities: () => ({
    ifVeControlledAgilityTokenTurnCreateAgilityToken: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: { name: "Agility" },
        per: "turn",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "agility",
            controller: "controller",
          },
          {
            type: "sequence",
            steps: [
              {
                type: "create-token",
                token: "confidence",
                controller: "controller",
              },
              {
                type: "create-token",
                token: "might",
                controller: "controller",
              },
              {
                type: "create-token",
                token: "toughness",
                controller: "controller",
              },
              {
                type: "create-token",
                token: "vigor",
                controller: "controller",
              },
            ],
          },
        ],
      },
    },
  }),
});
export const { blue: beatTheSameDrumBlue } = beatTheSameDrum.cards;

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/winter-s-bite.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const winterSBite = definePitchFamily(fabPitchFamilies["winter-s-bite"], {
  parameters: pitchMap({ red: { resources: 3 }, yellow: { resources: 2 }, blue: { resources: 1 } }),
  keywords: [goAgain],
  abilities: ({ resources }) => ({
    resolutionUnless: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["hand"],
            count: 1,
          },
        },
        escape: {
          type: "pay",
          cost: { class: "asset", type: "resources", amount: resources },
          payer: "opponent",
        },
      },
    },
  }),
});

export const {
  red: winterSBiteRed,
  yellow: winterSBiteYellow,
  blue: winterSBiteBlue,
} = winterSBite.cards;

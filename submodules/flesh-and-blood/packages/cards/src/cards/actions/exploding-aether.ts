import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/exploding-aether.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const explodingAether = definePitchFamily(fabPitchFamilies["exploding-aether"], {
  parameters: pitchMap({ red: { ampAmount: 3 }, yellow: { ampAmount: 2 }, blue: { ampAmount: 1 } }),
  keywords: pitchMap({
    red: [{ name: "amp", value: 3 }, goAgain],
    yellow: [{ name: "amp", value: 2 }, goAgain],
    blue: [{ name: "amp", value: 1 }, goAgain],
  }),
  abilities: ({ ampAmount }) => ({
    resolutionAmp: {
      kind: "resolution",
      effect: {
        type: "amp",
        amount: ampAmount,
      },
    },
  }),
});
export const {
  red: explodingAetherRed,
  yellow: explodingAetherYellow,
  blue: explodingAetherBlue,
} = explodingAether.cards;

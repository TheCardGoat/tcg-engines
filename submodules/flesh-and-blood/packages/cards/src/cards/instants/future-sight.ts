import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/future-sight.generated.ts";

export const futureSight = definePitchFamily(fabPitchFamilies["future-sight"], {
  parameters: pitchMap({ red: { count: 3 }, yellow: { count: 2 }, blue: { count: 1 } }),
  abilities: ({ count }) => ({
    createSigilOfFate: {
      type: "create-token",
      token: "sigil-of-fate",
      controller: "controller",
      count,
    },
  }),
});

export const {
  red: futureSightRed,
  yellow: futureSightYellow,
  blue: futureSightBlue,
} = futureSight.cards;

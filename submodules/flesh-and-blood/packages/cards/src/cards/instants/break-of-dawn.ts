import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/break-of-dawn.generated.ts";

export const breakOfDawn = definePitchFamily(fabPitchFamilies["break-of-dawn"], {
  parameters: pitchMap({
    red: 4,
    yellow: 3,
    blue: 2,
  }),
  abilities: (amount) => ({
    preventShadow: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      times: 1,
      duration: "this-turn",
      sourceFilter: {
        typeBox: {
          supertypes: ["Shadow"],
        },
      },
    },
  }),
});

export const {
  red: breakOfDawnRed,
  yellow: breakOfDawnYellow,
  blue: breakOfDawnBlue,
} = breakOfDawn.cards;

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-solace.generated.ts";

export const sigilOfSolace = definePitchFamily(fabPitchFamilies["sigil-of-solace"], {
  parameters: pitchMap({
    red: { lifeGain: 3 },
    yellow: { lifeGain: 2 },
    blue: { lifeGain: 1 },
  }),
  abilities: ({ lifeGain }) => ({
    gainLife: {
      type: "gain-life",
      amount: lifeGain,
      target: { selector: "controller" },
    },
  }),
});

export const {
  red: sigilOfSolaceRed,
  yellow: sigilOfSolaceYellow,
  blue: sigilOfSolaceBlue,
} = sigilOfSolace.cards;

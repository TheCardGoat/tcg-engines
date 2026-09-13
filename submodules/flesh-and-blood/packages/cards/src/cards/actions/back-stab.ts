import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/back-stab.generated.ts";

import { stealth } from "../shared/keywords.ts";

const abilities = {
  preventDefenseReactions: {
    kind: "resolution",
    effect: {
      type: "rule-modification",
      mode: "restrict",
      action: "play",
      filter: {
        typeBox: {
          types: ["Defense Reaction"],
        },
      },
      duration: "this-chain-link",
    },
  },
} as const;

export const backStab = definePitchFamily(fabPitchFamilies["back-stab"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const { red: backStabRed, yellow: backStabYellow, blue: backStabBlue } = backStab.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smashback-alehorn.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const smashbackAlehorn = definePitchFamily(fabPitchFamilies["smashback-alehorn"], {
  keywords: [goAgain],
  abilities: () => ({
    createAgilityMightToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "agility-and-a-might",
        controller: "controller",
      },
    },
  }),
});

export const { blue: smashbackAlehornBlue } = smashbackAlehorn.cards;

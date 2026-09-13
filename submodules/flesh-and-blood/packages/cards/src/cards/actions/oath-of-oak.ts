import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/oath-of-oak.generated.ts";

export const oathOfOak = definePitchFamily(fabPitchFamilies["oath-of-oak"], {
  abilities: () => ({
    createTokenEmbodimentOfEarth: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "embodiment-of-earth",
        controller: "controller",
        count: 3,
      },
    },
  }),
});
export const { red: oathOfOakRed, yellow: oathOfOakYellow, blue: oathOfOakBlue } = oathOfOak.cards;

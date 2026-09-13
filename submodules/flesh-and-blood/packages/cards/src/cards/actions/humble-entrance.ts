import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/humble-entrance.generated.ts";

export const humbleEntrance = definePitchFamily(fabPitchFamilies["humble-entrance"], {
  keywords: [goAgain],
  abilities: () => ({
    create3ToughnessTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "toughness",
        controller: "controller",
        count: 3,
      },
    },
  }),
});

export const { blue: humbleEntranceBlue } = humbleEntrance.cards;

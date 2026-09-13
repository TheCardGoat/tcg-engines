import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/void-wraith.generated.ts";

export const voidWraith = definePitchFamily(fabPitchFamilies["void-wraith"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
  }),
});

export const {
  red: voidWraithRed,
  yellow: voidWraithYellow,
  blue: voidWraithBlue,
} = voidWraith.cards;

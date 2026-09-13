import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ghostly-visit.generated.ts";
export const ghostlyVisit = definePitchFamily(fabPitchFamilies["ghostly-visit"], {
  keywords: [bloodDebt],
  abilities: () => ({
    staticPlay: {
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
  red: ghostlyVisitRed,
  yellow: ghostlyVisitYellow,
  blue: ghostlyVisitBlue,
} = ghostlyVisit.cards;

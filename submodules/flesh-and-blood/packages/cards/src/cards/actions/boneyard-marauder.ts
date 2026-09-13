import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/boneyard-marauder.generated.ts";

export const boneyardMarauder = definePitchFamily(fabPitchFamilies["boneyard-marauder"], {
  keywords: [bloodDebt],

  abilities: () => ({
    additionalCostBanish: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 3,
          random: true,
        },
      },
    },
  }),
});
export const {
  red: boneyardMarauderRed,
  yellow: boneyardMarauderYellow,
  blue: boneyardMarauderBlue,
} = boneyardMarauder.cards;

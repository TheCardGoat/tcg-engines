import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hungering-slaughterbeast.generated.ts";

export const hungeringSlaughterbeast = definePitchFamily(
  fabPitchFamilies["hungering-slaughterbeast"],
  {
    keywords: [bloodDebt],

    abilities: () => ({
      playBanish: {
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
  },
);
export const {
  red: hungeringSlaughterbeastRed,
  yellow: hungeringSlaughterbeastYellow,
  blue: hungeringSlaughterbeastBlue,
} = hungeringSlaughterbeast.cards;

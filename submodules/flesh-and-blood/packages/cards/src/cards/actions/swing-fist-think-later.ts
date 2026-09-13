import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swing-fist-think-later.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const swingFistThinkLater = definePitchFamily(fabPitchFamilies["swing-fist-think-later"], {
  keywords: [goAgain],
  abilities: () => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
  }),
});

export const {
  red: swingFistThinkLaterRed,
  yellow: swingFistThinkLaterYellow,
  blue: swingFistThinkLaterBlue,
} = swingFistThinkLater.cards;

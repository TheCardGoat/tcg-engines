import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/savage-swing.generated.ts";

export const savageSwing = definePitchFamily(fabPitchFamilies["savage-swing"], {
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
  red: savageSwingRed,
  yellow: savageSwingYellow,
  blue: savageSwingBlue,
} = savageSwing.cards;

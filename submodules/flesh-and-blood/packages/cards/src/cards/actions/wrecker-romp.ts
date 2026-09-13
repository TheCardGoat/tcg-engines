import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wrecker-romp.generated.ts";

export const wreckerRomp = definePitchFamily(fabPitchFamilies["wrecker-romp"], {
  abilities: () => ({
    additionalCost: {
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
  red: wreckerRompRed,
  yellow: wreckerRompYellow,
  blue: wreckerRompBlue,
} = wreckerRomp.cards;

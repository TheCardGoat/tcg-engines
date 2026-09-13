import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amplify-the-arknight.generated.ts";

export const amplifyTheArknight = definePitchFamily(fabPitchFamilies["amplify-the-arknight"], {
  parameters: pitchMap({
    red: { duration: "while-in-arena", self: true },
    yellow: { duration: "permanent", self: false },
    blue: { duration: "while-in-arena", self: true },
  }),
  abilities: ({ duration }) => ({
    staticContinuousModifyNumericCost: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Runechant",
          },
        },
        target: {
          selector: "self",
        },
        duration,
      },
    },
  }),
});

export const {
  red: amplifyTheArknightRed,
  yellow: amplifyTheArknightYellow,
  blue: amplifyTheArknightBlue,
} = amplifyTheArknight.cards;

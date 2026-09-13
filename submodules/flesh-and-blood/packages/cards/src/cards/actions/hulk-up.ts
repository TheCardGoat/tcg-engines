import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hulk-up.generated.ts";

export const hulkUp = definePitchFamily(fabPitchFamilies["hulk-up"], {
  abilities: () => ({
    playLifeComparisonResources: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "each-other-hero",
        op: "lt",
      },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
      },
    },
  }),
});
export const { red: hulkUpRed, yellow: hulkUpYellow, blue: hulkUpBlue } = hulkUp.cards;

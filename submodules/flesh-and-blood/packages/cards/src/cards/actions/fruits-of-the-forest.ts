import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fruits-of-the-forest.generated.ts";
export const fruitsOfTheForest = definePitchFamily(fabPitchFamilies["fruits-of-the-forest"], {
  abilities: () => ({
    activatedInstantGainLife: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "gain-life",
        amount: 2,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});
export const {
  red: fruitsOfTheForestRed,
  yellow: fruitsOfTheForestYellow,
  blue: fruitsOfTheForestBlue,
} = fruitsOfTheForest.cards;

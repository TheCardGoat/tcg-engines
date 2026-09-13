import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/express-lightning.generated.ts";
const abilities = {
  additionalCostStatic: {
    kind: "static",
    staticKind: "play",
    playEffect: {
      role: "additional-cost",
      cost: {
        class: "effect",
        type: "charge",
      },
      optional: true,
    },
    label: {
      name: "charge",
    },
  },
} as const;
export const expressLightning = definePitchFamily(fabPitchFamilies["express-lightning"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: expressLightningRed,
  yellow: expressLightningYellow,
  blue: expressLightningBlue,
} = expressLightning.cards;

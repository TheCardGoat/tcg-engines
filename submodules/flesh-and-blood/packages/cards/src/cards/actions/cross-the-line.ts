import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cross-the-line.generated.ts";
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
export const crossTheLine = definePitchFamily(fabPitchFamilies["cross-the-line"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: crossTheLineRed,
  yellow: crossTheLineYellow,
  blue: crossTheLineBlue,
} = crossTheLine.cards;

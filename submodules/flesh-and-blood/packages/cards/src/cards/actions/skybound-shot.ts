import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skybound-shot.generated.ts";

const abilities = {
  continuousModifyNumeric: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "has-counter",
      counter: {
        kind: "named",
        name: "aim",
      },
      target: {
        selector: "self",
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 1,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
} as const;

export const skyboundShot = definePitchFamily(fabPitchFamilies["skybound-shot"], {
  abilities: () => abilities,
});

export const {
  red: skyboundShotRed,
  yellow: skyboundShotYellow,
  blue: skyboundShotBlue,
} = skyboundShot.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/long-shot.generated.ts";

const abilities = {
  continuousHasCounterAimModifyNumericPowerPermanent: {
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
      amount: 2,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
} as const;

export const longShot = definePitchFamily(fabPitchFamilies["long-shot"], {
  abilities: () => ({ ...abilities }),
});

export const { red: longShotRed, yellow: longShotYellow, blue: longShotBlue } = longShot.cards;

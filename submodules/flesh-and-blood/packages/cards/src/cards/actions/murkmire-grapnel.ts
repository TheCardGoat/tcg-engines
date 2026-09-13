import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/murkmire-grapnel.generated.ts";

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
      amount: 1,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
  continuousRuleModificationRestrictBePreventedMurkmireGrapnelPermanent: {
    kind: "static",
    staticKind: "continuous",
    effect: {
      type: "rule-modification",
      mode: "restrict",
      action: "be-prevented",
      subject: {
        name: "Murkmire Grapnel",
      },
      duration: "permanent",
    },
  },
} as const;

export const murkmireGrapnel = definePitchFamily(fabPitchFamilies["murkmire-grapnel"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: murkmireGrapnelRed,
  yellow: murkmireGrapnelYellow,
  blue: murkmireGrapnelBlue,
} = murkmireGrapnel.cards;

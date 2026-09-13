import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/malign.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  continuousRuleModificationRestrictBePreventedMalignPermanent: {
    kind: "static",
    staticKind: "continuous",
    effect: {
      type: "rule-modification",
      mode: "restrict",
      action: "be-prevented",
      subject: {
        name: "Malign",
      },
      duration: "permanent",
    },
  },
} as const;

export const malign = definePitchFamily(fabPitchFamilies["malign"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const { red: malignRed, yellow: malignYellow, blue: malignBlue } = malign.cards;

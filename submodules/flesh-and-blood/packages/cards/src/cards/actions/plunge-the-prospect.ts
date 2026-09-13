import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plunge-the-prospect.generated.ts";

export const plungeTheProspect = definePitchFamily(fabPitchFamilies["plunge-the-prospect"], {
  keywords: [stealth],

  abilities: () => ({
    continuousHasStatusAttackingAMarkedHeroModifyNumericPowerThisTurn: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "attacking-a-marked-hero",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const {
  red: plungeTheProspectRed,
  yellow: plungeTheProspectYellow,
  blue: plungeTheProspectBlue,
} = plungeTheProspect.cards;

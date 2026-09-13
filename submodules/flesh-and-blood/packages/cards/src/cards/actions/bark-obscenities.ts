import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bark-obscenities.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const barkObscenities = definePitchFamily(fabPitchFamilies["bark-obscenities"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTargetsGuardianHeroTurnGets4: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "targets-a-guardian-hero",
          },
        },
      },
    },
  }),
});
export const { red: barkObscenitiesRed } = barkObscenities.cards;

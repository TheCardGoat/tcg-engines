import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/en-garde.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const enGarde = definePitchFamily(fabPitchFamilies["en-garde"], {
  keywords: [goAgain],
  abilities: () => ({
    nextWeaponAttackTurnGains3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
    },
  }),
});
export const { red: enGardeRed } = enGarde.cards;

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hit-and-run.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const hitAndRun = definePitchFamily(fabPitchFamilies["hit-and-run"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  keywords: [goAgain],
  abilities: (amount) => ({
    grantPropertyThisTurn: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
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
    performedThisTurnAttackWithWeaponModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "attack-with-weapon",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const { red: hitAndRunRed, yellow: hitAndRunYellow, blue: hitAndRunBlue } = hitAndRun.cards;

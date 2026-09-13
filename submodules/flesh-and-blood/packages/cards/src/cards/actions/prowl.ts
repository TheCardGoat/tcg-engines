import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prowl.generated.ts";

export const prowl = definePitchFamily(fabPitchFamilies["prowl"], {
  keywords: [stealth],

  abilities: () => ({
    modifyNumericPowerThisCombatChain: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-combat-chain",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasKeyword: "stealth",
          },
        },
      },
    },
  }),
});
export const { red: prowlRed, yellow: prowlYellow, blue: prowlBlue } = prowl.cards;

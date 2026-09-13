import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dauntless.generated.ts";
import { goAgain } from "../shared/keywords.ts";
/** Model notes (hand-authored): next DR cost bump filters Defense Reaction, not a duplicated Reaction subtype. */
export const dauntless = definePitchFamily(fabPitchFamilies["dauntless"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionModifyNumericPower: {
      kind: "resolution",
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
              types: ["Weapon"],
            },
          },
        },
      },
    },
    resolutionModifyNumericCost: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Defense Reaction"],
            },
            hasStatus: "played-by-defending-hero",
          },
        },
      },
    },
  }),
});
export const { red: dauntlessRed, yellow: dauntlessYellow, blue: dauntlessBlue } = dauntless.cards;

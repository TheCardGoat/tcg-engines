import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flash.generated.ts";

export const flash = definePitchFamily(fabPitchFamilies["flash"], {
  keywords: [goAgain],

  abilities: () => ({
    grantProperty: {
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
              types: ["Action"],
            },
            cost: {
              op: "gte",
              value: 0,
            },
          },
        },
      },
    },
  }),
});
export const { red: flashRed, yellow: flashYellow, blue: flashBlue } = flash.cards;

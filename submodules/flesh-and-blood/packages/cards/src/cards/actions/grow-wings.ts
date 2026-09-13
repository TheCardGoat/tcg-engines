import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/grow-wings.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const growWings = definePitchFamily(fabPitchFamilies["grow-wings"], {
  abilities: () => ({
    resolutionLastAttackCombatChainGrantProperty: {
      kind: "resolution",
      condition: {
        type: "last-attack-this-combat-chain",
        filter: {
          typeBox: {
            supertypes: ["Draconic"],
            subtypes: ["Attack"],
          },
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: growWingsRed, yellow: growWingsYellow, blue: growWingsBlue } = growWings.cards;

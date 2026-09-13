import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/grow-claws.generated.ts";
import { goAgain } from "../shared/keywords.ts";
const abilities = {
  increasePowerAfterDraconicAttack: {
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
} as const;
export const growClaws = definePitchFamily(fabPitchFamilies["grow-claws"], {
  abilities: () => ({
    ...abilities,
    grantGoAgain: {
      kind: "resolution",
      effect: grantKeyword(goAgain, { target: { selector: "self" } }),
    },
  }),
});
export const { red: growClawsRed, yellow: growClawsYellow, blue: growClawsBlue } = growClaws.cards;

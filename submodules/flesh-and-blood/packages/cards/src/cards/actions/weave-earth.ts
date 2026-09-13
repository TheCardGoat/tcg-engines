import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/weave-earth.generated.ts";

export const weaveEarth = definePitchFamily(fabPitchFamilies["weave-earth"], {
  keywords: [goAgain],

  abilities: () => ({
    empowerNextEarthOrElementalAttack: {
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
        appliesTo: nextAttackActionLatch({
          or: [
            {
              typeBox: {
                supertypes: ["Earth"],
              },
            },
            {
              typeBox: {
                supertypes: ["Elemental"],
              },
            },
          ],
        }),
      },
    },
    empowerNextFusedAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
          hasStatus: "fused",
          or: [
            {
              typeBox: {
                supertypes: ["Earth"],
              },
            },
            {
              typeBox: {
                supertypes: ["Elemental"],
              },
            },
          ],
        }),
      },
    },
  }),
});
export const {
  red: weaveEarthRed,
  yellow: weaveEarthYellow,
  blue: weaveEarthBlue,
} = weaveEarth.cards;

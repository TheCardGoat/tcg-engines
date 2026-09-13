import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prime-the-crowd.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const primeTheCrowd = definePitchFamily(fabPitchFamilies["prime-the-crowd"], {
  parameters: {
    red: { powerBonus: 4 },
    yellow: { powerBonus: 3 },
    blue: { powerBonus: 2 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: powerBonus,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
    cheerRevered: {
      kind: "resolution",
      effect: {
        type: "crowd-cheers",
        target: "each",
        filter: { typeBox: { traits: ["Revered"] } },
      },
    },
    booReviled: {
      kind: "resolution",
      effect: {
        type: "crowd-boos",
        target: "each",
        filter: { typeBox: { supertypes: ["Reviled"] } },
      },
    },
  }),
});

export const {
  red: primeTheCrowdRed,
  yellow: primeTheCrowdYellow,
  blue: primeTheCrowdBlue,
} = primeTheCrowd.cards;

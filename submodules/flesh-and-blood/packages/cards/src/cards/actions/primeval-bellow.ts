import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/primeval-bellow.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const primevalBellow = definePitchFamily(fabPitchFamilies["primeval-bellow"], {
  parameters: { red: 5, yellow: 4, blue: 3 },
  keywords: [goAgain],
  abilities: (amount) => ({
    additionalCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
    nextBruteAttack: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: {
        next: {
          typeBox: {
            supertypes: ["Brute"],
          },
        },
      },
    },
  }),
});

export const {
  red: primevalBellowRed,
  yellow: primevalBellowYellow,
  blue: primevalBellowBlue,
} = primevalBellow.cards;

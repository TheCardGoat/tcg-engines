import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bonebreaker-bellow.generated.ts";

import { beatChest, goAgain } from "../shared/keywords.ts";

const nextBruteAttack = {
  selector: "this-attack",
} as const;

const nextBrute = {
  next: {
    typeBox: {
      supertypes: ["Brute"],
    },
  },
} as const;

export const bonebreakerBellow = definePitchFamily(fabPitchFamilies["bonebreaker-bellow"], {
  parameters: pitchMap({
    red: { amount: 3, chestAmount: 5 },
    yellow: { amount: 2, chestAmount: 4 },
    blue: { amount: 1, chestAmount: 3 },
  }),
  keywords: [beatChest, goAgain],
  abilities: ({ amount, chestAmount }) => ({
    resolutionSequence: {
      kind: "resolution",
      // CR 6.4.7: condition is known at generation; keep appliesTo.next.
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount,
            target: nextBruteAttack,
            duration: "this-turn",
            appliesTo: nextBrute,
          },
          {
            type: "self-replacement",
            condition: { type: "performed-this-turn", event: "beat-chest", player: "controller" },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: chestAmount,
              target: nextBruteAttack,
              duration: "this-turn",
              appliesTo: nextBrute,
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: bonebreakerBellowRed,
  yellow: bonebreakerBellowYellow,
  blue: bonebreakerBellowBlue,
} = bonebreakerBellow.cards;

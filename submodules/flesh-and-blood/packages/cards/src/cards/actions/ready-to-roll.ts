import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ready-to-roll.generated.ts";

export const readyToRoll = definePitchFamily(fabPitchFamilies["ready-to-roll"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kayo",
    },
    goAgain,
  ],
  abilities: () => ({
    roll1MoreDiceTurnInsteadRollManyDicePlus1IgnoreLowestRoll: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "roll",
        },
        modification: {
          type: "roll",
          sides: 6,
          extraDice: 1,
          ignore: "lowest",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: readyToRollBlue } = readyToRoll.cards;

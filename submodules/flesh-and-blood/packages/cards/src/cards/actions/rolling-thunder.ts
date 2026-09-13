import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rolling-thunder.generated.ts";

export const rollingThunder = definePitchFamily(fabPitchFamilies["rolling-thunder"], {
  keywords: [goAgain],
  abilities: () => ({
    roll6SidedDieNextBruteAttackTurnGainsXPowerWhereXNumberRolled: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: {
              type: "roll-result",
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: rollingThunderRed } = rollingThunder.cards;

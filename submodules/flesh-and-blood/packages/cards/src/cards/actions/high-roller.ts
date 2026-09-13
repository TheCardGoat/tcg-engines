import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/high-roller.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const highRoller = definePitchFamily(fabPitchFamilies["high-roller"], {
  keywords: [goAgain],
  abilities: () => ({
    sequenceRollConditionalPerformedThisTurnRoll4OrHigherRepeatIntimidate: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "conditional",
            condition: {
              type: "performed-this-turn",
              event: "roll-4-or-higher",
              player: "controller",
            },
            then: {
              type: "repeat",
              effect: {
                type: "intimidate",
                target: "opponent",
              },
              times: 2,
            },
            else: {
              type: "intimidate",
              target: "opponent",
            },
          },
        ],
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const {
  red: highRollerRed,
  yellow: highRollerYellow,
  blue: highRollerBlue,
} = highRoller.cards;

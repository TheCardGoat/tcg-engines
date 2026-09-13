import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rumble-grunting.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const rumbleGrunting = definePitchFamily(fabPitchFamilies["rumble-grunting"], {
  parameters: { red: 4, yellow: 3, blue: 2 },
  keywords: [goAgain],
  abilities: (amount) => ({
    playPerformedThisTurnDiscardPower6: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
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
    },
  }),
});

export const {
  red: rumbleGruntingRed,
  yellow: rumbleGruntingYellow,
  blue: rumbleGruntingBlue,
} = rumbleGrunting.cards;

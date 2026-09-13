import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/madcap-muscle.generated.ts";

export const madcapMuscle = definePitchFamily(fabPitchFamilies["madcap-muscle"], {
  abilities: () => ({
    playDiscard: {
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
    bindingMatchesModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "binding-matches",
        binding: "discardedCard",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: madcapMuscleRed,
  yellow: madcapMuscleYellow,
  blue: madcapMuscleBlue,
} = madcapMuscle.cards;
